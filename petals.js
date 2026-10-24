/* =====================================================================
   PETAL FIELD — a different flower falls in each section.
   Three depth layers give parallax: near petals are larger, faster and
   move more as the page scrolls; far petals are small, soft and slow.
   Edit SECTION_MIX to change which flowers fall where.
   ===================================================================== */
(function () {
  "use strict";
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  // section id → [flower, weight] pairs
  var SECTION_MIX = {
    welcome:    [["rose", 0.75], ["jasmine", 0.25]],
    blessings:  [["marigold", 0.7], ["jasmine", 0.3]],
    invitation: [["jasmine", 0.55], ["rose", 0.45]],
    countdown:  [["lotus", 0.8], ["leaf", 0.2]],
    functions:  [["leaf", 0.45], ["marigold", 0.3], ["rose", 0.25]],
    gallery:    [["bougainvillea", 0.8], ["leaf", 0.2]],
    dress:      [["leaf", 0.5], ["rose", 0.5]],
    closing:    [["rose", 0.5], ["gold", 0.5]],
  };

  /* ---------- sprites: each flower drawn once to an offscreen canvas ---------- */
  var S = 64; // sprite size (px, before scaling)
  function sprite(draw, soft) {
    var c = document.createElement("canvas"); c.width = c.height = S;
    var g = c.getContext("2d");
    if (soft && "filter" in g) g.filter = "blur(1.6px)";
    g.translate(S / 2, S / 2); draw(g);
    return c;
  }
  function grad(g, r, a, b) { var gr = g.createRadialGradient(0, r * .2, 1, 0, 0, r); gr.addColorStop(0, a); gr.addColorStop(1, b); return gr; }

  var DRAW = {
    rose: function (g) {
      g.fillStyle = grad(g, 26, "#FBE9E7", "#E7A9A9");
      g.beginPath(); g.moveTo(0, 24);
      g.bezierCurveTo(-26, 8, -22, -22, -6, -22); g.quadraticCurveTo(0, -16, 6, -22);
      g.bezierCurveTo(22, -22, 26, 8, 0, 24); g.fill();
      g.strokeStyle = "rgba(196,120,120,.35)"; g.lineWidth = 1;
      g.beginPath(); g.moveTo(0, 20); g.quadraticCurveTo(-2, 0, 0, -14); g.stroke();
    },
    marigold: function (g) {
      g.fillStyle = grad(g, 22, "#FCE3B0", "#EDB566");
      g.beginPath();
      for (var i = 0; i <= 10; i++) { var a = Math.PI + i / 10 * Math.PI, r = i % 2 ? 19 : 22; g.lineTo(Math.cos(a) * r, Math.sin(a) * r * .9 - 2); }
      g.quadraticCurveTo(14, 16, 0, 20); g.quadraticCurveTo(-14, 16, -22, -2); g.fill();
      g.strokeStyle = "rgba(190,130,50,.35)"; g.lineWidth = .9;
      for (var k = -2; k <= 2; k++) { g.beginPath(); g.moveTo(0, 18); g.lineTo(k * 7, -14); g.stroke(); }
    },
    jasmine: function (g) {
      for (var i = 0; i < 5; i++) {
        g.save(); g.rotate(i * Math.PI * 2 / 5);
        g.fillStyle = grad(g, 22, "#FFFFFF", "#EFE9DB");
        g.beginPath(); g.ellipse(0, -12, 7, 13, 0, 0, Math.PI * 2); g.fill();
        g.strokeStyle = "rgba(197,164,109,.35)"; g.lineWidth = .8; g.stroke();
        g.restore();
      }
      g.fillStyle = "#E9C77B"; g.beginPath(); g.arc(0, 0, 4, 0, Math.PI * 2); g.fill();
    },
    lotus: function (g) {
      var gr = g.createLinearGradient(0, 26, 0, -26); gr.addColorStop(0, "#FFF6F4"); gr.addColorStop(1, "#E9A3B1");
      g.fillStyle = gr;
      g.beginPath(); g.moveTo(0, 26); g.bezierCurveTo(-18, 12, -14, -14, 0, -27); g.bezierCurveTo(14, -14, 18, 12, 0, 26); g.fill();
      g.strokeStyle = "rgba(200,110,130,.3)"; g.lineWidth = .9;
      g.beginPath(); g.moveTo(0, 24); g.lineTo(0, -22); g.moveTo(0, 14); g.lineTo(-7, -8); g.moveTo(0, 14); g.lineTo(7, -8); g.stroke();
    },
    leaf: function (g) {
      g.fillStyle = grad(g, 26, "#CFDCC3", "#8FA383");
      g.beginPath(); g.moveTo(0, 27); g.bezierCurveTo(-17, 10, -13, -14, 0, -27); g.bezierCurveTo(13, -14, 17, 10, 0, 27); g.fill();
      g.strokeStyle = "rgba(90,110,80,.45)"; g.lineWidth = 1;
      g.beginPath(); g.moveTo(0, 26); g.lineTo(0, -22);
      for (var y = 14; y > -16; y -= 8) { g.moveTo(0, y); g.lineTo(-8, y - 7); g.moveTo(0, y); g.lineTo(8, y - 7); }
      g.stroke();
    },
    bougainvillea: function (g) {
      g.globalAlpha = .9;
      g.fillStyle = grad(g, 26, "#F9DCE8", "#E39BBE");
      g.beginPath(); g.moveTo(0, 25);
      g.bezierCurveTo(-28, 4, -18, -24, 0, -14); g.bezierCurveTo(18, -24, 28, 4, 0, 25); g.fill();
      g.strokeStyle = "rgba(190,90,140,.35)"; g.lineWidth = .8;
      g.beginPath(); g.moveTo(0, 22); g.lineTo(0, -10); g.moveTo(0, 8); g.lineTo(-12, -4); g.moveTo(0, 8); g.lineTo(12, -4); g.stroke();
    },
    gold: function (g) {
      var gr = g.createLinearGradient(-14, -14, 14, 14); gr.addColorStop(0, "#F3E2B8"); gr.addColorStop(.5, "#C5A46D"); gr.addColorStop(1, "#E8D2A0");
      g.fillStyle = gr;
      g.beginPath(); g.moveTo(0, -16); g.lineTo(9, 0); g.lineTo(0, 16); g.lineTo(-9, 0); g.closePath(); g.fill();
    },
  };
  var SIZE = { rose: 1, marigold: .9, jasmine: .8, lotus: 1.05, leaf: 1, bougainvillea: 1, gold: .5 };
  var sprites = null;
  function buildSprites() {
    sprites = {};
    Object.keys(DRAW).forEach(function (k) { sprites[k] = { sharp: sprite(DRAW[k], false), soft: sprite(DRAW[k], true) }; });
  }

  /* ---------- field ---------- */
  var cv, ctx, W, H, dpr, running = false, petals = [], lastY = 0, scrollVel = 0, wind = 0;
  var sections = [], current = "welcome", frame = 0;
  var LAYERS = [ // depth, share of petals, sprite
    { z: .38, share: .45, soft: true },
    { z: .68, share: .38, soft: false },
    { z: 1.3, share: .17, soft: true },
  ];

  function pick(mix) {
    var r = Math.random(), acc = 0;
    for (var i = 0; i < mix.length; i++) { acc += mix[i][1]; if (r <= acc) return mix[i][0]; }
    return mix[0][0];
  }
  function layerFor(i, n) {
    var f = i / n, acc = 0;
    for (var k = 0; k < LAYERS.length; k++) { acc += LAYERS[k].share; if (f < acc) return LAYERS[k]; }
    return LAYERS[0];
  }
  function make(layer, fromTop, kind) {
    kind = kind || pick(SECTION_MIX[current] || SECTION_MIX.welcome);
    var z = layer.z * (.9 + Math.random() * .2);
    return {
      kind: kind, layer: layer, z: z,
      x: Math.random() * W,
      y: fromTop ? -40 - Math.random() * 120 : Math.random() * H,
      size: (W < 600 ? 30 : 38) * z * SIZE[kind] * (.8 + Math.random() * .4),
      vy: (.35 + Math.random() * .45) * (.6 + z),
      sway: Math.random() * 6.28, swaySpeed: .008 + Math.random() * .016, swayAmp: .4 + Math.random() * .9,
      rot: Math.random() * 6.28, vr: (Math.random() - .5) * .025,
      flip: Math.random() * 6.28, vf: .02 + Math.random() * .03,
      alpha: 0, life: 1, temp: false,
    };
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function activeSection() {
    var mid = H * .5, best = current;
    for (var i = 0; i < sections.length; i++) {
      var r = sections[i].getBoundingClientRect();
      if (r.top <= mid && r.bottom >= mid) { best = sections[i].id; break; }
    }
    return best;
  }

  function step() {
    if (!running) return;
    frame++;
    if (frame % 15 === 0) current = activeSection();
    var y = scrollY, dy = y - lastY; lastY = y;
    scrollVel += (dy - scrollVel) * .2;
    wind += ((Math.min(Math.abs(scrollVel), 40) / 40) * (scrollVel > 0 ? 1 : -1) * 1.2 - wind) * .05;

    ctx.clearRect(0, 0, W, H);
    for (var i = petals.length - 1; i >= 0; i--) {
      var p = petals[i];
      p.sway += p.swaySpeed; p.rot += p.vr + wind * .004; p.flip += p.vf;
      // parallax: page scroll pushes petals by depth (near ones move most)
      p.y += p.vy - dy * p.z * .55;
      p.x += Math.sin(p.sway) * p.swayAmp + wind * p.z;
      p.alpha = Math.min(1, p.alpha + .02);
      if (p.temp) { p.life -= .0025; if (p.life <= 0 || p.y > H + 60) { petals.splice(i, 1); continue; } }
      else if (p.y > H + 60 || p.y < -200 || p.x < -80 || p.x > W + 80) {
        var fromTop = p.y > H + 60 || p.x < -80 || p.x > W + 80;
        petals[i] = make(p.layer, fromTop);
        if (!fromTop) petals[i].y = H + 40; // scrolling up: re-enter from below
        continue;
      }
      var sp = sprites[p.kind][p.layer.soft ? "soft" : "sharp"];
      var flipX = Math.cos(p.flip); // 3D flutter
      ctx.save();
      ctx.globalAlpha = p.alpha * p.life * (.45 + .5 * Math.min(1, p.z));
      ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(Math.max(.15, Math.abs(flipX)), 1);
      ctx.drawImage(sp, -p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    }
    requestAnimationFrame(step);
  }

  function start(opts) {
    if (reduce || running) return;
    cv = document.getElementById("petals"); if (!cv || !cv.getContext) return;
    ctx = cv.getContext("2d");
    if (!sprites) buildSprites();
    sections = Array.prototype.slice.call(document.querySelectorAll("main > section:not([hidden])"));
    resize(); addEventListener("resize", resize);
    lastY = scrollY; current = activeSection();
    var n = W < 600 ? 30 : 52;
    for (var i = 0; i < n; i++) petals.push(make(layerFor(i, n), false));
    if (opts && opts.burst) burst(W < 600 ? 34 : 56);
    cv.classList.add("on"); running = true; requestAnimationFrame(step);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) running = false;
      else if (!running) { running = true; lastY = scrollY; requestAnimationFrame(step); }
    });
  }

  // a shower of rose petals from the top when the gate opens
  function burst(n) {
    for (var i = 0; i < n; i++) {
      var p = make(LAYERS[1 + (i % 2)], true, Math.random() < .8 ? "rose" : "jasmine");
      p.y = -20 - Math.random() * H * .5; p.vy *= 2.2; p.temp = true;
      petals.push(p);
    }
  }

  window.PetalField = { start: start, burst: burst };
})();
