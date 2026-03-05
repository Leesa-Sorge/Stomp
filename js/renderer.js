/* renderer.js — Scene rendering for Western Pest Control: The Stomp */

const Renderer = (() => {

  const W = 800;
  const H = 500;
  const GROUND_Y = 400;

  // ── Western Logo Shield ──────────────────────────────────────
  function drawWesternShield(ctx, x, y, size = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size, size);

    ctx.shadowColor = '#C88A12';
    ctx.shadowBlur = 18;

    // Shield outline
    ctx.beginPath();
    ctx.moveTo(0, -40);
    ctx.lineTo(32, -22);
    ctx.lineTo(32, 12);
    ctx.quadraticCurveTo(32, 38, 0, 48);
    ctx.quadraticCurveTo(-32, 38, -32, 12);
    ctx.lineTo(-32, -22);
    ctx.closePath();
    ctx.fillStyle = '#00457C';
    ctx.fill();
    ctx.strokeStyle = '#C88A12';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.shadowBlur = 0;

    // "W" letter
    ctx.font = 'bold 26px "Bebas Neue", cursive';
    ctx.fillStyle = '#C88A12';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('W', 0, -8);

    // "WESTERN" text
    ctx.font = 'bold 8px Oswald, sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText('WESTERN', 0, 16);
    ctx.font = '7px Oswald, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.fillText('PEST CONTROL', 0, 27);

    ctx.restore();
  }

  // ── Mini logo for canvas header ──────────────────────────────
  function drawMiniLogo(ctx, x, y) {
    drawWesternShield(ctx, x, y, 0.55);
  }

  // ── Background ───────────────────────────────────────────────
  function drawBackground(ctx, shakeX = 0, shakeY = 0) {
    ctx.save();
    ctx.translate(shakeX, shakeY);

    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
    sky.addColorStop(0, '#0a1e35');
    sky.addColorStop(0.6, '#0d2d50');
    sky.addColorStop(1, '#1a4570');
    ctx.fillStyle = sky;
    ctx.fillRect(-5, -5, W + 10, GROUND_Y + 5);

    // Stars in sky
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    const starData = [
      [60,30],[180,55],[300,20],[450,45],[580,28],[700,60],[760,18],
      [120,80],[350,75],[620,82],[50,110],[400,100],[720,92]
    ];
    starData.forEach(([sx, sy]) => {
      ctx.beginPath();
      ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Horizon glow
    const hGlow = ctx.createLinearGradient(0, GROUND_Y - 60, 0, GROUND_Y);
    hGlow.addColorStop(0, 'rgba(200,138,18,0)');
    hGlow.addColorStop(1, 'rgba(200,138,18,0.15)');
    ctx.fillStyle = hGlow;
    ctx.fillRect(0, GROUND_Y - 60, W, 60);

    // Ground
    const ground = ctx.createLinearGradient(0, GROUND_Y, 0, H);
    ground.addColorStop(0, '#8B5E1A');
    ground.addColorStop(0.3, '#6B4510');
    ground.addColorStop(1, '#3a2008');
    ctx.fillStyle = ground;
    ctx.fillRect(-5, GROUND_Y, W + 10, H - GROUND_Y + 5);

    // Ground texture lines
    ctx.strokeStyle = 'rgba(200,138,18,0.25)';
    ctx.lineWidth = 1;
    for (let gx = 0; gx < W; gx += 60) {
      ctx.beginPath();
      ctx.moveTo(gx, GROUND_Y);
      ctx.lineTo(gx - 30, H);
      ctx.stroke();
    }

    // Ground top edge
    const edgeGrad = ctx.createLinearGradient(0, 0, W, 0);
    edgeGrad.addColorStop(0, '#C88A12');
    edgeGrad.addColorStop(0.5, '#E8AA22');
    edgeGrad.addColorStop(1, '#C88A12');
    ctx.strokeStyle = edgeGrad;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(W, GROUND_Y);
    ctx.stroke();

    // Arena label
    ctx.font = '11px Oswald, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.textAlign = 'center';
    ctx.fillText('🏟️ WESTERN PEST CONTROL ARENA — ST. GEORGE, UT', W / 2, GROUND_Y + 16);

    ctx.restore();
  }

  // ── Header scoreboard bar ────────────────────────────────────
  function drawScoreboard(ctx, stompCount) {
    ctx.save();

    const h = 54;
    const bg = ctx.createLinearGradient(0, 0, W, 0);
    bg.addColorStop(0, '#002d52');
    bg.addColorStop(0.5, '#00457C');
    bg.addColorStop(1, '#002d52');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, h);

    ctx.strokeStyle = '#C88A12';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(W, h);
    ctx.stroke();

    drawMiniLogo(ctx, 30, h / 2);

    ctx.font = 'bold 22px "Bebas Neue", cursive';
    ctx.fillStyle = '#C88A12';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('WESTERN PEST CONTROL', 58, h / 2 - 4);

    ctx.font = '11px Oswald, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.fillText('HERE FOR GOOD · SINCE 2001', 60, h / 2 + 13);

    // Stomp counter
    ctx.font = 'bold 20px "Bebas Neue", cursive';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'right';
    ctx.fillText(`STOMPED: ${stompCount} / 5`, W - 16, h / 2 - 3);

    // Mini stomp indicators
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = i < stompCount ? '#C88A12' : 'rgba(255,255,255,0.15)';
      ctx.beginPath();
      ctx.arc(W - 100 + i * 18, h / 2 + 14, 6, 0, Math.PI * 2);
      ctx.fill();
      if (i < stompCount) {
        ctx.font = '8px serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.fillText('🥾', W - 100 + i * 18, h / 2 + 18);
      }
    }

    ctx.restore();
  }

  // ── Western Boot ────────────────────────────────────────────
  function drawBoot(ctx, x, y, shakeX = 0, shakeY = 0) {
    ctx.save();
    ctx.translate(x + shakeX, y + shakeY);

    // Leg (pants)
    const pantsGrad = ctx.createLinearGradient(-22, -130, 22, -70);
    pantsGrad.addColorStop(0, '#1a3a6a');
    pantsGrad.addColorStop(1, '#0d2a50');
    ctx.fillStyle = pantsGrad;
    ctx.beginPath();
    ctx.roundRect(-22, -130, 44, 65, [4, 4, 0, 0]);
    ctx.fill();

    // Belt at top
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-22, -134, 44, 8);
    ctx.fillStyle = '#C88A12';
    ctx.fillRect(-5, -136, 10, 12);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.strokeRect(-5, -136, 10, 12);

    // Pant seam
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -130);
    ctx.lineTo(0, -65);
    ctx.stroke();

    // Western logo on pants
    ctx.font = 'bold 11px "Bebas Neue", cursive';
    ctx.fillStyle = '#C88A12';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('WESTERN', 0, -105);

    // Boot shaft
    const shaftGrad = ctx.createLinearGradient(-24, -70, 24, -20);
    shaftGrad.addColorStop(0, '#2a1810');
    shaftGrad.addColorStop(1, '#1a0e08');
    ctx.fillStyle = shaftGrad;
    ctx.beginPath();
    ctx.roundRect(-22, -70, 44, 55, [2, 2, 0, 0]);
    ctx.fill();

    // Stitching on shaft
    ctx.strokeStyle = 'rgba(200,138,18,0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.strokeRect(-18, -66, 36, 47);
    ctx.setLineDash([]);

    // Toe box
    const toeGrad = ctx.createLinearGradient(-34, -20, 34, 20);
    toeGrad.addColorStop(0, '#3d2518');
    toeGrad.addColorStop(0.5, '#2a1810');
    toeGrad.addColorStop(1, '#1a0e08');
    ctx.fillStyle = toeGrad;
    ctx.beginPath();
    ctx.moveTo(-22, -20);
    ctx.lineTo(-22, 8);
    ctx.bezierCurveTo(-30, 12, -38, 16, -38, 20);
    ctx.lineTo(38, 20);
    ctx.bezierCurveTo(38, 16, 30, 12, 22, 8);
    ctx.lineTo(22, -20);
    ctx.closePath();
    ctx.fill();

    // Heel
    ctx.fillStyle = '#1a0e08';
    ctx.beginPath();
    ctx.roundRect(-22, 14, 18, 16, [0, 0, 3, 3]);
    ctx.fill();

    // Sole
    ctx.fillStyle = '#0d0805';
    ctx.beginPath();
    ctx.roundRect(-40, 20, 80, 14, [0, 0, 5, 5]);
    ctx.fill();

    // Sole tread lines
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    for (let tx = -35; tx < 35; tx += 12) {
      ctx.beginPath();
      ctx.moveTo(tx, 22);
      ctx.lineTo(tx + 4, 33);
      ctx.stroke();
    }

    // Shine on boot
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath();
    ctx.ellipse(-8, -40, 7, 18, -0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // ── Speech Bubble ────────────────────────────────────────────
  function drawSpeechBubble(ctx, text, x, y, alpha = 1, pointing = 'down') {
    if (alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = alpha;

    const lines = text.split('\n');
    ctx.font = 'bold 13px "Comic Neue", cursive';
    const lineH = 18;
    const maxW = Math.max(...lines.map(l => ctx.measureText(l).width)) + 28;
    const bh = lines.length * lineH + 18;

    const bx = x - maxW / 2;
    const by = y - bh - (pointing === 'down' ? 16 : 0);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.roundRect(bx + 3, by + 3, maxW, bh, 10);
    ctx.fill();

    // Bubble
    ctx.fillStyle = '#FFFDE7';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(bx, by, maxW, bh, 10);
    ctx.fill();
    ctx.stroke();

    // Pointer
    if (pointing === 'down') {
      ctx.beginPath();
      ctx.moveTo(x - 10, by + bh);
      ctx.lineTo(x, by + bh + 14);
      ctx.lineTo(x + 10, by + bh);
      ctx.fillStyle = '#FFFDE7';
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 10, by + bh + 1);
      ctx.lineTo(x, by + bh + 14);
      ctx.lineTo(x + 10, by + bh + 1);
      ctx.stroke();
    }

    // Text
    ctx.fillStyle = '#222';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    lines.forEach((line, i) => {
      ctx.fillText(line, x, by + 10 + i * lineH);
    });

    ctx.restore();
  }

  // ── Round Intro Flash ────────────────────────────────────────
  function drawRoundIntro(ctx, text, alpha) {
    if (alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = alpha;

    ctx.font = 'bold 52px "Bebas Neue", cursive';
    ctx.fillStyle = '#C88A12';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 5;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeText(text, W / 2, H / 2);
    ctx.fillText(text, W / 2, H / 2);

    ctx.restore();
  }

  // ── STOMP! flash text ────────────────────────────────────────
  function drawStompFlash(ctx, progress) {
    if (progress <= 0) return;
    const size = 80 + (1 - progress) * 40;
    ctx.save();
    ctx.globalAlpha = progress;
    ctx.font = `bold ${size}px "Bebas Neue", cursive`;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 6;
    ctx.fillStyle = '#C88A12';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeText('💥 STOMPED! 💥', W / 2, H / 2 - 30);
    ctx.fillText('💥 STOMPED! 💥', W / 2, H / 2 - 30);
    ctx.restore();
  }

  // ── Victory Screen ───────────────────────────────────────────
  function drawVictory(ctx, timer) {
    const alpha = Math.min(1, timer / 40);
    ctx.save();

    // Overlay
    ctx.fillStyle = `rgba(0, 30, 60, ${alpha * 0.9})`;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = alpha;

    // Gold radial glow
    const glow = ctx.createRadialGradient(W/2, H/2, 20, W/2, H/2, 300);
    glow.addColorStop(0, 'rgba(200,138,18,0.3)');
    glow.addColorStop(1, 'rgba(200,138,18,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // Shield
    drawWesternShield(ctx, W / 2, 100, 1.8);

    const bounce = Math.sin(timer * 0.08) * 5;

    ctx.font = 'bold 68px "Bebas Neue", cursive';
    ctx.fillStyle = '#C88A12';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 5;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeText('HERE FOR GOOD!', W / 2, 220 + bounce);
    ctx.fillText('HERE FOR GOOD!', W / 2, 220 + bounce);

    ctx.font = 'bold 28px "Bebas Neue", cursive';
    ctx.fillStyle = '#fff';
    ctx.lineWidth = 3;
    const lines2 = [
      '✅ Competition: STOMPED',
      '✅ Southern Utah: PROTECTED',
      '✅ Your Home: A SANCTUARY',
    ];
    lines2.forEach((line, i) => {
      ctx.strokeText(line, W / 2, 285 + i * 38);
      ctx.fillText(line, W / 2, 285 + i * 38);
    });

    ctx.font = '17px Oswald, sans-serif';
    ctx.fillStyle = '#C88A12';
    ctx.fillText('"We\'re not just here. We\'re Here For Good."', W / 2, 400);

    ctx.font = '13px Oswald, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.fillText('📞 Western Pest Control · St. George, UT · westernpestcontrolut.com', W / 2, 430);
    ctx.fillText('4.9 ⭐ · 3,000+ Reviews · Quality Pro Certified · 5-5-5-5 Guarantee', W / 2, 452);

    ctx.restore();
  }

  // ── Idle Screen ──────────────────────────────────────────────
  function drawIdle(ctx) {
    drawBackground(ctx);

    ctx.save();
    // Center logo big
    drawWesternShield(ctx, W / 2, 160, 2.2);

    ctx.font = 'bold 56px "Bebas Neue", cursive';
    ctx.fillStyle = '#C88A12';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 5;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeText('THE STOMP', W / 2, 270);
    ctx.fillText('THE STOMP', W / 2, 270);

    ctx.font = '18px Oswald, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 0;
    ctx.fillText('Western Pest Control vs. The DIY Competition', W / 2, 310);

    ctx.font = '14px Oswald, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText('5 insects. 1 boot. Zero mercy.', W / 2, 338);

    // Bug emojis row
    const emojis = ['🪳','🐜','🕷️','🦂','🐛'];
    emojis.forEach((e, i) => {
      ctx.font = '32px serif';
      ctx.fillText(e, W / 2 - 80 + i * 40, 385);
    });

    ctx.restore();

    drawScoreboard(ctx, 0);
  }

  return {
    W, H, GROUND_Y,
    drawBackground,
    drawScoreboard,
    drawBoot,
    drawSpeechBubble,
    drawRoundIntro,
    drawStompFlash,
    drawVictory,
    drawIdle,
    drawWesternShield,
  };

})();
