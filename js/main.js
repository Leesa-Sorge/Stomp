/* main.js — Entry point & controller for Western Pest Control: The Stomp */

const GameController = (() => {

  const canvas   = document.getElementById('gameCanvas');
  const logoCV   = document.getElementById('logoCanvas');
  const stompEl  = document.getElementById('stompCounter');
  const statusEl = document.getElementById('statusMsg');
  const lineupEl = document.getElementById('lineupBugs');

  let gameState = Game.createState();
  let rafId     = null;
  let running   = false;

  const STATUS_MESSAGES = [
    'Warming up the boot...',
    'Stomping the competition!',
    'Southern Utah is watching!',
    'Here For Good — since 2001!',
    'One more down!',
  ];

  // ── Draw mini logo on header canvas ──────────────────────────
  function drawHeaderLogo() {
    const ctx = logoCV.getContext('2d');
    ctx.clearRect(0, 0, 60, 60);
    Renderer.drawWesternShield(ctx, 30, 30, 0.65);
  }

  // ── Build lineup cards ────────────────────────────────────────
  function buildLineup() {
    lineupEl.innerHTML = '';
    Game.COMPANIES.forEach((co, i) => {
      const card = document.createElement('div');
      card.className = 'lineup-card';
      card.id = `lineupCard-${i}`;
      card.innerHTML = `
        <span class="card-emoji">${co.cardEmoji}</span>
        <div class="card-name">${co.shortName}</div>
      `;
      lineupEl.appendChild(card);
    });
  }

  // ── Update UI elements ────────────────────────────────────────
  function updateHUD(s) {
    stompEl.textContent = `STOMPED: ${s.stompCount} / 5`;

    if (s.phase === 'idle') {
      statusEl.textContent = 'Ready to protect Southern Utah?';
    } else if (s.phase === 'victory') {
      statusEl.textContent = '🏆 ALL 5 COMPETITORS STOMPED — Here For Good!';
    } else if (s.phase === 'intro' || s.phase === 'taunt') {
      const co = Game.COMPANIES[s.compIdx];
      statusEl.textContent = `Round ${s.compIdx + 1}: ${co.shortName} enters the arena...`;
    } else if (s.phase === 'squish') {
      statusEl.textContent = STATUS_MESSAGES[s.compIdx] || 'Stomped!';
    }

    // Mark stomped cards
    Game.COMPANIES.forEach((_, i) => {
      const card = document.getElementById(`lineupCard-${i}`);
      if (!card) return;
      if (i < s.stompCount) {
        card.classList.add('stomped');
        if (!card.querySelector('.stomp-check')) {
          const check = document.createElement('span');
          check.className = 'stomp-check';
          check.textContent = ' 🥾';
          card.appendChild(check);
        }
      }
    });
  }

  // ── Animation loop ────────────────────────────────────────────
  function loop() {
    gameState = Game.update(gameState);
    Game.draw(canvas, gameState);
    updateHUD(gameState);

    if (gameState.phase === 'victory' && gameState.victoryTimer > 200) {
      running = false;
      statusEl.textContent = '🏆 WESTERN WINS! Here For Good. Click RESTART to stomp again!';
      return;
    }

    if (running) {
      rafId = requestAnimationFrame(loop);
    }
  }

  // ── Public API ────────────────────────────────────────────────
  function start() {
    if (running) return;
    gameState = Game.createState();
    gameState.phase = 'intro';
    gameState.bugEntranceX = Renderer.W + 120;
    ParticleSystem.reset();
    running = true;

    // Reset lineup cards
    Game.COMPANIES.forEach((_, i) => {
      const card = document.getElementById(`lineupCard-${i}`);
      if (card) {
        card.classList.remove('stomped');
        const check = card.querySelector('.stomp-check');
        if (check) check.remove();
      }
    });

    statusEl.textContent = 'The stomp has begun!';
    rafId = requestAnimationFrame(loop);
  }

  function restart() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    ParticleSystem.reset();
    gameState = Game.createState();
    Game.draw(canvas, gameState);
    updateHUD(gameState);

    // Reset cards
    Game.COMPANIES.forEach((_, i) => {
      const card = document.getElementById(`lineupCard-${i}`);
      if (card) {
        card.classList.remove('stomped');
        const check = card.querySelector('.stomp-check');
        if (check) check.remove();
      }
    });

    statusEl.textContent = 'Ready to protect Southern Utah?';
  }

  // ── Init ──────────────────────────────────────────────────────
  function init() {
    drawHeaderLogo();
    buildLineup();
    Game.draw(canvas, gameState); // draw idle screen
  }

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { start, restart };

})();
