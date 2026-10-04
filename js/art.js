/* =========================================================
   DK's Oven — hand-built SVG illustration kit
   ========================================================= */
(function () {
  const NS = "http://www.w3.org/2000/svg";

  function el(tag, attrs, parent) {
    const n = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  // deterministic random so illustrations look the same every load
  function rng(seed) {
    let s = seed >>> 0 || 1;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  }

  /* ---------------- ingredient shapes (centered at 0,0) ---------------- */
  const ING = {
    tomato(g) {
      el("circle", { r: 20, fill: "#d92b22" }, g);
      el("circle", { r: 16.5, fill: "#f0533f" }, g);
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        el("ellipse", { cx: Math.cos(a) * 9, cy: Math.sin(a) * 9, rx: 5, ry: 3.4, fill: "#ff9a7a", transform: `rotate(${(a * 180) / Math.PI} ${Math.cos(a) * 9} ${Math.sin(a) * 9})` }, g);
        el("circle", { cx: Math.cos(a) * 10, cy: Math.sin(a) * 10, r: 1.4, fill: "#fff1b8" }, g);
      }
      el("circle", { r: 3.5, fill: "#ffb39a" }, g);
    },
    olive(g) {
      el("circle", { r: 8, fill: "none", stroke: "#1c1612", "stroke-width": 6 }, g);
      el("path", { d: "M-6 -4 A7 7 0 0 1 2 -8", fill: "none", stroke: "#5a4a40", "stroke-width": 1.6, "stroke-linecap": "round" }, g);
    },
    capsicum(g) {
      el("path", { d: "M-18 6 Q0 -18 18 6", fill: "none", stroke: "#2b8a3e", "stroke-width": 7, "stroke-linecap": "round" }, g);
      el("path", { d: "M-13 3 Q0 -12 13 3", fill: "none", stroke: "#69db7c", "stroke-width": 2, "stroke-linecap": "round", opacity: 0.7 }, g);
    },
    onion(g) {
      el("path", { d: "M-16 8 A17 17 0 0 1 16 8", fill: "none", stroke: "#a64ca6", "stroke-width": 4, "stroke-linecap": "round" }, g);
      el("path", { d: "M-10 8 A11 11 0 0 1 10 8", fill: "none", stroke: "#e3a6e3", "stroke-width": 3, "stroke-linecap": "round" }, g);
    },
    jalapeno(g) {
      el("circle", { r: 9, fill: "#9bd46a", stroke: "#2f8f2f", "stroke-width": 3.5 }, g);
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + 0.4;
        el("circle", { cx: Math.cos(a) * 3.6, cy: Math.sin(a) * 3.6, r: 1.6, fill: "#fff7c2" }, g);
      }
    },
    tikka(g, r) {
      const pts = [];
      const n = 7;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const rad = 11 + r() * 6;
        pts.push([Math.cos(a) * rad, Math.sin(a) * rad * 0.8]);
      }
      el("path", { d: "M" + pts.map((p) => p.map((v) => v.toFixed(1)).join(" ")).join(" L") + "Z", fill: "#b5541e", stroke: "#7a3210", "stroke-width": 2, "stroke-linejoin": "round" }, g);
      el("path", { d: "M-7 -4 L5 -7 M-8 3 L7 0", stroke: "#e08a4a", "stroke-width": 2.4, "stroke-linecap": "round" }, g);
    },
    grill(g, r) {
      el("rect", { x: -14, y: -9, width: 28, height: 18, rx: 7, fill: "#e0a463", stroke: "#a8682e", "stroke-width": 2, transform: `rotate(${r() * 40 - 20})` }, g);
      el("path", { d: "M-8 -7 L-2 7 M0 -7 L6 7", stroke: "#6b3b16", "stroke-width": 2.6, "stroke-linecap": "round" }, g);
    },
    mushroom(g) {
      el("path", { d: "M-15 2 C-15 -14 15 -14 15 2 Z", fill: "#e9d6b4", stroke: "#a98a5e", "stroke-width": 2 }, g);
      el("rect", { x: -5, y: 1, width: 10, height: 11, rx: 3, fill: "#f3e6cb", stroke: "#a98a5e", "stroke-width": 2 }, g);
    },
    pepperoni(g, r) {
      el("circle", { r: 16, fill: "#b8261b" }, g);
      el("circle", { r: 13, fill: "#cf3424" }, g);
      for (let i = 0; i < 5; i++) el("circle", { cx: (r() - 0.5) * 18, cy: (r() - 0.5) * 18, r: 1.6 + r() * 1.2, fill: "#f39a7f", opacity: 0.8 }, g);
    },
    sausage(g, r) {
      el("circle", { r: 9, fill: "#b5653a", stroke: "#7e3e1d", "stroke-width": 2 }, g);
      el("circle", { cx: (r() - 0.5) * 6, cy: (r() - 0.5) * 6, r: 1.6, fill: "#e8a77a" }, g);
    },
    corn(g) {
      el("rect", { x: -5, y: -5, width: 10, height: 10, rx: 3.5, fill: "#ffd23f", stroke: "#e0a800", "stroke-width": 1.5 }, g);
    },
    basil(g) {
      el("path", { d: "M-20 0 C-10 -14 12 -14 20 0 C12 12 -10 12 -20 0 Z", fill: "#2f8a3a" }, g);
      el("path", { d: "M-18 0 L18 0", stroke: "#7fd18a", "stroke-width": 1.6 }, g);
    },
    chili(g) {
      el("path", { d: "M-22 -2 C-10 14 12 14 22 -6 C14 4 -6 6 -16 -6 Z", fill: "#e5281b" }, g);
      el("path", { d: "M-16 -6 C-20 -10 -24 -10 -26 -14", stroke: "#2f8a3a", "stroke-width": 4, fill: "none", "stroke-linecap": "round" }, g);
    },
    cheese(g) {
      el("path", { d: "M-20 14 L20 14 L14 -14 Z", fill: "#ffcf3d", stroke: "#e2a50c", "stroke-width": 2, "stroke-linejoin": "round" }, g);
      el("circle", { cx: 6, cy: 6, r: 3, fill: "#e8b11a" }, g);
      el("circle", { cx: 12, cy: -2, r: 2, fill: "#e8b11a" }, g);
    },
  };

  function ingredient(type, parent, seed) {
    const g = el("g", { class: "ing ing--" + type }, parent);
    (ING[type] || ING.olive)(g, rng(seed || 7));
    return g;
  }

  /* ---------------- mini pizza for menu cards ---------------- */
  function miniPizza(tops, seed) {
    const svg = el("svg", { viewBox: "-50 -50 100 100", class: "mcard__pz", "aria-hidden": "true" });
    const r = rng(seed);
    el("circle", { r: 47, fill: "#d8902f" }, svg);
    el("circle", { r: 44, fill: "#eeb257" }, svg);
    el("circle", { r: 38, fill: "#c9321f" }, svg);
    // cheese blob
    let d = "";
    for (let i = 0; i <= 18; i++) {
      const a = (i / 18) * Math.PI * 2;
      const rad = 33 + r() * 4;
      d += (i ? "L" : "M") + (Math.cos(a) * rad).toFixed(1) + " " + (Math.sin(a) * rad).toFixed(1);
    }
    el("path", { d: d + "Z", fill: "#ffd45e" }, svg);
    for (let i = 0; i < 7; i++) el("circle", { cx: (r() - 0.5) * 50, cy: (r() - 0.5) * 50, r: 2 + r() * 3, fill: "#f2b23a", opacity: 0.8 }, svg);
    const list = tops.length ? tops : ["cheese_only"];
    const count = tops.length ? 9 : 0;
    for (let i = 0; i < count; i++) {
      const t = list[i % list.length];
      const a = r() * Math.PI * 2, rad = Math.sqrt(r()) * 26;
      const g = el("g", { transform: `translate(${(Math.cos(a) * rad).toFixed(1)} ${(Math.sin(a) * rad).toFixed(1)}) rotate(${(r() * 360) | 0}) scale(.42)` }, svg);
      (ING[t] || ING.olive)(g, r);
    }
    // slice lines
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI;
      el("line", { x1: Math.cos(a) * -44, y1: Math.sin(a) * -44, x2: Math.cos(a) * 44, y2: Math.sin(a) * 44, stroke: "#8a4a1a", "stroke-width": 0.8, opacity: 0.45 }, svg);
    }
    return svg;
  }

  /* ---------------- rider on scooter (side view, facing right) ---------------- */
  function riderSVG(opts = {}) {
    const svg = el("svg", { viewBox: "0 0 460 300", "aria-hidden": "true" });
    const root = el("g", { class: "rider__root" }, svg);

    // speed lines
    const speed = el("g", { class: "rider__speed", stroke: opts.speedColor || "rgba(255,255,255,.85)", "stroke-width": 6, "stroke-linecap": "round" }, root);
    [[-60, 120, 20], [-90, 170, 10], [-40, 210, 30], [-110, 240, 0]].forEach(([x, y, l]) => el("line", { x1: x, y1: y, x2: x + 60 + l, y2: y }, speed));

    // exhaust puffs
    const puffs = el("g", { class: "rider__puffs", fill: opts.puffColor || "rgba(255,255,255,.75)" }, root);
    for (let i = 0; i < 3; i++) el("circle", { cx: 40 - i * 22, cy: 236 - i * 6, r: 9 + i * 4, class: "puff" }, puffs);

    const bike = el("g", { class: "rider__bike" }, root);

    // delivery box + rack
    el("rect", { x: 70, y: 145, width: 90, height: 8, rx: 3, fill: "#333" }, bike);
    const box = el("g", { class: "rider__box" }, bike);
    el("rect", { x: 56, y: 58, width: 116, height: 90, rx: 12, fill: "#ffc21a", stroke: "#1a0d08", "stroke-width": 5 }, box);
    el("rect", { x: 56, y: 58, width: 116, height: 20, rx: 10, fill: "#e0261b", stroke: "#1a0d08", "stroke-width": 5 }, box);
    const t = el("text", { x: 114, y: 120, "text-anchor": "middle", "font-family": "Bungee, Impact, sans-serif", "font-size": 30, fill: "#e0261b" }, box);
    t.textContent = "DK's";
    const t2 = el("text", { x: 114, y: 140, "text-anchor": "middle", "font-family": "Bungee, Impact, sans-serif", "font-size": 13, fill: "#1a0d08", "letter-spacing": 3 }, box);
    t2.textContent = "OVEN";

    // rear body
    el("path", { d: "M44 232 C44 180 84 160 146 160 L226 160 C242 160 248 172 248 188 L248 214 L156 214 C152 192 134 182 112 182 C86 182 70 202 70 232 Z", fill: "#e0261b", stroke: "#1a0d08", "stroke-width": 5, "stroke-linejoin": "round" }, bike);
    el("path", { d: "M70 196 C 100 178 150 176 200 182", stroke: "#ffc21a", "stroke-width": 6, fill: "none", "stroke-linecap": "round" }, bike);
    // seat
    el("path", { d: "M118 160 Q116 140 140 140 L226 140 Q244 140 240 160 Z", fill: "#3a2015", stroke: "#1a0d08", "stroke-width": 5, "stroke-linejoin": "round" }, bike);
    // floorboard
    el("rect", { x: 150, y: 206, width: 170, height: 18, rx: 7, fill: "#2b1d18", stroke: "#1a0d08", "stroke-width": 4 }, bike);
    // front column + shield
    el("path", { d: "M296 224 L322 96 L350 96 L338 160 C 360 170 368 200 360 224 Z", fill: "#e0261b", stroke: "#1a0d08", "stroke-width": 5, "stroke-linejoin": "round" }, bike);
    el("circle", { cx: 352, cy: 120, r: 11, fill: "#fff3b0", stroke: "#1a0d08", "stroke-width": 4 }, bike);
    // front fender
    el("path", { d: "M318 240 C318 208 342 196 366 198 C390 200 404 218 404 240", stroke: "#e0261b", "stroke-width": 14, fill: "none", "stroke-linecap": "round" }, bike);
    el("path", { d: "M318 240 C318 208 342 196 366 198 C390 200 404 218 404 240", stroke: "#1a0d08", "stroke-width": 3, fill: "none", opacity: 0.5 }, bike);
    // handlebar
    el("path", { d: "M316 90 L360 80", stroke: "#1a0d08", "stroke-width": 9, "stroke-linecap": "round" }, bike);
    el("path", { d: "M336 86 L330 100", stroke: "#1a0d08", "stroke-width": 7, "stroke-linecap": "round" }, bike);

    // wheels
    function wheel(cx, cy, cls) {
      const g = el("g", { class: "rider__wheel " + cls, transform: `translate(${cx} ${cy})` }, bike);
      el("circle", { r: 40, fill: "#1a1a1a" }, g);
      el("circle", { r: 28, fill: "#cfcfcf", stroke: "#1a1a1a", "stroke-width": 4 }, g);
      const sp = el("g", { class: "spokes" }, g);
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        el("line", { x1: 0, y1: 0, x2: Math.cos(a) * 26, y2: Math.sin(a) * 26, stroke: "#6b6b6b", "stroke-width": 4, "stroke-linecap": "round" }, sp);
      }
      el("circle", { r: 7, fill: "#e0261b", stroke: "#1a0d08", "stroke-width": 3 }, g);
      return g;
    }
    wheel(110, 246, "rider__wheel--rear");
    wheel(362, 246, "rider__wheel--front");

    // rider
    const man = el("g", { class: "rider__man" }, bike);
    el("path", { d: "M186 150 L254 152 L272 202", stroke: "#2b2b3a", "stroke-width": 26, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, man);
    el("ellipse", { cx: 282, cy: 206, rx: 20, ry: 9, fill: "#111" }, man);
    el("path", { d: "M186 146 L214 70", stroke: "#e0261b", "stroke-width": 44, "stroke-linecap": "round" }, man);
    el("path", { d: "M180 118 L206 54", stroke: "#ffc21a", "stroke-width": 6, "stroke-linecap": "round", opacity: 0.9 }, man);
    el("path", { d: "M216 74 L272 104 L322 90", stroke: "#c81f15", "stroke-width": 17, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, man);
    el("circle", { cx: 324, cy: 89, r: 9, fill: "#1a0d08" }, man);
    // head + helmet
    el("rect", { x: 210, y: 46, width: 18, height: 16, rx: 6, fill: "#d9a07a" }, man);
    const head = el("g", { class: "rider__head" }, man);
    el("circle", { cx: 226, cy: 30, r: 28, fill: "#ffc21a", stroke: "#1a0d08", "stroke-width": 5 }, head);
    el("path", { d: "M232 16 C250 14 258 26 256 40 L234 40 Z", fill: "#1a0d08" }, head);
    el("path", { d: "M238 22 C246 22 250 26 251 32", stroke: "#7fd1ff", "stroke-width": 3, fill: "none", "stroke-linecap": "round" }, head);
    el("path", { d: "M200 22 C206 6 222 2 236 6", stroke: "#e0261b", "stroke-width": 7, fill: "none", "stroke-linecap": "round" }, head);

    return svg;
  }

  /* ---------------- skyline (seamless 1200-wide tile repeated) ---------------- */
  function skyline(svg, kind) {
    const r = rng(kind === "far" ? 11 : 23);
    for (let tile = 0; tile < 2; tile++) {
      const g = el("g", { transform: `translate(${tile * 1200} 0)` }, svg);
      if (kind === "far") {
        // Margalla-ish hills
        el("path", { d: "M0 300 L0 170 C80 120 160 150 240 110 C320 70 420 140 520 100 C620 60 700 120 800 90 C900 60 1000 130 1100 110 C1150 100 1180 140 1200 170 L1200 300 Z" }, g);
      } else {
        let x = 0;
        while (x < 1200) {
          const w = 50 + r() * 70;
          const h = 60 + r() * 110;
          if (w + x > 1200) break;
          el("rect", { x, y: 300 - h, width: w - 6, height: h }, g);
          // windows
          for (let wy = 300 - h + 14; wy < 290; wy += 22)
            for (let wx = x + 8; wx < x + w - 18; wx += 16)
              if (r() > 0.45) el("rect", { x: wx, y: wy, width: 7, height: 9, fill: "#ffc21a", opacity: 0.55 }, g);
          x += w;
        }
        // landmarks: Taxila stupa, Mughal arch (Wah Gardens), domed shrine
        stupa(g, 220);
        archGate(g, 600);
        dome(g, 980);
        // trees
        for (let i = 0; i < 9; i++) {
          const tx = 40 + i * 135 + r() * 30;
          el("circle", { cx: tx, cy: 272, r: 18 + r() * 8 }, g);
          el("rect", { x: tx - 3, y: 276, width: 6, height: 24 }, g);
        }
      }
    }
  }
  function stupa(g, x) {
    el("rect", { x: x - 70, y: 270, width: 140, height: 30 }, g);
    el("path", { d: `M${x - 60} 272 C${x - 60} 200 ${x + 60} 200 ${x + 60} 272 Z` }, g);
    el("rect", { x: x - 14, y: 196, width: 28, height: 16 }, g);
    for (let i = 0; i < 4; i++) el("rect", { x: x - 16 + i * 4, y: 170 - i * 8, width: 32 - i * 8, height: 5 }, g);
    el("rect", { x: x - 2, y: 130, width: 4, height: 40 }, g);
  }
  function archGate(g, x) {
    el("path", { d: `M${x - 80} 300 L${x - 80} 170 L${x + 80} 170 L${x + 80} 300 L${x + 36} 300 L${x + 36} 240 C${x + 36} 200 ${x - 36} 200 ${x - 36} 240 L${x - 36} 300 Z` }, g);
    el("rect", { x: x - 92, y: 150, width: 14, height: 150 }, g);
    el("rect", { x: x + 78, y: 150, width: 14, height: 150 }, g);
    el("path", { d: `M${x - 98} 152 L${x - 85} 128 L${x - 72} 152 Z M${x + 72} 152 L${x + 85} 128 L${x + 98} 152 Z` }, g);
    el("path", { d: `M${x - 40} 172 C${x - 40} 130 ${x + 40} 130 ${x + 40} 172 Z` }, g);
  }
  function dome(g, x) {
    el("rect", { x: x - 60, y: 210, width: 120, height: 90 }, g);
    el("path", { d: `M${x - 46} 212 C${x - 50} 150 ${x + 50} 150 ${x + 46} 212 Z` }, g);
    el("rect", { x: x - 2, y: 130, width: 4, height: 26 }, g);
    el("path", { d: `M${x - 74} 300 L${x - 74} 196 C${x - 74} 182 ${x - 58} 182 ${x - 58} 196 L${x - 58} 300 Z M${x + 58} 300 L${x + 58} 196 C${x + 58} 182 ${x + 74} 182 ${x + 74} 196 L${x + 74} 300 Z` }, g);
  }

  window.DKArt = { el, rng, ingredient, ING, miniPizza, riderSVG, skyline };
})();
