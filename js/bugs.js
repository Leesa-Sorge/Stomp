/* bugs.js — Canvas bug renderers for Western Pest Control: The Stomp
   Each bug is drawn procedurally with a logo badge on its back.
   Bugs: cockroach, ant, spider, scorpion, silverfish
*/

const BugArt = (() => {

  // ── Shared helpers ──────────────────────────────────────────────

  function drawLogoBadge(ctx, x, y, size, bgColor, textLine1, textLine2, emoji) {
    ctx.save();
    // Badge circle
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = bgColor;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = size * 0.12;
    ctx.stroke();

    // Emoji top
    ctx.font = `${size * 0.7}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, x, y - size * 0.22);

    // Text lines
    ctx.font = `bold ${size * 0.28}px 'Comic Neue', cursive`;
    ctx.fillStyle = '#fff';
    ctx.fillText(textLine1, x, y + size * 0.22);
    if (textLine2) {
      ctx.font = `${size * 0.22}px 'Comic Neue', cursive`;
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.fillText(textLine2, x, y + size * 0.48);
    }
    ctx.restore();
  }

  // ── 1. COCKROACH — "Your Husband's Pest Control" ───────────────
  function drawCockroach(ctx, x, y, squish, walkFrame) {
    ctx.save();
    ctx.translate(x, y);

    const sx = 1 + squish * 0.6;
    const sy = 1 - squish * 0.75;
    ctx.scale(sx, sy);

    const walk = Math.sin(walkFrame * 0.18) * 4;

    // Shadow
    ctx.beginPath();
    ctx.ellipse(0, 38, 28 * (1 + squish * 0.4), 6 + squish * 4, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fill();

    // Legs (6 legs)
    ctx.strokeStyle = '#2a1a08';
    ctx.lineWidth = 2.5;
    for (let i = -1; i <= 1; i++) {
      const lx = i * 18;
      const wiggle = Math.sin(walkFrame * 0.18 + i) * 5;
      // Left legs
      ctx.beginPath();
      ctx.moveTo(lx - 8, 0);
      ctx.lineTo(lx - 28, -8 + wiggle);
      ctx.lineTo(lx - 36, 6 + wiggle);
      ctx.stroke();
      // Right legs
      ctx.beginPath();
      ctx.moveTo(lx + 8, 0);
      ctx.lineTo(lx + 28, -8 - wiggle);
      ctx.lineTo(lx + 36, 6 - wiggle);
      ctx.stroke();
    }

    // Body (abdomen)
    const bodyGrad = ctx.createRadialGradient(-6, -10, 2, 0, 0, 28);
    bodyGrad.addColorStop(0, '#5a3a18');
    bodyGrad.addColorStop(1, '#2a1505');
    ctx.beginPath();
    ctx.ellipse(0, 8, 20, 28, 0, 0, Math.PI * 2);
    ctx.fillStyle = bodyGrad;
    ctx.fill();

    // Wing covers (elytra)
    ctx.beginPath();
    ctx.ellipse(-7, 2, 11, 22, -0.15, 0, Math.PI * 2);
    ctx.fillStyle = '#4a2e10';
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(7, 2, 11, 22, 0.15, 0, Math.PI * 2);
    ctx.fillStyle = '#4a2e10';
    ctx.fill();

    // Thorax
    ctx.beginPath();
    ctx.ellipse(0, -16, 14, 10, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#3a2010';
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.ellipse(0, -28, 9, 8, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#2a1508';
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#ff4400';
    ctx.beginPath(); ctx.arc(-4, -30, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(4, -30, 2.5, 0, Math.PI * 2); ctx.fill();

    // Antennae
    ctx.strokeStyle = '#2a1508';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-4, -34);
    ctx.quadraticCurveTo(-18 + walk, -52, -30, -48 + walk);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(4, -34);
    ctx.quadraticCurveTo(18 - walk, -52, 30, -48 - walk);
    ctx.stroke();

    // Logo badge on back
    if (squish < 0.6) {
      drawLogoBadge(ctx, 0, -2, 14, '#8B4513', "HIS", "PEST CO", '🔧');
    }

    ctx.restore();
  }

  // ── 2. ANT — "Throw Your Shoe At It Pest Control" ─────────────
  function drawAnt(ctx, x, y, squish, walkFrame) {
    ctx.save();
    ctx.translate(x, y);

    const sx = 1 + squish * 0.7;
    const sy = 1 - squish * 0.78;
    ctx.scale(sx, sy);

    const walk = Math.sin(walkFrame * 0.2) * 5;

    // Shadow
    ctx.beginPath();
    ctx.ellipse(0, 42, 22 * (1 + squish * 0.4), 5 + squish * 4, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fill();

    // 6 Legs
    const legColor = '#8B0000';
    ctx.strokeStyle = legColor;
    ctx.lineWidth = 2;
    for (let i = -1; i <= 1; i++) {
      const wig = Math.sin(walkFrame * 0.2 + i * 1.2) * 6;
      ctx.beginPath();
      ctx.moveTo(-6, i * 14);
      ctx.lineTo(-22, i * 14 - 8 + wig);
      ctx.lineTo(-30, i * 14 + 8 + wig);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(6, i * 14);
      ctx.lineTo(22, i * 14 - 8 - wig);
      ctx.lineTo(30, i * 14 + 8 - wig);
      ctx.stroke();
    }

    // Gaster (abdomen) - biggest
    ctx.beginPath();
    ctx.ellipse(0, 18, 14, 18, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#8B0000';
    ctx.fill();
    ctx.strokeStyle = '#5a0000';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Petiole (waist nodes)
    ctx.beginPath();
    ctx.ellipse(0, -2, 5, 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#6B0000';
    ctx.fill();

    // Thorax
    ctx.beginPath();
    ctx.ellipse(0, -14, 11, 10, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#8B0000';
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(0, -27, 11, 0, Math.PI * 2);
    ctx.fillStyle = '#700000';
    ctx.fill();

    // Mandibles
    ctx.strokeStyle = '#400000';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-6, -30);
    ctx.quadraticCurveTo(-16, -36, -12, -42);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(6, -30);
    ctx.quadraticCurveTo(16, -36, 12, -42);
    ctx.stroke();

    // Eyes
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(-5, -28, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(5, -28, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(-4, -29, 1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(6, -29, 1, 0, Math.PI * 2); ctx.fill();

    // Antennae with elbows
    ctx.strokeStyle = '#5a0000';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-4, -36);
    ctx.lineTo(-14, -48 + walk);
    ctx.lineTo(-8, -58 + walk);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(4, -36);
    ctx.lineTo(14, -48 - walk);
    ctx.lineTo(8, -58 - walk);
    ctx.stroke();

    // Logo badge
    if (squish < 0.6) {
      drawLogoBadge(ctx, 0, 18, 12, '#CC4444', "SHOE", "PEST", '👟');
    }

    ctx.restore();
  }

  // ── 3. SPIDER — "Pinterest DIY Pest Solutions" ──────────────────
  function drawSpider(ctx, x, y, squish, walkFrame) {
    ctx.save();
    ctx.translate(x, y);

    const sx = 1 + squish * 0.65;
    const sy = 1 - squish * 0.75;
    ctx.scale(sx, sy);

    const walk = Math.sin(walkFrame * 0.15) * 4;

    // Shadow
    ctx.beginPath();
    ctx.ellipse(0, 36, 36 * (1 + squish * 0.3), 6 + squish * 4, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fill();

    // Silk thread (dangling)
    if (!squish) {
      ctx.strokeStyle = 'rgba(200,200,200,0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -40);
      ctx.lineTo(0, -80);
      ctx.stroke();
    }

    // 8 legs with joints
    const legAngles = [-0.6, -0.3, 0.3, 0.6];
    ctx.strokeStyle = '#1a0a2e';
    ctx.lineWidth = 3;
    legAngles.forEach((baseAngle, i) => {
      const wig = Math.sin(walkFrame * 0.15 + i * 0.8) * 5;
      // Left
      const lAngle = -Math.PI * 0.5 - baseAngle;
      ctx.beginPath();
      ctx.moveTo(-14, 0);
      const mid1x = -14 + Math.cos(lAngle) * 22;
      const mid1y = Math.sin(lAngle) * 22 + wig;
      ctx.lineTo(mid1x, mid1y);
      ctx.lineTo(mid1x + Math.cos(lAngle + 0.8) * 20, mid1y + Math.sin(lAngle + 0.8) * 20);
      ctx.stroke();
      // Right
      const rAngle = -Math.PI * 0.5 + baseAngle;
      ctx.beginPath();
      ctx.moveTo(14, 0);
      const mid2x = 14 + Math.cos(rAngle) * 22;
      const mid2y = Math.sin(rAngle) * 22 - wig;
      ctx.lineTo(mid2x, mid2y);
      ctx.lineTo(mid2x + Math.cos(rAngle - 0.8) * 20, mid2y + Math.sin(rAngle - 0.8) * 20);
      ctx.stroke();
    });

    // Abdomen (big)
    const abGrad = ctx.createRadialGradient(-4, -4, 2, 0, 4, 20);
    abGrad.addColorStop(0, '#3a1f5e');
    abGrad.addColorStop(1, '#180c2e');
    ctx.beginPath();
    ctx.ellipse(0, 12, 18, 22, 0, 0, Math.PI * 2);
    ctx.fillStyle = abGrad;
    ctx.fill();

    // Hourglass marking (like black widow – fun touch)
    ctx.fillStyle = 'rgba(255,50,50,0.7)';
    ctx.beginPath();
    ctx.moveTo(0, 4); ctx.lineTo(5, 10); ctx.lineTo(0, 16); ctx.lineTo(-5, 10); ctx.closePath();
    ctx.fill();

    // Cephalothorax
    ctx.beginPath();
    ctx.ellipse(0, -10, 14, 12, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#2a1048';
    ctx.fill();

    // 8 eyes (2 rows)
    ctx.fillStyle = '#00ffcc';
    const eyePos = [[-6,-14],[-2,-14],[2,-14],[6,-14],[-4,-9],[0,-9],[4,-9]];
    eyePos.forEach(([ex, ey]) => {
      ctx.beginPath();
      ctx.arc(ex, ey, 1.8, 0, Math.PI * 2);
      ctx.fill();
    });

    // Fangs/chelicerae
    ctx.fillStyle = '#0a0018';
    ctx.beginPath();
    ctx.ellipse(-4, -22, 3, 5, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(4, -22, 3, 5, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ff2200';
    ctx.beginPath(); ctx.arc(-4, -26, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(4, -26, 1.5, 0, Math.PI * 2); ctx.fill();

    // Logo badge
    if (squish < 0.6) {
      drawLogoBadge(ctx, 0, 12, 13, '#E91E8C', "DIY", "PEST", '📌');
    }

    ctx.restore();
  }

  // ── 4. SCORPION — "My Neighbor Dave's Exterminating" ───────────
  function drawScorpion(ctx, x, y, squish, walkFrame) {
    ctx.save();
    ctx.translate(x, y);

    const sx = 1 + squish * 0.7;
    const sy = 1 - squish * 0.75;
    ctx.scale(sx, sy);

    const walk = Math.sin(walkFrame * 0.12) * 3;

    // Shadow
    ctx.beginPath();
    ctx.ellipse(5, 40, 40 * (1 + squish * 0.3), 7 + squish * 4, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fill();

    // Tail (5 segments + stinger) - curves up and over
    const tailSegments = [
      { x: 18, y: 8, r: 7 },
      { x: 30, y: -2, r: 6.5 },
      { x: 36, y: -14, r: 6 },
      { x: 34, y: -26, r: 5.5 },
      { x: 26, y: -34, r: 5 },
    ];

    // Tail connecting line
    ctx.strokeStyle = '#2a4020';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(14, 6);
    tailSegments.forEach(s => ctx.lineTo(s.x + walk * 0.3, s.y));
    ctx.stroke();

    // Tail segments
    tailSegments.forEach((s, i) => {
      const segGrad = ctx.createRadialGradient(s.x - 2, s.y - 2, 1, s.x, s.y, s.r);
      segGrad.addColorStop(0, '#5a8040');
      segGrad.addColorStop(1, '#2a4020');
      ctx.beginPath();
      ctx.arc(s.x + walk * 0.3, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = segGrad;
      ctx.fill();
      ctx.strokeStyle = '#1a3010';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Stinger
    ctx.fillStyle = '#ff4400';
    ctx.beginPath();
    ctx.moveTo(22 + walk * 0.3, -38);
    ctx.lineTo(28 + walk * 0.3, -46);
    ctx.lineTo(18 + walk * 0.3, -44);
    ctx.closePath();
    ctx.fill();

    // 8 legs
    ctx.strokeStyle = '#2a4020';
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 4; i++) {
      const wy = -8 + i * 10;
      const wig = Math.sin(walkFrame * 0.12 + i) * 5;
      ctx.beginPath();
      ctx.moveTo(-10, wy);
      ctx.lineTo(-26, wy - 10 + wig);
      ctx.lineTo(-34, wy + 5 + wig);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(10, wy);
      ctx.lineTo(24, wy - 8 - wig);
      ctx.lineTo(32, wy + 4 - wig);
      ctx.stroke();
    }

    // Body segments (metasoma)
    const bodySegs = [
      { y: 0, rx: 14, ry: 8 },
      { y: 10, rx: 13, ry: 8 },
      { y: 20, rx: 12, ry: 7 },
      { y: 28, rx: 10, ry: 6 },
    ];
    bodySegs.forEach(s => {
      const bg = ctx.createRadialGradient(-3, s.y - 2, 1, 0, s.y, s.rx);
      bg.addColorStop(0, '#6a9450');
      bg.addColorStop(1, '#2a4020');
      ctx.beginPath();
      ctx.ellipse(0, s.y, s.rx, s.ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = bg;
      ctx.fill();
      ctx.strokeStyle = '#1a3010';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Claws (pedipalps)
    ctx.fillStyle = '#3a5030';
    ctx.strokeStyle = '#1a3010';
    ctx.lineWidth = 1.5;
    // Left claw
    ctx.save();
    ctx.translate(-18, -16);
    ctx.rotate(-0.3 + Math.sin(walkFrame * 0.1) * 0.1);
    ctx.beginPath();
    ctx.ellipse(0, 0, 12, 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#4a6040';
    ctx.fill();
    ctx.stroke();
    ctx.beginPath(); ctx.arc(-10, -3, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(-10, 4, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.restore();

    // Right claw
    ctx.save();
    ctx.translate(18, -16);
    ctx.rotate(0.3 - Math.sin(walkFrame * 0.1) * 0.1);
    ctx.beginPath();
    ctx.ellipse(0, 0, 12, 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#4a6040';
    ctx.fill();
    ctx.stroke();
    ctx.beginPath(); ctx.arc(10, -3, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(10, 4, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.restore();

    // Head
    ctx.beginPath();
    ctx.ellipse(0, -20, 12, 9, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#3a5030';
    ctx.fill();
    ctx.stroke();

    // Eyes
    ctx.fillStyle = '#ffff00';
    ctx.beginPath(); ctx.arc(-4, -22, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(4, -22, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(-4, -22, 1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(4, -22, 1, 0, Math.PI * 2); ctx.fill();

    // Logo badge
    if (squish < 0.6) {
      drawLogoBadge(ctx, 0, 8, 11, '#556B2F', "DAVE'S", "PEST", '🏘️');
    }

    ctx.restore();
  }

  // ── 5. SILVERFISH — "Hope & Pray Pest Management" ──────────────
  function drawSilverfish(ctx, x, y, squish, walkFrame) {
    ctx.save();
    ctx.translate(x, y);

    const sx = 1 + squish * 0.65;
    const sy = 1 - squish * 0.72;
    ctx.scale(sx, sy);

    const wave = Math.sin(walkFrame * 0.14) * 6;

    // Shadow
    ctx.beginPath();
    ctx.ellipse(0, 36, 30 * (1 + squish * 0.3), 5 + squish * 3, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fill();

    // Many legs (14 pairs shown as 6 prominent)
    ctx.strokeStyle = '#708090';
    ctx.lineWidth = 1.8;
    for (let i = -2; i <= 2; i++) {
      const ly = i * 11;
      const wig = Math.sin(walkFrame * 0.14 + i * 0.9) * 6;
      ctx.beginPath();
      ctx.moveTo(-10, ly);
      ctx.lineTo(-26, ly - 6 + wig);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(10, ly);
      ctx.lineTo(26, ly - 6 - wig);
      ctx.stroke();
    }

    // 3 tail cerci
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 32);
    ctx.lineTo(-12, 48 + wave * 0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 32);
    ctx.lineTo(12, 48 - wave * 0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 32);
    ctx.lineTo(0, 52 + Math.sin(walkFrame * 0.14) * 4);
    ctx.stroke();

    // Body — tapered teardrop, segmented
    const numSegs = 10;
    for (let i = 0; i < numSegs; i++) {
      const t = i / numSegs;
      const segY = -30 + i * 6.5;
      const segR = 4 + (1 - t) * 12 * (1 - Math.abs(t - 0.3));
      const waveX = Math.sin(walkFrame * 0.14 + i * 0.4) * 2;

      const silver = ctx.createRadialGradient(waveX - 3, segY - 1, 1, waveX, segY, segR);
      silver.addColorStop(0, '#d8e8f0');
      silver.addColorStop(0.5, '#9eb8cc');
      silver.addColorStop(1, '#607080');

      ctx.beginPath();
      ctx.ellipse(waveX, segY, segR, 4.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = silver;
      ctx.fill();
      ctx.strokeStyle = 'rgba(100,130,150,0.4)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Scales shimmer overlay
    ctx.save();
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 8; i++) {
      const t = i / 8;
      const scaleY = -24 + i * 7;
      const scaleR = 6 + (1 - t) * 8;
      ctx.beginPath();
      ctx.ellipse(0, scaleY, scaleR * 0.7, 3, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
    }
    ctx.restore();

    // Head
    ctx.beginPath();
    ctx.ellipse(0, -32, 8, 7, 0, 0, Math.PI * 2);
    const headG = ctx.createRadialGradient(-2, -34, 1, 0, -32, 8);
    headG.addColorStop(0, '#c8dce8');
    headG.addColorStop(1, '#6080a0');
    ctx.fillStyle = headG;
    ctx.fill();

    // Eyes (compound)
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(-4, -33, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(4, -33, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,200,0,0.6)';
    ctx.beginPath(); ctx.arc(-3.5, -33.5, 1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(4.5, -33.5, 1, 0, Math.PI * 2); ctx.fill();

    // Long antennae (3 total)
    ctx.strokeStyle = '#9ab0c0';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-4, -38);
    ctx.quadraticCurveTo(-20, -56 + wave, -18, -68 + wave);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(4, -38);
    ctx.quadraticCurveTo(20, -56 - wave, 18, -68 - wave);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -38);
    ctx.quadraticCurveTo(0, -58, Math.sin(walkFrame * 0.1) * 8, -68);
    ctx.stroke();

    // Logo badge
    if (squish < 0.6) {
      drawLogoBadge(ctx, 0, -5, 12, '#7B68EE', "HOPE", "&PRAY", '🙏');
    }

    ctx.restore();
  }

  // ── Public API ──────────────────────────────────────────────────
  return { drawCockroach, drawAnt, drawSpider, drawScorpion, drawSilverfish };

})();
