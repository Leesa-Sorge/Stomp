/* particles.js — Particle & effects system */

const ParticleSystem = (() => {

  let particles = [];
  let shockwaves = [];
  let floatingTexts = [];

  function reset() {
    particles = [];
    shockwaves = [];
    floatingTexts = [];
  }

  function spawnImpact(x, y, color, count = 28) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 2;
      const emojis = ['💥','⭐','✨','💫','🌟','👊'];
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5,
        life: 1,
        decay: Math.random() * 0.025 + 0.018,
        color,
        size: Math.random() * 5 + 3,
        type: Math.random() > 0.55 ? 'emoji' : 'circle',
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
      });
    }
  }

  function spawnDirt(x, y) {
    for (let i = 0; i < 16; i++) {
      const angle = Math.PI + Math.random() * Math.PI; // spray upward
      const speed = Math.random() * 7 + 3;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        life: 1,
        decay: Math.random() * 0.03 + 0.015,
        color: '#6B4C1E',
        size: Math.random() * 8 + 3,
        type: 'circle',
        rotation: 0,
        rotSpeed: 0,
      });
    }
  }

  function spawnShockwave(x, y) {
    shockwaves.push({ x, y, radius: 0, maxRadius: 100, life: 1, decay: 0.035 });
    shockwaves.push({ x, y, radius: 0, maxRadius: 70, life: 1, decay: 0.055 });
  }

  function spawnFloatingText(x, y, text, color = '#C88A12') {
    floatingTexts.push({ x, y, text, color, life: 1, decay: 0.018, vy: -2.2 });
  }

  function spawnGoldStars(x, y) {
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
      const speed = 4 + Math.random() * 3;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 1,
        decay: 0.02,
        color: '#C88A12',
        size: 16,
        type: 'star',
        rotation: 0,
        rotSpeed: 0.08,
      });
    }
  }

  function drawStar(ctx, x, y, radius, points = 5) {
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? radius : radius * 0.4;
      const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
      i === 0 ? ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a))
              : ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
    }
    ctx.closePath();
    ctx.fill();
  }

  function update() {
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.32;
      p.vx *= 0.97;
      p.life -= p.decay;
      p.rotation += p.rotSpeed;
    });

    shockwaves = shockwaves.filter(s => s.life > 0);
    shockwaves.forEach(s => {
      s.radius += (s.maxRadius - s.radius) * 0.15;
      s.life -= s.decay;
    });

    floatingTexts = floatingTexts.filter(t => t.life > 0);
    floatingTexts.forEach(t => {
      t.y += t.vy;
      t.vy *= 0.95;
      t.life -= t.decay;
    });
  }

  function draw(ctx) {
    // Shockwaves
    shockwaves.forEach(s => {
      ctx.save();
      ctx.globalAlpha = s.life * 0.5;
      ctx.strokeStyle = '#C88A12';
      ctx.lineWidth = 3 * s.life;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });

    // Particles
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      if (p.type === 'emoji') {
        ctx.font = `${p.size * 2.5}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.emoji, 0, 0);
      } else if (p.type === 'star') {
        ctx.fillStyle = p.color;
        drawStar(ctx, 0, 0, p.size, 5);
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(0, 0, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    // Floating texts
    floatingTexts.forEach(t => {
      ctx.save();
      ctx.globalAlpha = t.life;
      ctx.font = 'bold 26px "Bebas Neue", cursive';
      ctx.fillStyle = t.color;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText(t.text, t.x, t.y);
      ctx.fillText(t.text, t.x, t.y);
      ctx.restore();
    });
  }

  return { reset, update, draw, spawnImpact, spawnDirt, spawnShockwave, spawnFloatingText, spawnGoldStars };

})();
