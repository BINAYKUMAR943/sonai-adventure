(() => {
  'use strict';

  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const W = canvas.width;
  const H = canvas.height;
  const TILE = 36;
  const FIXED_DT = 1 / 60;

  const COLORS = {
    sky1: '#7bdcff', sky2: '#d8f8ff', night1: '#29346f', night2: '#11182f',
    grass: '#40c463', grass2: '#1d8f45', dirt: '#8c5a32', dirt2: '#6d4025',
    stone: '#667085', stone2: '#485465', brick: '#bf6a35', brick2: '#8f4024',
    bonus: '#ffc857', bonus2: '#f28f3b', used: '#84766d', used2: '#645953',
    gem: '#ffd84d', gem2: '#fff4a3', berry: '#35e6a6', berry2: '#0ca678',
    sonaiHair: '#3b1e54', sonaiHair2: '#60307d', sonaiSkin: '#ffd0a6',
    sonaiDress: '#ff4d8d', sonaiDress2: '#c9184a', sonaiBoot: '#252a4a',
    enemy: '#7b45d9', enemy2: '#4f2e95', enemyHorn: '#ffd166', danger: '#e63946',
    cloud: 'rgba(255,255,255,0.78)', ui: '#16213e', white: '#ffffff', black: '#10131f',
    flag: '#ff477e', pole: '#f1f3f5', checkpoint: '#70e000'
  };

  const LEVELS = [
    {
      name: 'Sunrise Meadow',
      theme: 'day',
      time: 160,
      music: 1,
      map: [
        '................................................................................................................',
        '................................................................................................................',
        '................................................................................................................',
        '............................C......................C............................................................',
        '.........................GGGGG...................GGGGG...............................C..........................',
        '..............C.........................................................C...........GGGGG.......................F.',
        '............GGGGG....................Q..........C.....................GGGGG.................................GGGGG',
        '.................................BBBBBB.......GGGGG.............Q......................C.............K..........',
        '........P..............C.................................E.....BBBBB.................GGGGG.......................',
        '......GGGGG..........GGGGG...............C..................................................E....................',
        '..............................E........GGGGG...............GGGGGGGGG......R............................E........',
        'GGGGGGGGGGGGGGGGG....GGGGGGGGGGGGGGGGGGGGGGGGGGGGG....GGGGGGGGGGGGGGGGGGGGGG....GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGGG....GGGGGGGGGGGGGGGGGGGGGGGGGGGGG....GGGGGGGGGGGGGGGGGGGGGG....GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGGG....GGGGGGGGGGGGGGGGGGGGGGGGGGGGG....GGGGGGGGGGGGGGGGGGGGGG....GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGGG....GGGGGGGGGGGGGGGGGGGGGGGGGGGGG....GGGGGGGGGGGGGGGGGGGGGG....GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG'
      ],
      movers: [
        { x: 2060, y: 360, w: 126, h: 16, dx: 260, dy: 0, speed: 80 },
        { x: 3140, y: 322, w: 126, h: 16, dx: 0, dy: 120, speed: 60 }
      ]
    },
    {
      name: 'Moonlit Cavern',
      theme: 'cave',
      time: 185,
      music: 2,
      map: [
        '................................................................................................................',
        '................................................................................................................',
        '......................C.........................................................C...............................',
        '....................SSSSS....................C..............................SSSSS..............................',
        '...........................................SSSSS....................Q.................................C........',
        '........P.....................C.........................E...........BBBBB......................E.....SSSSS.....F',
        '......SSSSS.................SSSSS....................................................C.....................SSSSS',
        '........................Q............................SSSSSS...............Q........SSSSS........K..............',
        '......................BBBBB...............C............................BBBBB...........................D.......',
        '...............E........................SSSSS..................E....................................SSSSS.....',
        'SSSSSSSSSSSSSSSSSSS....SSSSSSSSSSSSSSSSSSSSSS....SSSSSSSSSSSSSSSSSSS....SSSSSSSSS....SSSSSSSSSSSSSSSSSSSSSSS',
        'SSSSSSSSSSSSSSSSSSS....SSSSSSSSSSSSSSSSSSSSSS....SSSSSSSSSSSSSSSSSSS....SSSSSSSSS....SSSSSSSSSSSSSSSSSSSSSSS',
        'SSSSSSSSSSSSSSSSSSS....SSSSSSSSSSSSSSSSSSSSSS....SSSSSSSSSSSSSSSSSSS....SSSSSSSSS....SSSSSSSSSSSSSSSSSSSSSSS',
        'SSSSSSSSSSSSSSSSSSS....SSSSSSSSSSSSSSSSSSSSSS....SSSSSSSSSSSSSSSSSSS....SSSSSSSSS....SSSSSSSSSSSSSSSSSSSSSSS',
        'SSSSSSSSSSSSSSSSSSS....SSSSSSSSSSSSSSSSSSSSSS....SSSSSSSSSSSSSSSSSSS....SSSSSSSSS....SSSSSSSSSSSSSSSSSSSSSSS'
      ],
      movers: [
        { x: 1320, y: 370, w: 130, h: 16, dx: 300, dy: -80, speed: 74 },
        { x: 2500, y: 325, w: 130, h: 16, dx: 250, dy: 0, speed: 95 },
        { x: 3650, y: 400, w: 130, h: 16, dx: 0, dy: 110, speed: 64 }
      ]
    },
    {
      name: 'Star Garden Heights',
      theme: 'day',
      time: 210,
      music: 3,
      map: [
        '................................................................................................................',
        '......................................................................................C.........................',
        '....................................................................................GGGGG.......................',
        '.......P................C.............................C..................C.....................................F',
        '.....GGGGG............GGGGG.........................GGGGG..............GGGGG...............................GGGGG',
        '................Q.........................Q...........................................Q..............K..........',
        '..............BBBBB.....................BBBBB.......................................BBBBB........................',
        '.........................E....................................C.............E....................C...............',
        '........GGGGGGGGG..................GGGGGGGGGGG..............GGGGG........GGGGG..............GGGGG...............',
        '............................C.........................R.................................................D.......',
        '..........................GGGGG.................................................................GGGGG..........',
        'GGGGGGGGGG....GGGGGGGGGGGGGGGGGG....GGGGGGGGGGGG....GGGGGGGGGGGGGGGG....GGGGGGGGGGG....GGGGGGGGGGGGGGGGGGGGGGG',
        'GGGGGGGGGG....GGGGGGGGGGGGGGGGGG....GGGGGGGGGGGG....GGGGGGGGGGGGGGGG....GGGGGGGGGGG....GGGGGGGGGGGGGGGGGGGGGGG',
        'GGGGGGGGGG....GGGGGGGGGGGGGGGGGG....GGGGGGGGGGGG....GGGGGGGGGGGGGGGG....GGGGGGGGGGG....GGGGGGGGGGGGGGGGGGGGGGG',
        'GGGGGGGGGG....GGGGGGGGGGGGGGGGGG....GGGGGGGGGGGG....GGGGGGGGGGGGGGGG....GGGGGGGGGGG....GGGGGGGGGGGGGGGGGGGGGGG'
      ],
      movers: [
        { x: 840, y: 332, w: 126, h: 16, dx: 260, dy: 0, speed: 92 },
        { x: 1850, y: 295, w: 126, h: 16, dx: 230, dy: 100, speed: 78 },
        { x: 3060, y: 355, w: 126, h: 16, dx: 310, dy: 0, speed: 105 }
      ]
    }
  ];

  const keys = new Map();
  const pressed = new Set();
  const released = new Set();

  function keyName(code) {
    if (code === 'KeyA') return 'ArrowLeft';
    if (code === 'KeyD') return 'ArrowRight';
    if (code === 'KeyW' || code === 'ArrowUp') return 'Space';
    if (code === 'KeyX') return 'ShiftLeft';
    return code;
  }

  window.addEventListener('keydown', (e) => {
    const k = keyName(e.code);
    if (['ArrowLeft', 'ArrowRight', 'Space', 'ShiftLeft', 'KeyP', 'KeyR', 'KeyM', 'Enter'].includes(k)) e.preventDefault();
    if (!keys.get(k)) pressed.add(k);
    keys.set(k, true);
  }, { passive: false });

  window.addEventListener('keyup', (e) => {
    const k = keyName(e.code);
    keys.set(k, false);
    released.add(k);
  });

  document.querySelectorAll('.touch-btn').forEach((btn) => {
    const k = btn.dataset.key;
    const down = (e) => {
      e.preventDefault();
      if (!keys.get(k)) pressed.add(k);
      keys.set(k, true);
      btn.classList.add('active');
    };
    const up = (e) => {
      e.preventDefault();
      keys.set(k, false);
      released.add(k);
      btn.classList.remove('active');
    };
    btn.addEventListener('pointerdown', down);
    btn.addEventListener('pointerup', up);
    btn.addEventListener('pointercancel', up);
    btn.addEventListener('pointerleave', up);
  });

  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const rectsOverlap = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

  class AudioKit {
    constructor() {
      this.ctx = null;
      this.muted = false;
      this.lastTone = 0;
    }
    ensure() {
      if (this.muted || this.ctx) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    }
    tone(freq, dur = 0.08, type = 'square', vol = 0.05, slide = 0) {
      if (this.muted) return;
      this.ensure();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), now + dur);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(vol, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      osc.connect(gain).connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + dur + 0.02);
    }
    coin() { this.tone(880, 0.06, 'sine', 0.04, 360); }
    jump() { this.tone(420, 0.08, 'square', 0.035, 220); }
    stomp() { this.tone(250, 0.1, 'triangle', 0.06, -110); }
    block() { this.tone(190, 0.07, 'square', 0.05, 80); }
    power() { this.tone(660, 0.07, 'sine', 0.045, 240); setTimeout(() => this.tone(990, 0.1, 'sine', 0.045, 260), 60); }
    hurt() { this.tone(120, 0.18, 'sawtooth', 0.04, -40); }
    flag() { [520, 660, 784, 1040].forEach((f, i) => setTimeout(() => this.tone(f, 0.11, 'sine', 0.045, 80), i * 90)); }
  }

  class Particle {
    constructor(x, y, vx, vy, life, color, size = 4, gravity = 900) {
      this.x = x; this.y = y; this.vx = vx; this.vy = vy; this.life = life; this.maxLife = life;
      this.color = color; this.size = size; this.gravity = gravity;
    }
    update(dt) {
      this.life -= dt;
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      this.vy += this.gravity * dt;
    }
    draw(ctx, cam) {
      if (this.life <= 0) return;
      ctx.globalAlpha = clamp(this.life / this.maxLife, 0, 1);
      ctx.fillStyle = this.color;
      ctx.fillRect(Math.round(this.x - cam.x), Math.round(this.y - cam.y), this.size, this.size);
      ctx.globalAlpha = 1;
    }
  }

  class FloatingText {
    constructor(text, x, y, color = COLORS.white) {
      this.text = text; this.x = x; this.y = y; this.life = 0.8; this.color = color;
    }
    update(dt) { this.life -= dt; this.y -= 42 * dt; }
    draw(ctx, cam) {
      ctx.save();
      ctx.globalAlpha = clamp(this.life / 0.8, 0, 1);
      ctx.font = '900 16px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(0,0,0,0.45)';
      ctx.strokeText(this.text, Math.round(this.x - cam.x), Math.round(this.y - cam.y));
      ctx.fillStyle = this.color;
      ctx.fillText(this.text, Math.round(this.x - cam.x), Math.round(this.y - cam.y));
      ctx.restore();
    }
  }

  class Camera {
    constructor() { this.x = 0; this.y = 0; this.shake = 0; }
    update(targetX, worldW, dt) {
      const desired = clamp(targetX - W * 0.42, 0, Math.max(0, worldW - W));
      this.x = lerp(this.x, desired, 1 - Math.pow(0.001, dt));
      if (this.shake > 0) this.shake = Math.max(0, this.shake - dt * 22);
      this.y = 0;
    }
    apply(ctx) {
      if (this.shake <= 0) return;
      const s = this.shake;
      ctx.translate(Math.round(rnd(-s, s)), Math.round(rnd(-s, s)));
    }
  }

  class Level {
    constructor(def) {
      this.def = def;
      this.name = def.name;
      this.theme = def.theme;
      this.rows = def.map.map((r) => r.split(''));
      this.widthTiles = Math.max(...this.rows.map(r => r.length));
      this.heightTiles = this.rows.length;
      this.worldW = this.widthTiles * TILE;
      this.worldH = this.heightTiles * TILE;
      this.gems = [];
      this.enemies = [];
      this.powerups = [];
      this.movers = [];
      this.springs = [];
      this.finish = { x: (this.widthTiles - 3) * TILE, y: 7 * TILE, w: 26, h: TILE * 4 };
      this.spawn = { x: 80, y: 250 };
      this.checkpoint = null;
      this.timeLeft = def.time;
      this.parse();
    }
    parse() {
      for (let y = 0; y < this.rows.length; y++) {
        for (let x = 0; x < this.rows[y].length; x++) {
          const c = this.rows[y][x];
          const px = x * TILE, py = y * TILE;
          if (c === 'P') { this.spawn = { x: px, y: py - 10 }; this.rows[y][x] = '.'; }
          if (c === 'C') { this.gems.push(new Gem(px + TILE / 2, py + TILE / 2)); this.rows[y][x] = '.'; }
          if (c === 'E') { this.enemies.push(new Walker(px + 4, py + 2)); this.rows[y][x] = '.'; }
          if (c === 'D') { this.enemies.push(new Flyer(px + 8, py - 50)); this.rows[y][x] = '.'; }
          if (c === 'R') { this.springs.push(new Spring(px + 3, py + 14)); this.rows[y][x] = '.'; }
          if (c === 'F') { this.finish = { x: px + 8, y: py - TILE * 3, w: 24, h: TILE * 4 }; this.rows[y][x] = '.'; }
          if (c === 'K') { this.checkpoint = new Checkpoint(px + 6, py - TILE * 2); this.rows[y][x] = '.'; }
        }
      }
      for (const m of this.def.movers || []) this.movers.push(new MovingPlatform(m));
    }
    tile(tx, ty) {
      if (ty < 0 || ty >= this.rows.length || tx < 0 || tx >= this.widthTiles) return '.';
      return this.rows[ty][tx] || '.';
    }
    setTile(tx, ty, c) {
      if (ty < 0 || ty >= this.rows.length || tx < 0 || tx >= this.rows[ty].length) return;
      this.rows[ty][tx] = c;
    }
    isSolidChar(c) { return c === 'G' || c === 'S' || c === 'B' || c === 'Q' || c === 'U'; }
    isSolidAt(tx, ty) { return this.isSolidChar(this.tile(tx, ty)); }
    rectCollides(rect) {
      const x0 = Math.floor(rect.x / TILE), x1 = Math.floor((rect.x + rect.w - 1) / TILE);
      const y0 = Math.floor(rect.y / TILE), y1 = Math.floor((rect.y + rect.h - 1) / TILE);
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          if (this.isSolidAt(x, y)) return { tx: x, ty: y, c: this.tile(x, y), rect: { x: x * TILE, y: y * TILE, w: TILE, h: TILE } };
        }
      }
      return null;
    }
    hitBlock(tx, ty, game, player) {
      const c = this.tile(tx, ty);
      const bx = tx * TILE, by = ty * TILE;
      if (c === 'Q') {
        this.setTile(tx, ty, 'U');
        const spawnPower = ((tx + ty + game.levelIndex) % 3) === 0;
        if (spawnPower) {
          this.powerups.push(new Berry(bx + 6, by - 4));
          game.texts.push(new FloatingText('POWER!', bx + TILE / 2, by - 8, COLORS.berry));
          game.audio.power();
        } else {
          this.gems.push(new Gem(bx + TILE / 2, by - 18, true));
          game.score += 20;
          game.texts.push(new FloatingText('+20', bx + TILE / 2, by - 8, COLORS.gem));
          game.audio.coin();
        }
        for (let i = 0; i < 8; i++) game.particles.push(new Particle(bx + TILE / 2, by + TILE / 2, rnd(-120, 120), rnd(-260, -80), 0.45, COLORS.bonus, 4));
        game.camera.shake = Math.max(game.camera.shake, 4);
      } else if (c === 'B') {
        if (player.powered > 0) {
          this.setTile(tx, ty, '.');
          game.audio.block();
          game.camera.shake = Math.max(game.camera.shake, 5);
          for (let i = 0; i < 14; i++) game.particles.push(new Particle(bx + TILE / 2, by + TILE / 2, rnd(-190, 190), rnd(-320, 60), 0.65, i % 2 ? COLORS.brick : COLORS.brick2, 5));
          game.score += 10;
        } else {
          game.audio.block();
          game.camera.shake = Math.max(game.camera.shake, 2);
          for (let i = 0; i < 5; i++) game.particles.push(new Particle(bx + TILE / 2, by, rnd(-70, 70), rnd(-170, -70), 0.35, COLORS.brick, 4));
        }
      }
    }
    update(dt, game) {
      this.timeLeft -= dt;
      for (const m of this.movers) m.update(dt);
      for (const g of this.gems) g.update(dt);
      this.gems = this.gems.filter(g => !g.dead);
      for (const s of this.springs) s.update(dt);
      for (const p of this.powerups) p.update(dt, this);
      this.powerups = this.powerups.filter(p => !p.dead);
      for (const e of this.enemies) e.update(dt, this);
      this.enemies = this.enemies.filter(e => !e.dead);
      if (this.checkpoint) this.checkpoint.update(dt);
    }
    draw(ctx, cam, t) {
      drawBackground(ctx, cam, this, t);
      const x0 = Math.floor(cam.x / TILE) - 2;
      const x1 = Math.floor((cam.x + W) / TILE) + 2;
      for (let y = 0; y < this.rows.length; y++) {
        for (let x = x0; x <= x1; x++) {
          const c = this.tile(x, y);
          if (c === '.') continue;
          drawTile(ctx, c, x * TILE - cam.x, y * TILE - cam.y, x, y, t, this.theme);
        }
      }
      for (const m of this.movers) m.draw(ctx, cam, t);
      for (const s of this.springs) s.draw(ctx, cam, t);
      drawFinish(ctx, this.finish, cam, t);
      if (this.checkpoint) this.checkpoint.draw(ctx, cam, t);
      for (const g of this.gems) g.draw(ctx, cam, t);
      for (const p of this.powerups) p.draw(ctx, cam, t);
      for (const e of this.enemies) e.draw(ctx, cam, t);
    }
  }

  class Gem {
    constructor(x, y, pop = false) {
      this.x = x; this.y = y; this.baseY = y; this.w = 18; this.h = 22; this.dead = false; this.t = rnd(0, 10);
      this.vy = pop ? -280 : 0; this.pop = pop;
    }
    get rect() { return { x: this.x - this.w / 2, y: this.y - this.h / 2, w: this.w, h: this.h }; }
    update(dt) {
      this.t += dt;
      if (this.pop) {
        this.y += this.vy * dt;
        this.vy += 900 * dt;
        if (this.y > this.baseY + 20) this.dead = true;
      } else {
        this.y = this.baseY + Math.sin(this.t * 4) * 4;
      }
    }
    draw(ctx, cam, t) {
      const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y);
      const wobble = Math.sin((t + this.t) * 8) * 3;
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = COLORS.gem2;
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.lineTo(9 + wobble, -2);
      ctx.lineTo(0, 12);
      ctx.lineTo(-9 - wobble, -2);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = COLORS.gem;
      ctx.beginPath();
      ctx.moveTo(0, -9);
      ctx.lineTo(6 + wobble * 0.5, -1);
      ctx.lineTo(0, 9);
      ctx.lineTo(-6 - wobble * 0.5, -1);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  class Berry {
    constructor(x, y) {
      this.x = x; this.y = y; this.w = 24; this.h = 24; this.vx = 90; this.vy = -180; this.dead = false; this.t = 0;
    }
    get rect() { return { x: this.x, y: this.y, w: this.w, h: this.h }; }
    update(dt, level) {
      this.t += dt;
      this.vy += 1200 * dt;
      this.x += this.vx * dt;
      let hit = level.rectCollides(this.rect);
      if (hit) {
        if (this.vx > 0) this.x = hit.rect.x - this.w - 0.1; else this.x = hit.rect.x + hit.rect.w + 0.1;
        this.vx *= -1;
      }
      this.y += this.vy * dt;
      hit = level.rectCollides(this.rect);
      if (hit) {
        if (this.vy > 0) { this.y = hit.rect.y - this.h - 0.1; this.vy = 0; }
        else { this.y = hit.rect.y + hit.rect.h + 0.1; this.vy = 0; }
      }
      if (this.y > H + 300) this.dead = true;
    }
    draw(ctx, cam, t) {
      const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y);
      ctx.save();
      ctx.translate(x + this.w / 2, y + this.h / 2);
      ctx.rotate(Math.sin((t + this.t) * 8) * 0.12);
      ctx.fillStyle = COLORS.berry2;
      ctx.fillRect(-11, -8, 22, 18);
      ctx.fillStyle = COLORS.berry;
      ctx.fillRect(-8, -12, 16, 22);
      ctx.fillStyle = COLORS.white;
      ctx.fillRect(-3, -6, 4, 4);
      ctx.fillStyle = '#2f9e44';
      ctx.fillRect(1, -16, 10, 5);
      ctx.restore();
    }
  }

  class Spring {
    constructor(x, y) { this.x = x; this.y = y; this.w = 30; this.h = 20; this.bounce = 0; }
    get rect() { return { x: this.x, y: this.y, w: this.w, h: this.h }; }
    update(dt) { this.bounce = Math.max(0, this.bounce - dt * 8); }
    draw(ctx, cam) {
      const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y + this.bounce * 4);
      ctx.fillStyle = '#ff6b6b'; ctx.fillRect(x, y + 12, this.w, 8);
      ctx.fillStyle = '#f8f9fa';
      for (let i = 0; i < 3; i++) ctx.fillRect(x + 5 + i * 8, y + 3 + (i % 2) * 4, 5, 12);
      ctx.fillStyle = '#ffd166'; ctx.fillRect(x + 2, y, this.w - 4, 6);
    }
  }

  class Checkpoint {
    constructor(x, y) { this.x = x; this.y = y; this.w = 22; this.h = TILE * 3; this.active = false; this.t = 0; }
    get rect() { return { x: this.x, y: this.y, w: 40, h: this.h }; }
    update(dt) { this.t += dt; }
    draw(ctx, cam, t) {
      const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y);
      ctx.fillStyle = COLORS.pole; ctx.fillRect(x + 10, y, 6, this.h);
      ctx.fillStyle = this.active ? COLORS.checkpoint : '#ffd166';
      const wave = Math.sin((t + this.t) * 5) * 5;
      ctx.beginPath(); ctx.moveTo(x + 16, y + 8); ctx.lineTo(x + 58, y + 20 + wave); ctx.lineTo(x + 16, y + 36); ctx.closePath(); ctx.fill();
    }
  }

  class MovingPlatform {
    constructor(m) {
      this.x0 = m.x; this.y0 = m.y; this.x = m.x; this.y = m.y; this.w = m.w; this.h = m.h;
      this.dx = m.dx; this.dy = m.dy; this.speed = m.speed; this.phase = 0; this.prevX = this.x; this.prevY = this.y;
    }
    get rect() { return { x: this.x, y: this.y, w: this.w, h: this.h }; }
    update(dt) {
      this.prevX = this.x; this.prevY = this.y;
      this.phase += dt * this.speed / 100;
      const s = (Math.sin(this.phase) + 1) / 2;
      this.x = this.x0 + this.dx * s;
      this.y = this.y0 + this.dy * s;
    }
    draw(ctx, cam) {
      const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y);
      ctx.fillStyle = '#5f3dc4'; ctx.fillRect(x, y, this.w, this.h);
      ctx.fillStyle = '#b197fc'; ctx.fillRect(x, y, this.w, 5);
      ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(x + 8, y + 7, this.w - 16, 3);
    }
  }

  class Walker {
    constructor(x, y) {
      this.x = x; this.y = y; this.w = 30; this.h = 30; this.vx = Math.random() < 0.5 ? -78 : 78; this.vy = 0; this.dead = false; this.squash = 0; this.t = rnd(0, 10);
    }
    get rect() { return { x: this.x, y: this.y, w: this.w, h: this.h }; }
    update(dt, level) {
      if (this.squash > 0) { this.squash -= dt; if (this.squash <= 0) this.dead = true; return; }
      this.t += dt;
      this.vy += 1500 * dt;
      this.vy = Math.min(900, this.vy);
      this.x += this.vx * dt;
      let hit = level.rectCollides(this.rect);
      if (hit) {
        if (this.vx > 0) this.x = hit.rect.x - this.w - 0.1; else this.x = hit.rect.x + hit.rect.w + 0.1;
        this.vx *= -1;
      }
      const frontX = this.vx > 0 ? this.x + this.w + 4 : this.x - 4;
      const footY = this.y + this.h + 6;
      if (!level.isSolidAt(Math.floor(frontX / TILE), Math.floor(footY / TILE))) this.vx *= -1;
      this.y += this.vy * dt;
      hit = level.rectCollides(this.rect);
      if (hit) {
        if (this.vy > 0) { this.y = hit.rect.y - this.h - 0.1; this.vy = 0; }
        else { this.y = hit.rect.y + hit.rect.h + 0.1; this.vy = 0; }
      }
      if (this.y > H + 500) this.dead = true;
    }
    stomp() { this.squash = 0.16; }
    draw(ctx, cam, t) {
      const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y);
      ctx.save();
      if (this.squash > 0) ctx.scale(1, 0.55);
      const yy = this.squash > 0 ? y / 0.55 + 24 : y;
      ctx.fillStyle = COLORS.enemy2;
      ctx.fillRect(x + 4, yy + 9, 22, 20);
      ctx.fillStyle = COLORS.enemy;
      ctx.fillRect(x + 1, yy + 5 + Math.sin((t + this.t) * 12) * 1.5, 28, 20);
      ctx.fillStyle = COLORS.enemyHorn;
      ctx.fillRect(x + 5, yy + 1, 5, 6); ctx.fillRect(x + 20, yy + 1, 5, 6);
      ctx.fillStyle = COLORS.white; ctx.fillRect(x + 8, yy + 12, 5, 5); ctx.fillRect(x + 18, yy + 12, 5, 5);
      ctx.fillStyle = COLORS.black; ctx.fillRect(x + 10, yy + 14, 2, 2); ctx.fillRect(x + 20, yy + 14, 2, 2);
      ctx.restore();
    }
  }

  class Flyer {
    constructor(x, y) { this.x = x; this.y = y; this.baseY = y; this.w = 34; this.h = 26; this.vx = -72; this.t = rnd(0, 10); this.dead = false; this.squash = 0; }
    get rect() { return { x: this.x, y: this.y, w: this.w, h: this.h }; }
    update(dt, level) {
      if (this.squash > 0) { this.squash -= dt; this.y += 350 * dt; if (this.squash <= 0) this.dead = true; return; }
      this.t += dt; this.x += this.vx * dt; this.y = this.baseY + Math.sin(this.t * 3) * 42;
      if (this.x < 0 || this.x > level.worldW - this.w) this.vx *= -1;
    }
    stomp() { this.squash = 0.22; }
    draw(ctx, cam, t) {
      const x = Math.round(this.x - cam.x), y = Math.round(this.y - cam.y);
      const flap = Math.sin((t + this.t) * 16) * 7;
      ctx.fillStyle = '#91a7ff'; ctx.fillRect(x - 8, y + 8 + flap, 12, 7); ctx.fillRect(x + 30, y + 8 - flap, 12, 7);
      ctx.fillStyle = '#364fc7'; ctx.fillRect(x + 4, y + 4, 26, 18);
      ctx.fillStyle = COLORS.white; ctx.fillRect(x + 10, y + 9, 5, 5); ctx.fillRect(x + 22, y + 9, 5, 5);
    }
  }

  class Player {
    constructor(x, y) {
      this.x = x; this.y = y; this.w = 28; this.h = 48;
      this.vx = 0; this.vy = 0; this.onGround = false; this.wasGround = false;
      this.face = 1; this.coyote = 0; this.jumpBuffer = 0; this.invuln = 0; this.powered = 0;
      this.hearts = 3; this.spawn = { x, y }; this.gems = 0; this.runTime = 0; this.groundedTime = 0;
    }
    get rect() { return { x: this.x, y: this.y, w: this.w, h: this.h }; }
    respawn() { this.x = this.spawn.x; this.y = this.spawn.y; this.vx = 0; this.vy = 0; this.invuln = 1.5; }
    update(dt, level, game) {
      const left = keys.get('ArrowLeft');
      const right = keys.get('ArrowRight');
      const run = keys.get('ShiftLeft');
      if (pressed.has('Space')) this.jumpBuffer = 0.13;
      this.jumpBuffer = Math.max(0, this.jumpBuffer - dt);
      if (released.has('Space') && this.vy < -120) this.vy *= 0.48;

      const dir = (right ? 1 : 0) - (left ? 1 : 0);
      if (dir) this.face = dir;
      const max = run ? 335 : 235;
      const accel = this.onGround ? (run ? 2600 : 2200) : 1500;
      const friction = this.onGround ? 2500 : 380;
      if (dir) {
        this.vx += dir * accel * dt;
        this.vx = clamp(this.vx, -max, max);
      } else {
        const f = friction * dt;
        if (Math.abs(this.vx) <= f) this.vx = 0; else this.vx -= Math.sign(this.vx) * f;
      }

      this.wasGround = this.onGround;
      if (this.onGround) this.coyote = 0.10; else this.coyote = Math.max(0, this.coyote - dt);
      if (this.jumpBuffer > 0 && (this.onGround || this.coyote > 0)) {
        this.vy = run ? -668 : -635;
        this.jumpBuffer = 0;
        this.onGround = false;
        this.coyote = 0;
        game.audio.jump();
        for (let i = 0; i < 8; i++) game.particles.push(new Particle(this.x + this.w / 2, this.y + this.h, rnd(-80, 80), rnd(-50, 40), 0.22, 'rgba(255,255,255,0.75)', 3, 40));
      }

      this.vy += 1780 * dt;
      this.vy = Math.min(this.vy, 1050);
      this.moveX(dt, level);
      this.moveY(dt, level, game);

      // moving platforms carry Sonai
      for (const m of level.movers) {
        const r = m.rect;
        const feet = { x: this.x + 2, y: this.y + this.h, w: this.w - 4, h: 4 };
        if (this.vy >= 0 && rectsOverlap(feet, r) && this.y + this.h <= r.y + 12) {
          this.y = r.y - this.h;
          this.onGround = true;
          this.vy = 0;
          this.x += m.x - m.prevX;
          this.y += m.y - m.prevY;
        }
      }

      for (const spring of level.springs) {
        if (this.vy >= 0 && rectsOverlap(this.rect, spring.rect) && this.y + this.h < spring.y + 18) {
          this.y = spring.y - this.h - 0.1;
          this.vy = -840;
          this.onGround = false;
          spring.bounce = 1;
          game.audio.jump();
          game.camera.shake = Math.max(game.camera.shake, 3);
        }
      }

      if (this.onGround) this.groundedTime += dt; else this.groundedTime = 0;
      if (Math.abs(this.vx) > 30) this.runTime += dt; else this.runTime = 0;
      if (this.onGround && Math.abs(this.vx) > 190 && Math.random() < 0.25) game.particles.push(new Particle(this.x + (this.face < 0 ? this.w : 0), this.y + this.h - 3, rnd(-55, 55), rnd(-50, -10), 0.25, 'rgba(255,255,255,0.65)', 3, 60));

      this.invuln = Math.max(0, this.invuln - dt);
      this.powered = Math.max(0, this.powered - dt);
      if (this.y > H + 300) game.damagePlayer(true);
    }
    moveX(dt, level) {
      this.x += this.vx * dt;
      let guard = 0;
      while (guard++ < 6) {
        const hit = level.rectCollides(this.rect);
        if (!hit) break;
        if (this.vx > 0) this.x = hit.rect.x - this.w - 0.01;
        else if (this.vx < 0) this.x = hit.rect.x + hit.rect.w + 0.01;
        this.vx = 0;
      }
      this.x = clamp(this.x, 0, level.worldW - this.w);
    }
    moveY(dt, level, game) {
      this.y += this.vy * dt;
      this.onGround = false;
      let guard = 0;
      while (guard++ < 8) {
        const hit = level.rectCollides(this.rect);
        if (!hit) break;
        if (this.vy > 0) {
          this.y = hit.rect.y - this.h - 0.01;
          this.vy = 0;
          this.onGround = true;
        } else if (this.vy < 0) {
          this.y = hit.rect.y + hit.rect.h + 0.01;
          this.vy = 0;
          level.hitBlock(hit.tx, hit.ty, game, this);
        }
      }
    }
    draw(ctx, cam, t) {
      if (this.invuln > 0 && Math.floor(t * 18) % 2 === 0) return;
      drawSonai(ctx, this, cam, t);
    }
  }

  function drawTile(ctx, c, sx, sy, tx, ty, t, theme) {
    sx = Math.round(sx); sy = Math.round(sy);
    if (c === 'G') {
      ctx.fillStyle = COLORS.dirt; ctx.fillRect(sx, sy, TILE, TILE);
      ctx.fillStyle = COLORS.dirt2;
      for (let i = 0; i < 4; i++) ctx.fillRect(sx + ((tx * 13 + ty * 7 + i * 17) % 31), sy + 12 + i * 7, 5, 4);
      ctx.fillStyle = COLORS.grass; ctx.fillRect(sx, sy, TILE, 9);
      ctx.fillStyle = COLORS.grass2;
      for (let i = 0; i < TILE; i += 8) ctx.fillRect(sx + i, sy + 7, 4, 4);
    } else if (c === 'S') {
      ctx.fillStyle = COLORS.stone; ctx.fillRect(sx, sy, TILE, TILE);
      ctx.fillStyle = COLORS.stone2;
      ctx.fillRect(sx + 2, sy + 4, TILE - 4, 5);
      ctx.fillRect(sx + 5, sy + 18, TILE - 10, 4);
      ctx.fillStyle = 'rgba(255,255,255,0.16)'; ctx.fillRect(sx + 4, sy + 4, 8, 8);
    } else if (c === 'B') {
      ctx.fillStyle = COLORS.brick; ctx.fillRect(sx + 1, sy + 1, TILE - 2, TILE - 2);
      ctx.fillStyle = COLORS.brick2;
      ctx.fillRect(sx + 1, sy + 12, TILE - 2, 3); ctx.fillRect(sx + 1, sy + 24, TILE - 2, 3);
      ctx.fillRect(sx + 16, sy + 1, 3, 11); ctx.fillRect(sx + 6, sy + 14, 3, 10); ctx.fillRect(sx + 26, sy + 26, 3, 9);
    } else if (c === 'Q') {
      const bounce = Math.sin(t * 8 + tx) * 1.5;
      ctx.fillStyle = COLORS.bonus2; ctx.fillRect(sx + 1, sy + 1 + bounce, TILE - 2, TILE - 2);
      ctx.fillStyle = COLORS.bonus; ctx.fillRect(sx + 4, sy + 4 + bounce, TILE - 8, TILE - 8);
      ctx.fillStyle = COLORS.white; ctx.font = '900 22px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('★', sx + TILE / 2, sy + 25 + bounce);
    } else if (c === 'U') {
      ctx.fillStyle = COLORS.used2; ctx.fillRect(sx + 1, sy + 1, TILE - 2, TILE - 2);
      ctx.fillStyle = COLORS.used; ctx.fillRect(sx + 5, sy + 5, TILE - 10, TILE - 10);
    }
  }

  function drawBackground(ctx, cam, level, t) {
    const isCave = level.theme === 'cave';
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, isCave ? COLORS.night1 : COLORS.sky1);
    g.addColorStop(1, isCave ? COLORS.night2 : COLORS.sky2);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    if (isCave) {
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      for (let i = 0; i < 70; i++) {
        const x = ((i * 149 - cam.x * 0.15) % (W + 80)) - 40;
        const y = 20 + ((i * 67) % 260);
        const s = 1 + (i % 3);
        ctx.fillRect(Math.round(x), y, s, s);
      }
      ctx.fillStyle = 'rgba(113, 128, 150, 0.35)';
      for (let i = 0; i < 18; i++) {
        const x = ((i * 260 - cam.x * 0.28) % (W + 260)) - 180;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 44, 110 + (i % 5) * 22); ctx.lineTo(x + 88, 0); ctx.fill();
      }
    } else {
      for (let layer = 0; layer < 3; layer++) {
        const speed = [0.12, 0.28, 0.48][layer];
        const base = [320, 365, 415][layer];
        const color = ['rgba(100,190,102,0.45)', 'rgba(61,155,82,0.55)', 'rgba(35,120,69,0.65)'][layer];
        ctx.fillStyle = color;
        for (let i = 0; i < 9; i++) {
          const x = ((i * 300 - cam.x * speed) % (W + 350)) - 220;
          ctx.beginPath(); ctx.arc(x, base, 120 + layer * 22, Math.PI, 0); ctx.fill();
        }
      }
      ctx.fillStyle = COLORS.cloud;
      for (let i = 0; i < 7; i++) {
        const x = ((i * 260 + 70 - cam.x * 0.18) % (W + 220)) - 120;
        const y = 50 + (i % 3) * 42 + Math.sin(t + i) * 3;
        cloud(ctx, x, y, 1 + (i % 2) * 0.25);
      }
    }
  }

  function cloud(ctx, x, y, s) {
    ctx.beginPath();
    ctx.arc(x, y + 18 * s, 18 * s, 0, Math.PI * 2);
    ctx.arc(x + 22 * s, y + 8 * s, 22 * s, 0, Math.PI * 2);
    ctx.arc(x + 48 * s, y + 18 * s, 18 * s, 0, Math.PI * 2);
    ctx.rect(x - 2 * s, y + 18 * s, 58 * s, 18 * s);
    ctx.fill();
  }

  function drawFinish(ctx, flag, cam, t) {
    const x = Math.round(flag.x - cam.x), y = Math.round(flag.y - cam.y);
    ctx.fillStyle = COLORS.pole; ctx.fillRect(x + 8, y, 6, flag.h);
    ctx.fillStyle = COLORS.flag;
    const wave = Math.sin(t * 7) * 7;
    ctx.beginPath(); ctx.moveTo(x + 14, y + 8); ctx.lineTo(x + 72, y + 24 + wave); ctx.lineTo(x + 14, y + 46); ctx.closePath(); ctx.fill();
    ctx.fillStyle = COLORS.gem; ctx.fillRect(x + 28, y + 22, 9, 9);
    ctx.fillStyle = '#2b2d42'; ctx.fillRect(x - 7, y + flag.h - 8, 32, 8);
  }

  function drawSonai(ctx, p, cam, t) {
    const x = Math.round(p.x - cam.x), y = Math.round(p.y - cam.y);
    const face = p.face;
    const run = Math.min(1, Math.abs(p.vx) / 280);
    const bob = p.onGround ? Math.sin(t * 16 * run) * 2 : 0;
    const leg = Math.sin(t * 18) * 6 * run;
    ctx.save();
    ctx.translate(x + p.w / 2, y + bob);
    if (face < 0) ctx.scale(-1, 1);

    if (p.powered > 0) {
      ctx.globalAlpha = 0.35 + Math.sin(t * 14) * 0.15;
      ctx.fillStyle = COLORS.berry;
      ctx.beginPath(); ctx.arc(0, 24, 31, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }

    // ponytail
    ctx.fillStyle = COLORS.sonaiHair2;
    ctx.fillRect(-20, 8, 12, 20);
    ctx.fillStyle = COLORS.sonaiHair;
    ctx.fillRect(-24, 14 + Math.sin(t * 10) * 2, 16, 16);

    // legs and boots
    ctx.fillStyle = COLORS.sonaiDress2;
    ctx.fillRect(-10 + leg * 0.25, 32, 7, 12);
    ctx.fillRect(5 - leg * 0.25, 32, 7, 12);
    ctx.fillStyle = COLORS.sonaiBoot;
    ctx.fillRect(-13 + leg * 0.25, 43, 12, 5);
    ctx.fillRect(4 - leg * 0.25, 43, 12, 5);

    // dress/body
    ctx.fillStyle = COLORS.sonaiDress2;
    ctx.fillRect(-12, 20, 24, 18);
    ctx.fillStyle = COLORS.sonaiDress;
    ctx.fillRect(-15, 17, 30, 18);
    ctx.fillRect(-11, 34, 22, 5);
    ctx.fillStyle = '#ffd166'; ctx.fillRect(1, 20, 5, 5);

    // arms
    ctx.fillStyle = COLORS.sonaiSkin;
    ctx.fillRect(-18, 20 + Math.max(0, leg) * 0.15, 7, 15);
    ctx.fillRect(12, 20 + Math.max(0, -leg) * 0.15, 7, 15);

    // head/hair/face
    ctx.fillStyle = COLORS.sonaiHair;
    ctx.fillRect(-13, -2, 26, 24);
    ctx.fillStyle = COLORS.sonaiSkin;
    ctx.fillRect(-10, 4, 22, 19);
    ctx.fillStyle = COLORS.sonaiHair;
    ctx.fillRect(-12, 0, 26, 8);
    ctx.fillRect(-13, 5, 5, 16);
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(2, 11, 4, 4);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(4, 12, 2, 2);
    ctx.fillStyle = '#ff8fab'; ctx.fillRect(7, 18, 5, 3);

    // hair band
    ctx.fillStyle = COLORS.gem;
    ctx.fillRect(-2, -3, 12, 4);

    ctx.restore();
  }

  class Game {
    constructor() {
      this.audio = new AudioKit();
      this.camera = new Camera();
      this.levelIndex = 0;
      this.level = new Level(LEVELS[this.levelIndex]);
      this.player = new Player(this.level.spawn.x, this.level.spawn.y);
      this.state = 'title';
      this.score = 0;
      this.totalGems = 0;
      this.particles = [];
      this.texts = [];
      this.t = 0;
      this.pauseBlink = 0;
      this.best = Number(localStorage.getItem('sonai-best-score') || 0);
    }
    reset(levelIndex = 0, keepScore = false) {
      this.levelIndex = levelIndex;
      this.level = new Level(LEVELS[this.levelIndex]);
      this.player = new Player(this.level.spawn.x, this.level.spawn.y);
      this.camera = new Camera();
      this.particles = []; this.texts = [];
      if (!keepScore) { this.score = 0; this.totalGems = 0; }
      this.state = 'play';
    }
    nextLevel() {
      if (this.levelIndex + 1 >= LEVELS.length) {
        this.state = 'win';
        this.best = Math.max(this.best, this.score);
        localStorage.setItem('sonai-best-score', String(this.best));
      } else {
        this.reset(this.levelIndex + 1, true);
      }
    }
    update(dt) {
      this.t += dt;
      if (pressed.has('KeyM')) this.audio.muted = !this.audio.muted;
      if (this.state === 'title') {
        if (pressed.has('Enter') || pressed.has('Space')) this.reset(0);
        return;
      }
      if (this.state === 'levelComplete') {
        this.pauseBlink += dt;
        if (pressed.has('Enter') || pressed.has('Space')) this.nextLevel();
        return;
      }
      if (this.state === 'gameOver' || this.state === 'win') {
        if (pressed.has('KeyR') || pressed.has('Enter') || pressed.has('Space')) this.reset(0);
        return;
      }
      if (pressed.has('KeyP')) this.state = this.state === 'paused' ? 'play' : 'paused';
      if (pressed.has('KeyR')) this.reset(this.levelIndex, this.score > 0);
      if (this.state === 'paused') return;

      this.level.update(dt, this);
      this.player.update(dt, this.level, this);
      this.handleCollections();
      this.handleEnemyCollisions();
      this.handleCheckpoint();
      this.handleFinish();
      if (this.level.timeLeft <= 0) {
        this.player.hearts = 0;
        this.audio.hurt();
        this.state = 'gameOver';
      }

      this.camera.update(this.player.x + this.player.w / 2, this.level.worldW, dt);
      for (const p of this.particles) p.update(dt);
      this.particles = this.particles.filter(p => p.life > 0);
      for (const txt of this.texts) txt.update(dt);
      this.texts = this.texts.filter(txt => txt.life > 0);
    }
    handleCollections() {
      for (const g of this.level.gems) {
        if (!g.dead && rectsOverlap(this.player.rect, g.rect)) {
          g.dead = true;
          this.score += 50;
          this.totalGems += 1;
          this.audio.coin();
          this.texts.push(new FloatingText('+50', g.x, g.y - 8, COLORS.gem));
          for (let i = 0; i < 8; i++) this.particles.push(new Particle(g.x, g.y, rnd(-110, 110), rnd(-160, -20), 0.35, COLORS.gem, 3));
        }
      }
      for (const b of this.level.powerups) {
        if (!b.dead && rectsOverlap(this.player.rect, b.rect)) {
          b.dead = true;
          this.player.powered = 16;
          this.score += 200;
          this.audio.power();
          this.texts.push(new FloatingText('Glow Mode!', b.x + 12, b.y - 6, COLORS.berry));
          for (let i = 0; i < 18; i++) this.particles.push(new Particle(b.x + 12, b.y + 12, rnd(-160, 160), rnd(-220, 50), 0.55, i % 2 ? COLORS.berry : COLORS.gem, 4));
        }
      }
    }
    handleEnemyCollisions() {
      for (const e of this.level.enemies) {
        if (e.dead || e.squash > 0) continue;
        if (!rectsOverlap(this.player.rect, e.rect)) continue;
        const stomp = this.player.vy > 80 && this.player.y + this.player.h <= e.y + 16;
        if (stomp) {
          e.stomp();
          this.player.vy = -420;
          this.player.onGround = false;
          this.score += 100;
          this.audio.stomp();
          this.texts.push(new FloatingText('+100', e.x + e.w / 2, e.y - 8, COLORS.white));
          for (let i = 0; i < 10; i++) this.particles.push(new Particle(e.x + e.w / 2, e.y + e.h / 2, rnd(-120, 120), rnd(-170, 40), 0.35, COLORS.enemy, 4));
        } else if (this.player.powered > 0) {
          e.stomp();
          this.score += 100;
          this.audio.stomp();
        } else {
          this.damagePlayer(false);
        }
      }
    }
    handleCheckpoint() {
      const cp = this.level.checkpoint;
      if (!cp || cp.active) return;
      if (rectsOverlap(this.player.rect, cp.rect)) {
        cp.active = true;
        this.player.spawn = { x: cp.x, y: cp.y + 35 };
        this.score += 150;
        this.audio.power();
        this.texts.push(new FloatingText('Checkpoint!', cp.x + 28, cp.y - 6, COLORS.checkpoint));
      }
    }
    handleFinish() {
      if (rectsOverlap(this.player.rect, this.level.finish)) {
        this.score += Math.max(0, Math.floor(this.level.timeLeft)) * 5;
        this.audio.flag();
        this.state = 'levelComplete';
      }
    }
    damagePlayer(force) {
      if (!force && this.player.invuln > 0) return;
      this.audio.hurt();
      this.camera.shake = Math.max(this.camera.shake, 8);
      this.player.hearts -= 1;
      for (let i = 0; i < 18; i++) this.particles.push(new Particle(this.player.x + this.player.w / 2, this.player.y + this.player.h / 2, rnd(-180, 180), rnd(-260, 60), 0.5, COLORS.danger, 4));
      this.player.hearts = Math.max(0, this.player.hearts);
      if (this.player.hearts <= 0) {
        this.state = 'gameOver';
        this.best = Math.max(this.best, this.score);
        localStorage.setItem('sonai-best-score', String(this.best));
      } else {
        this.player.respawn();
      }
    }
    draw() {
      ctx.save();
      this.camera.apply(ctx);
      if (this.state === 'title') {
        const fakeCam = { x: (Math.sin(this.t * 0.3) + 1) * 250, y: 0 };
        const preview = new Level(LEVELS[0]);
        preview.draw(ctx, fakeCam, this.t);
        this.drawTitle();
        ctx.restore();
        return;
      }
      this.level.draw(ctx, this.camera, this.t);
      this.player.draw(ctx, this.camera, this.t);
      for (const p of this.particles) p.draw(ctx, this.camera);
      for (const txt of this.texts) txt.draw(ctx, this.camera);
      ctx.restore();
      this.drawUI();
      if (this.state === 'paused') this.overlay('Paused', 'Press P to continue');
      if (this.state === 'levelComplete') this.overlay('Level Clear!', 'Press Enter or Jump for next level');
      if (this.state === 'gameOver') this.overlay('Game Over', 'Press R to restart');
      if (this.state === 'win') this.overlay('You saved the Star Garden!', 'Press R to play again');
    }
    drawUI() {
      ctx.save();
      ctx.font = '900 18px system-ui, sans-serif';
      ctx.textBaseline = 'middle';
      roundRect(ctx, 16, 14, 330, 44, 14, 'rgba(10,15,35,0.58)');
      ctx.fillStyle = COLORS.white; ctx.fillText('Sonai', 34, 36);
      for (let i = 0; i < 3; i++) {
        drawHeart(ctx, 98 + i * 28, 36, i < this.player.hearts ? COLORS.flag : 'rgba(255,255,255,0.28)');
      }
      drawMiniGem(ctx, 198, 36);
      ctx.fillStyle = COLORS.white; ctx.fillText(String(this.totalGems).padStart(2, '0'), 218, 36);
      ctx.fillText(String(this.score).padStart(6, '0'), 268, 36);

      roundRect(ctx, W - 292, 14, 276, 44, 14, 'rgba(10,15,35,0.58)');
      ctx.fillStyle = COLORS.white;
      ctx.textAlign = 'right';
      ctx.fillText(this.level.name, W - 110, 36);
      ctx.fillStyle = this.level.timeLeft < 25 ? COLORS.flag : COLORS.gem;
      ctx.fillText(Math.max(0, Math.ceil(this.level.timeLeft)).toString(), W - 32, 36);
      ctx.textAlign = 'left';
      if (this.player.powered > 0) {
        roundRect(ctx, 16, 66, 190, 30, 12, 'rgba(53,230,166,0.25)');
        ctx.fillStyle = COLORS.berry; ctx.fillRect(28, 77, 140 * (this.player.powered / 16), 8);
        ctx.fillStyle = COLORS.white; ctx.font = '800 13px system-ui'; ctx.fillText('Glow Mode', 32, 82);
      }
      ctx.restore();
    }
    drawTitle() {
      ctx.save();
      ctx.fillStyle = 'rgba(5, 8, 20, 0.54)'; ctx.fillRect(0, 0, W, H);
      ctx.textAlign = 'center';
      ctx.fillStyle = COLORS.gem;
      ctx.font = '1000 60px system-ui, sans-serif';
      ctx.lineWidth = 8; ctx.strokeStyle = 'rgba(0,0,0,0.45)';
      ctx.strokeText('SONAI', W / 2, 150);
      ctx.fillText('SONAI', W / 2, 150);
      ctx.fillStyle = COLORS.white;
      ctx.font = '900 46px system-ui, sans-serif'; ctx.strokeText('STAR QUEST', W / 2, 202); ctx.fillText('STAR QUEST', W / 2, 202);
      ctx.font = '700 20px system-ui, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fillText('A polished original platform adventure', W / 2, 248);
      ctx.font = '900 22px system-ui, sans-serif';
      ctx.fillStyle = Math.floor(this.t * 2) % 2 ? COLORS.gem : COLORS.white;
      ctx.fillText('Press Enter or Jump to Start', W / 2, 326);
      ctx.font = '700 15px system-ui, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.78)';
      ctx.fillText('Move: A/D or Arrows  ·  Jump: Space/W/↑  ·  Run: Shift/X  ·  M: mute', W / 2, 370);
      ctx.fillText(`Best score: ${this.best}`, W / 2, 402);
      ctx.restore();
    }
    overlay(title, subtitle) {
      ctx.save();
      ctx.fillStyle = 'rgba(5, 8, 20, 0.62)'; ctx.fillRect(0, 0, W, H);
      roundRect(ctx, W / 2 - 250, H / 2 - 86, 500, 172, 24, 'rgba(255,255,255,0.12)');
      ctx.textAlign = 'center';
      ctx.fillStyle = COLORS.white; ctx.font = '1000 44px system-ui, sans-serif'; ctx.fillText(title, W / 2, H / 2 - 22);
      ctx.fillStyle = COLORS.gem; ctx.font = '800 19px system-ui, sans-serif'; ctx.fillText(subtitle, W / 2, H / 2 + 28);
      ctx.restore();
    }
  }

  function roundRect(ctx, x, y, w, h, r, fill) {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.fill();
  }
  function drawHeart(ctx, x, y, color) {
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = color;
    ctx.beginPath(); ctx.moveTo(0, 8); ctx.bezierCurveTo(-18, -5, -8, -19, 0, -8); ctx.bezierCurveTo(8, -19, 18, -5, 0, 8); ctx.fill(); ctx.restore();
  }
  function drawMiniGem(ctx, x, y) {
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = COLORS.gem; ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(8, 0); ctx.lineTo(0, 10); ctx.lineTo(-8, 0); ctx.closePath(); ctx.fill(); ctx.restore();
  }

  const game = new Game();
  let last = performance.now();
  let acc = 0;
  function loop(now) {
    const frame = Math.min(0.05, (now - last) / 1000);
    last = now; acc += frame;
    let steps = 0;
    while (acc >= FIXED_DT && steps++ < 5) {
      game.update(FIXED_DT);
      pressed.clear(); released.clear();
      acc -= FIXED_DT;
    }
    game.draw();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
