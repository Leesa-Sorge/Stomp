/* game.js — Game state machine for Western Pest Control: The Stomp */

const Game = (() => {

  const { W, H, GROUND_Y } = Renderer;

  // ── Company data ─────────────────────────────────────────────
  const COMPANIES = [
    {
      name: "Your Husband's\nPest Control",
      shortName: "Your Husband's Pest Control",
      tagline: '"He watched a YouTube video!"',
      stompLine: 'Sir, put down\nthe Raid!',
      color: '#8B4513',
      bugType: 'cockroach',
      emoji: '🪳',
      cardEmoji: '🔧',
    },
    {
      name: "Throw Your Shoe\nAt It Pest Control",
      shortName: "Throw Your Shoe At It",
      tagline: '"Now you\'re barefoot AND infested!"',
      stompLine: 'That\'s a $200 heel,\nlady!',
      color: '#CC3333',
      bugType: 'ant',
      emoji: '🐜',
      cardEmoji: '👟',
    },
    {
      name: "Pinterest DIY\nPest Solutions",
      shortName: "Pinterest DIY Pest Solutions",
      tagline: '"Lavender oil repels EVERYTHING!"',
      stompLine: 'The ants loved\nyour essential oils.',
      color: '#C2185B',
      bugType: 'spider',
      emoji: '🕷️',
      cardEmoji: '📌',
    },
    {
      name: "My Neighbor Dave's\nExterminating Co.",
      shortName: "My Neighbor Dave's",
      tagline: '"He did his own house once!"',
      stompLine: 'Dave doesn\'t even\nhave a license!',
      color: '#4a6a2a',
      bugType: 'scorpion',
      emoji: '🦂',
      cardEmoji: '🏘️',
    },
    {
      name: "Hope & Pray\nPest Management",
      shortName: "Hope & Pray Pest Mgmt",
      tagline: '"Maybe they\'ll just leave?"',
      stompLine: 'They multiplied.\nCall Western.',
      color: '#5a3aa0',
      bugType: 'silverfish',
      emoji: '🐛',
      cardEmoji: '🙏',
    },
  ];

  // ── Constants ─────────────────────────────────────────────────
  const BOOT_X       = W / 2;
  const BOOT_IDLE_Y  = 90;
  const BOOT_STOMP_Y = GROUND_Y - 35;
  const BUG_X        = W / 2;
  const BUG_Y        = GROUND_Y - 50;

  // ── State ─────────────────────────────────────────────────────
  let state = {};

  function createState() {
    return {
      phase: 'idle',       // idle | intro | taunt | incoming | descend | squish | bounce | exit | victory
      compIdx: 0,
      stompCount: 0,
      timer: 0,
      walkFrame: 0,
      bootY: BOOT_IDLE_Y,
      squish: 0,
      bugVisible: true,
      bubbleText: '',
      bubbleAlpha: 0,
      bubbleSide: 'bug',   // bug | boot
      stompFlashAlpha: 0,
      introAlpha: 0,
      victoryTimer: 0,
      shakeX: 0,
      shakeY: 0,
      roundText: '',
      roundAlpha: 0,
      bugEntranceX: BUG_X,
    };
  }

  // ── Easing ────────────────────────────────────────────────────
  function easeInCubic(t)  { return t * t * t; }
  function easeOutBounce(t) {
    const n1 = 7.5625, d1 = 2.75;
    if (t < 1/d1)      return n1*t*t;
    if (t < 2/d1)      return n1*(t-=1.5/d1)*t+0.75;
    if (t < 2.5/d1)    return n1*(t-=2.25/d1)*t+0.9375;
    return n1*(t-=2.625/d1)*t+0.984375;
  }

  // ── Phase transitions ─────────────────────────────────────────
  function nextPhase(s, phase) {
    s.phase = phase;
    s.timer = 0;
  }

  // ── Update ────────────────────────────────────────────────────
  function update(s) {
    if (s.phase === 'idle') return s;
    if (s.phase === 'victory') {
      s.victoryTimer++;
      ParticleSystem.update();
      s.shakeX *= 0.8;
      s.shakeY *= 0.8;
      return s;
    }

    s.timer++;
    s.walkFrame++;
    s.shakeX *= 0.72;
    s.shakeY *= 0.72;
    ParticleSystem.update();

    // Bubble fade
    if (s.bubbleAlpha > 0) s.bubbleAlpha = Math.max(0, s.bubbleAlpha - 0.008);

    const co = COMPANIES[s.compIdx];

    // ── intro ──
    if (s.phase === 'intro') {
      s.introAlpha = Math.min(1, s.timer / 20);
      // Bug entrance slide-in
      const slideProgress = Math.min(1, s.timer / 40);
      s.bugEntranceX = W + 120 - (W + 120 - BUG_X) * easeOutBounce(slideProgress);

      if (s.timer > 80) {
        s.bugEntranceX = BUG_X;
        nextPhase(s, 'taunt');
        s.bubbleText = co.tagline;
        s.bubbleAlpha = 1;
        s.bubbleSide = 'bug';
      }
    }

    // ── taunt ──
    else if (s.phase === 'taunt') {
      if (s.timer > 90) {
        nextPhase(s, 'incoming');
        s.bubbleText = '⚠️ WESTERN BOOTS\nON THE GROUND!';
        s.bubbleAlpha = 1;
        s.bubbleSide = 'boot';
      }
    }

    // ── incoming ──
    else if (s.phase === 'incoming') {
      if (s.timer > 50) {
        nextPhase(s, 'descend');
        s.bubbleText = '';
        s.bubbleAlpha = 0;
      }
    }

    // ── descend ──
    else if (s.phase === 'descend') {
      const dur = 38;
      const t = Math.min(1, s.timer / dur);
      const eased = easeInCubic(t);
      s.bootY = BOOT_IDLE_Y + (BOOT_STOMP_Y - BOOT_IDLE_Y) * eased;

      if (t >= 1) {
        nextPhase(s, 'squish');
        ParticleSystem.spawnImpact(BUG_X, BUG_Y, co.color, 32);
        ParticleSystem.spawnDirt(BUG_X, GROUND_Y);
        ParticleSystem.spawnShockwave(BUG_X, GROUND_Y);
        ParticleSystem.spawnGoldStars(BUG_X, BUG_Y - 20);
        ParticleSystem.spawnFloatingText(BUG_X - 80, BUG_Y - 40, 'STOMP!', '#C88A12');
        ParticleSystem.spawnFloatingText(BUG_X + 60, BUG_Y - 70, '💥 STOMPED!', '#fff');
        s.shakeX = (Math.random() - 0.5) * 28;
        s.shakeY = (Math.random() - 0.5) * 18;
        s.stompFlashAlpha = 1;
        s.bubbleText = co.stompLine;
        s.bubbleAlpha = 1;
        s.bubbleSide = 'boot';
      }
    }

    // ── squish ──
    else if (s.phase === 'squish') {
      s.squish = Math.min(1, s.timer / 20);
      s.stompFlashAlpha = Math.max(0, s.stompFlashAlpha - 0.04);

      if (s.timer > 70) {
        nextPhase(s, 'bounce');
        s.stompCount++;
      }
    }

    // ── bounce ──
    else if (s.phase === 'bounce') {
      const t = s.timer / 50;
      s.bootY = BOOT_STOMP_Y - Math.abs(Math.sin(t * Math.PI * 1.5)) * 80;
      s.squish = Math.max(0, s.squish - 0.03);

      if (s.timer > 55) {
        nextPhase(s, 'exit');
      }
    }

    // ── exit ──
    else if (s.phase === 'exit') {
      s.squish = Math.min(1, s.squish + 0.04);
      s.bootY = Math.max(BOOT_IDLE_Y - 100, s.bootY - 5);
      if (s.timer > 30) {
        if (s.compIdx < COMPANIES.length - 1) {
          s.compIdx++;
          s.squish = 0;
          s.bootY = BOOT_IDLE_Y;
          s.bugEntranceX = W + 120;
          nextPhase(s, 'intro');
        } else {
          nextPhase(s, 'victory');
          ParticleSystem.spawnGoldStars(W/2, H/2);
          ParticleSystem.spawnImpact(W/2, H/2, '#C88A12', 40);
        }
      }
    }

    return s;
  }

  // ── Draw ─────────────────────────────────────────────────────
  function draw(canvas, s) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, W, H);

    if (s.phase === 'idle') {
      Renderer.drawIdle(ctx);
      return;
    }

    const co = COMPANIES[s.compIdx];
    const sx = s.shakeX, sy = s.shakeY;

    Renderer.drawBackground(ctx, sx, sy);
    ParticleSystem.draw(ctx);

    // ── Draw bug ──
    if (s.phase !== 'victory') {
      const bugX = s.bugEntranceX;
      const bobY = Math.sin(s.walkFrame * 0.12) * 4;
      const bugDrawY = BUG_Y + bobY + sy;
      const bugDrawX = bugX + sx;

      ctx.save();
      switch (co.bugType) {
        case 'cockroach': BugArt.drawCockroach(ctx, bugDrawX, bugDrawY, s.squish, s.walkFrame); break;
        case 'ant':       BugArt.drawAnt(ctx, bugDrawX, bugDrawY, s.squish, s.walkFrame); break;
        case 'spider':    BugArt.drawSpider(ctx, bugDrawX, bugDrawY, s.squish, s.walkFrame); break;
        case 'scorpion':  BugArt.drawScorpion(ctx, bugDrawX, bugDrawY, s.squish, s.walkFrame); break;
        case 'silverfish':BugArt.drawSilverfish(ctx, bugDrawX, bugDrawY, s.squish, s.walkFrame); break;
      }
      ctx.restore();

      // Company name floating above bug (before stomp)
      if (s.squish < 0.3 && s.phase !== 'exit') {
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - s.squish * 3);
        const nameLines = co.name.split('\n');
        ctx.font = 'bold 14px "Comic Neue", cursive';
        ctx.fillStyle = co.color;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.textAlign = 'center';
        nameLines.forEach((line, i) => {
          const labelY = BUG_Y - 70 - (nameLines.length - 1 - i) * 18 + sy;
          ctx.strokeText(line, bugX + sx, labelY);
          ctx.fillText(line, bugX + sx, labelY);
        });
        ctx.restore();
      }

      // Bug speech bubble
      if (s.bubbleSide === 'bug' && s.bubbleAlpha > 0) {
        Renderer.drawSpeechBubble(ctx, s.bubbleText, bugX + sx, BUG_Y - 80 + sy, s.bubbleAlpha);
      }

      // Boot
      Renderer.drawBoot(ctx, BOOT_X, s.bootY, sx * 0.5, sy * 0.5);

      // Boot speech bubble
      if (s.bubbleSide === 'boot' && s.bubbleAlpha > 0) {
        Renderer.drawSpeechBubble(ctx, s.bubbleText, BOOT_X, s.bootY - 95, s.bubbleAlpha);
      }

      // Stomp flash
      if (s.stompFlashAlpha > 0) {
        Renderer.drawStompFlash(ctx, s.stompFlashAlpha);
      }

      // Round intro text
      if (s.phase === 'intro' && s.introAlpha > 0 && s.timer < 50) {
        const t = s.timer < 25 ? s.timer / 25 : Math.max(0, 1 - (s.timer - 50) / 15);
        Renderer.drawRoundIntro(ctx, `ROUND ${s.compIdx + 1}: ${co.shortName.toUpperCase()}`, t);
      }
    }

    // Victory
    if (s.phase === 'victory') {
      Renderer.drawVictory(ctx, s.victoryTimer);
    }

    // Scoreboard always on top
    Renderer.drawScoreboard(ctx, s.stompCount);
  }

  // ── Public ────────────────────────────────────────────────────
  return {
    COMPANIES,
    createState,
    update,
    draw,
  };

})();
