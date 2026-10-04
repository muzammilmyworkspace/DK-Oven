/* =========================================================
   DK's Oven — "From dough to your door" scroll story
   One SVG kitchen, one scrubbed GSAP timeline.
   ========================================================= */
(function () {
  const { el, rng, ING, riderSVG } = window.DKArt;
  const CX = 400, CY = 330, R = 200;

  function build(svg) {
    const r = rng(42);
    const defs = el("defs", null, svg);
    defs.innerHTML = `
      <radialGradient id="gDough" cx="45%" cy="40%" r="60%">
        <stop offset="0" stop-color="#fbe9c4"/><stop offset=".75" stop-color="#f1d196"/><stop offset="1" stop-color="#e4b46c"/>
      </radialGradient>
      <radialGradient id="gBall" cx="35%" cy="30%" r="75%">
        <stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#7a4a1a" stop-opacity=".45"/>
      </radialGradient>
      <radialGradient id="gWood" cx="50%" cy="45%" r="60%">
        <stop offset="0" stop-color="#c7884c"/><stop offset="1" stop-color="#8d5426"/>
      </radialGradient>
      <linearGradient id="gPin" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#e4b27a"/><stop offset=".5" stop-color="#c98a4b"/><stop offset="1" stop-color="#9c6230"/>
      </linearGradient>
      <radialGradient id="gCrust" cx="50%" cy="50%" r="50%">
        <stop offset=".86" stop-color="#e09a3a"/><stop offset=".95" stop-color="#b8661f"/><stop offset="1" stop-color="#8d4a14"/>
      </radialGradient>
      <radialGradient id="gMouth" cx="50%" cy="70%" r="70%">
        <stop offset="0" stop-color="#ff9a2e"/><stop offset=".35" stop-color="#b8360f"/><stop offset="1" stop-color="#2a0c05"/>
      </radialGradient>
      <radialGradient id="gHeat" cx="50%" cy="50%" r="50%">
        <stop offset="0" stop-color="#ffb347" stop-opacity=".9"/><stop offset="1" stop-color="#ff5a1f" stop-opacity="0"/>
      </radialGradient>
      <pattern id="pBrick" width="64" height="32" patternUnits="userSpaceOnUse">
        <rect width="64" height="32" fill="#5e2414"/>
        <rect x="2" y="2" width="60" height="13" rx="2" fill="#a8432a"/>
        <rect x="-30" y="18" width="60" height="12" rx="2" fill="#94371f"/>
        <rect x="34" y="18" width="60" height="12" rx="2" fill="#b04a2e"/>
      </pattern>
      <filter id="fShadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#000" flood-opacity=".45"/></filter>
      <filter id="fBlur"><feGaussianBlur stdDeviation="8"/></filter>
    `;

    // floor shadow
    el("ellipse", { cx: CX, cy: 590, rx: 300, ry: 34, fill: "#000", opacity: 0.35, filter: "url(#fBlur)" }, svg);

    /* ---- oven back (interior + fire) ---- */
    const ovenBack = el("g", { id: "ovenBack" }, svg);
    el("path", { d: "M240 540 L240 400 C240 285 560 285 560 400 L560 540 Z", fill: "url(#gMouth)" }, ovenBack);
    const flames = el("g", { class: "k-flames" }, ovenBack);
    [[300, 1], [345, 1.3], [400, 1.5], [455, 1.25], [505, 1]].forEach(([x, s], i) => {
      const f = el("g", { transform: `translate(${x} 520) scale(${s})` }, flames);
      el("path", { class: "flame", style: `animation-delay:${i * -0.17}s`, d: "M0 0 C-26 -10 -22 -44 -6 -62 C-8 -44 6 -40 4 -60 C22 -40 28 -10 0 0 Z", fill: "#ff6a1f" }, f);
      el("path", { class: "flame flame--in", style: `animation-delay:${i * -0.23}s`, d: "M0 0 C-14 -6 -12 -26 -2 -36 C-2 -26 6 -24 4 -36 C14 -24 14 -6 0 0 Z", fill: "#ffd23f" }, f);
    });
    el("ellipse", { class: "k-heat", cx: CX, cy: 470, rx: 220, ry: 110, fill: "url(#gHeat)", opacity: 0.5 }, ovenBack);

    /* ---- wooden peel ---- */
    const board = el("g", { id: "board", filter: "url(#fShadow)" }, svg);
    el("rect", { x: 372, y: 560, width: 56, height: 140, rx: 20, fill: "#8d5426" }, board);
    el("circle", { cx: CX, cy: CY, r: 248, fill: "url(#gWood)" }, board);
    for (let i = 0; i < 9; i++) {
      const y = 120 + i * 48 + r() * 10;
      el("path", { d: `M${170 + r() * 30} ${y} C ${300} ${y - 14 + r() * 28}, ${500} ${y + 14 - r() * 28}, ${630 - r() * 30} ${y}`, stroke: "#7a4520", "stroke-width": 2, fill: "none", opacity: 0.35 }, board);
    }
    el("circle", { cx: CX, cy: CY, r: 248, fill: "none", stroke: "#6e3c18", "stroke-width": 4, opacity: 0.6 }, board);

    /* ---- pack = box bottom + pizza + lid (moves to rider at the end) ---- */
    const pack = el("g", { id: "pack" }, svg);

    const boxBottom = el("g", { id: "boxBottom", opacity: 0 }, pack);
    el("rect", { x: 140, y: 70, width: 520, height: 520, rx: 16, fill: "#b97c3d", filter: "url(#fShadow)" }, boxBottom);
    el("rect", { x: 158, y: 88, width: 484, height: 484, rx: 10, fill: "#e2ae6c" }, boxBottom);
    el("path", { d: "M158 88 L190 120 M642 88 L610 120 M158 572 L190 540 M642 572 L610 540", stroke: "#b97c3d", "stroke-width": 3 }, boxBottom);
    el("rect", { x: 190, y: 120, width: 420, height: 420, rx: 6, fill: "none", stroke: "#c99256", "stroke-width": 2, "stroke-dasharray": "6 8" }, boxBottom);

    const pizza = el("g", { id: "pizza" }, pack);

    const flour = el("g", { id: "flour", opacity: 0 }, pizza);
    for (let i = 0; i < 46; i++) {
      const a = r() * Math.PI * 2, d = 120 + r() * 160;
      el("circle", { cx: CX + Math.cos(a) * d, cy: CY + Math.sin(a) * d, r: 2 + r() * 6, fill: "#fff8ea", opacity: 0.5 + r() * 0.5 }, flour);
    }

    const dough = el("g", { id: "dough", filter: "url(#fShadow)" }, pizza);
    el("circle", { cx: CX, cy: CY, r: R, fill: "url(#gDough)" }, dough);
    el("circle", { class: "k-rawcrust", cx: CX, cy: CY, r: 188, fill: "none", stroke: "#f6dca6", "stroke-width": 24 }, dough);
    el("circle", { cx: CX, cy: CY, r: 175, fill: "none", stroke: "#d9a860", "stroke-width": 2, opacity: 0.4 }, dough);
    const ballShade = el("circle", { id: "ballShade", cx: CX, cy: CY, r: R, fill: "url(#gBall)" }, pizza);

    // sauce
    const sauceBase = el("g", { id: "sauceBase", opacity: 0 }, pizza);
    el("circle", { cx: CX, cy: CY, r: 172, fill: "#c42e1b" }, sauceBase);
    for (let i = 0; i < 14; i++) el("ellipse", { cx: CX + (r() - 0.5) * 260, cy: CY + (r() - 0.5) * 260, rx: 10 + r() * 20, ry: 6 + r() * 10, fill: "#a8220f", opacity: 0.45 }, sauceBase);
    let sd = "";
    const turns = 5.2, steps = 360;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps, a = t * turns * Math.PI * 2, rad = t * 160;
      sd += (i ? "L" : "M") + (CX + Math.cos(a) * rad).toFixed(1) + " " + (CY + Math.sin(a) * rad).toFixed(1);
    }
    const spiral = el("path", { id: "spiral", d: sd, fill: "none", stroke: "#d1351f", "stroke-width": 30, "stroke-linecap": "round", "stroke-linejoin": "round" }, pizza);

    // cheese
    const cheeseBase = el("g", { id: "cheeseBase", opacity: 0 }, pizza);
    let cd = "";
    for (let i = 0; i <= 28; i++) {
      const a = (i / 28) * Math.PI * 2, rad = 158 + r() * 12;
      cd += (i ? "L" : "M") + (CX + Math.cos(a) * rad).toFixed(1) + " " + (CY + Math.sin(a) * rad).toFixed(1);
    }
    el("path", { d: cd + "Z", fill: "#ffd862", "stroke-linejoin": "round" }, cheeseBase);
    for (let i = 0; i < 16; i++) el("circle", { cx: CX + (r() - 0.5) * 250, cy: CY + (r() - 0.5) * 250, r: 6 + r() * 12, fill: "#fff0a8", opacity: 0.6 }, cheeseBase);

    const shreds = el("g", { id: "shreds" }, pizza);
    const shredEls = [];
    const shredCols = ["#ffe58f", "#fff1b8", "#ffd34d", "#ffeaa0"];
    for (let i = 0; i < 150; i++) {
      const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 158;
      const s = el("rect", { x: -8, y: -2.5, width: 16, height: 5, rx: 2.5, fill: shredCols[i % 4], stroke: "#e6b530", "stroke-width": 0.8 }, shreds);
      s._x = CX + Math.cos(a) * d; s._y = CY + Math.sin(a) * d; s._rot = r() * 360;
      shredEls.push(s);
    }

    // toppings
    const toppings = el("g", { id: "toppings" }, pizza);
    const topEls = [];
    const plan = [["tikka", 12], ["tomato", 7], ["capsicum", 9], ["onion", 8], ["olive", 10], ["jalapeno", 6], ["mushroom", 5]];
    const placed = [];
    plan.forEach(([type, n]) => {
      for (let i = 0; i < n; i++) {
        let x, y, tries = 0;
        do {
          const a = r() * Math.PI * 2, d = 22 + Math.sqrt(r()) * 128;
          x = CX + Math.cos(a) * d; y = CY + Math.sin(a) * d; tries++;
        } while (tries < 30 && placed.some((p) => Math.hypot(p[0] - x, p[1] - y) < 30));
        placed.push([x, y]);
        const g = el("g", { class: "k-top" }, toppings);
        ING[type](g, r);
        g._x = x; g._y = y; g._rot = r() * 360; g._s = type === "tomato" ? 1.15 : 1.05;
        topEls.push(g);
      }
    });

    // baked look
    const baked = el("g", { id: "baked", opacity: 0 }, pizza);
    el("circle", { cx: CX, cy: CY, r: 189, fill: "none", stroke: "url(#gCrust)", "stroke-width": 28 }, baked);
    for (let i = 0; i < 26; i++) {
      el("ellipse", { cx: CX + (r() - 0.5) * 280, cy: CY + (r() - 0.5) * 280, rx: 6 + r() * 12, ry: 4 + r() * 8, fill: "#c97a22", opacity: 0.35 + r() * 0.25 }, baked);
    }
    for (let i = 0; i < 22; i++) {
      const a = r() * Math.PI * 2, d = 186 + (r() - 0.5) * 16;
      el("circle", { cx: CX + Math.cos(a) * d, cy: CY + Math.sin(a) * d, r: 2 + r() * 4, fill: "#8a4513", opacity: 0.5 }, baked);
    }

    // cut lines
    const cuts = el("g", { id: "cuts" }, pizza);
    const cutEls = [];
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI + 0.2;
      const x1 = CX + Math.cos(a) * -195, y1 = CY + Math.sin(a) * -195, x2 = CX + Math.cos(a) * 195, y2 = CY + Math.sin(a) * 195;
      const ln = el("line", { x1, y1, x2, y2, stroke: "#6b3410", "stroke-width": 4, opacity: 0.6, "stroke-dasharray": 390, "stroke-dashoffset": 390, "stroke-linecap": "round" }, cuts);
      ln._p = [x1, y1, x2, y2];
      cutEls.push(ln);
    }

    // steam
    const steam = el("g", { id: "kSteam", class: "k-steam", opacity: 0 }, pizza);
    [[330, 0], [400, 1.1], [470, 2.1], [365, 2.9], [440, 3.6]].forEach(([x, d]) =>
      el("path", { d: `M${x} 300 C ${x - 30} 240, ${x + 30} 200, ${x} 150 S ${x + 30} 60, ${x} 10`, style: `animation-delay:${d}s` }, steam)
    );

    // lid
    const lid = el("g", { id: "lid" }, pack);
    const lidInner = el("g", { id: "lidInner" }, lid);
    el("rect", { x: 140, y: -440, width: 520, height: 520, rx: 16, fill: "#d39a57" }, lidInner);
    el("rect", { x: 160, y: -420, width: 480, height: 480, rx: 10, fill: "#e8bb7d" }, lidInner);
    const lidOuter = el("g", { id: "lidOuter" }, lid);
    el("rect", { x: 140, y: 70, width: 520, height: 520, rx: 16, fill: "#ffc21a", stroke: "#1a0d08", "stroke-width": 6 }, lidOuter);
    el("rect", { x: 164, y: 94, width: 472, height: 472, rx: 10, fill: "none", stroke: "#e0261b", "stroke-width": 10 }, lidOuter);
    el("rect", { x: 182, y: 112, width: 436, height: 436, rx: 8, fill: "none", stroke: "#e0261b", "stroke-width": 2, "stroke-dasharray": "10 8" }, lidOuter);
    el("image", { href: "assets/img/logo.png", x: 255, y: 155, width: 290, height: 290 }, lidOuter);
    const lt = el("text", { x: CX, y: 510, "text-anchor": "middle", "font-family": "Bungee, Impact, sans-serif", "font-size": 26, fill: "#8a1a12", "letter-spacing": 4 }, lidOuter);
    lt.textContent = "HOT · FRESH · DK'S";

    /* ---- oven front (bricks with arched mouth) ---- */
    const ovenFront = el("g", { id: "ovenFront" }, svg);
    const dome = "M90 610 L90 360 C90 110 710 110 710 360 L710 610 Z";
    const mouth = "M240 540 L240 400 C240 285 560 285 560 400 L560 540 Z";
    el("path", { d: dome + " " + mouth, "fill-rule": "evenodd", fill: "url(#pBrick)", stroke: "#3b1209", "stroke-width": 8 }, ovenFront);
    el("path", { d: "M222 548 L222 400 C222 262 578 262 578 400 L578 548", fill: "none", stroke: "#d8c2a0", "stroke-width": 26 }, ovenFront);
    el("path", { d: "M222 548 L222 400 C222 262 578 262 578 400 L578 548", fill: "none", stroke: "#3b1209", "stroke-width": 26, "stroke-dasharray": "4 40", opacity: 0.6 }, ovenFront);
    el("rect", { x: 70, y: 540, width: 660, height: 70, rx: 10, fill: "#4a3a33", stroke: "#2a1d18", "stroke-width": 6 }, ovenFront);
    el("rect", { x: 70, y: 540, width: 660, height: 14, fill: "#6d5a50" }, ovenFront);
    el("rect", { x: 520, y: 70, width: 70, height: 110, fill: "url(#pBrick)", stroke: "#3b1209", "stroke-width": 6 }, ovenFront);
    el("rect", { x: 508, y: 56, width: 94, height: 20, rx: 4, fill: "#3b1209" }, ovenFront);
    // name plate
    el("rect", { x: 300, y: 190, width: 200, height: 52, rx: 26, fill: "#1a0d08", stroke: "#ffc21a", "stroke-width": 4 }, ovenFront);
    const pt = el("text", { x: CX, y: 225, "text-anchor": "middle", "font-family": "Bungee, Impact, sans-serif", "font-size": 24, fill: "#ffc21a" }, ovenFront);
    pt.textContent = "DK'S OVEN";
    // bake timer
    const timer = el("g", { id: "timer", transform: "translate(640 250)" }, ovenFront);
    el("circle", { r: 44, fill: "#1a0d08", stroke: "#ffc21a", "stroke-width": 4 }, timer);
    const tArc = el("circle", { r: 34, fill: "none", stroke: "#ff5a1f", "stroke-width": 8, "stroke-dasharray": 214, "stroke-dashoffset": 214, transform: "rotate(-90)", "stroke-linecap": "round" }, timer);
    const tt = el("text", { y: 6, "text-anchor": "middle", "font-family": "Bungee, Impact, sans-serif", "font-size": 16, fill: "#fff4dc" }, timer);
    tt.textContent = "HOT";
    // smoke from chimney
    const smoke = el("g", { class: "k-smoke", fill: "rgba(255,244,220,.35)" }, ovenFront);
    for (let i = 0; i < 4; i++) el("circle", { cx: 555, cy: 40, r: 16 + i * 6, style: `animation-delay:${i * 0.6}s` }, smoke);

    /* ---- tools ---- */
    const pin = el("g", { id: "pin", filter: "url(#fShadow)" }, svg);
    el("rect", { x: -300, y: -14, width: 70, height: 28, rx: 14, fill: "#a8692f" }, pin);
    el("rect", { x: 230, y: -14, width: 70, height: 28, rx: 14, fill: "#a8692f" }, pin);
    el("rect", { x: -232, y: -32, width: 464, height: 64, rx: 30, fill: "url(#gPin)", stroke: "#7a4520", "stroke-width": 3 }, pin);
    for (let i = 0; i < 6; i++) el("line", { x1: -180 + i * 72, y1: -28, x2: -170 + i * 72, y2: 28, stroke: "#9c6230", "stroke-width": 2, opacity: 0.4 }, pin);

    const ladle = el("g", { id: "ladle", filter: "url(#fShadow)" }, svg);
    el("path", { d: "M20 -20 L150 -200", stroke: "#9aa0a6", "stroke-width": 14, "stroke-linecap": "round" }, ladle);
    el("path", { d: "M20 -20 L150 -200", stroke: "#dfe3e6", "stroke-width": 4, "stroke-linecap": "round" }, ladle);
    el("circle", { r: 40, fill: "#b9bec2", stroke: "#7d8388", "stroke-width": 4 }, ladle);
    el("ellipse", { rx: 30, ry: 26, fill: "#c42e1b" }, ladle);
    el("ellipse", { cx: -8, cy: -8, rx: 10, ry: 6, fill: "#e8604a", opacity: 0.8 }, ladle);

    const cutter = el("g", { id: "cutter", filter: "url(#fShadow)" }, svg);
    el("path", { d: "M0 0 L110 -120", stroke: "#1a0d08", "stroke-width": 22, "stroke-linecap": "round" }, cutter);
    el("path", { d: "M0 0 L110 -120", stroke: "#e0261b", "stroke-width": 12, "stroke-linecap": "round" }, cutter);
    el("circle", { r: 34, fill: "#e6e9ec", stroke: "#6b7076", "stroke-width": 5 }, cutter);
    el("circle", { r: 8, fill: "#6b7076" }, cutter);

    // falling-from-above cheese bag hint
    const ding = el("g", { id: "ding", opacity: 0 }, svg);
    el("path", { d: "M400 60 l20 -40 l20 40 l40 -10 l-20 40 l40 20 l-44 10 l10 40 l-36 -24 l-30 30 l-4 -40 l-40 -6 l34 -22 l-18 -36 z", fill: "#ffc21a", stroke: "#1a0d08", "stroke-width": 5, transform: "translate(-20 0)" }, ding);
    const dt = el("text", { x: 400, y: 98, "text-anchor": "middle", "font-family": "Bungee, Impact, sans-serif", "font-size": 30, fill: "#e0261b" }, ding);
    dt.textContent = "DING!";

    // rider
    const riderWrap = el("g", { id: "kRider" }, svg);
    const rs = riderSVG({ speedColor: "rgba(255,194,26,.85)", puffColor: "rgba(255,244,220,.5)" });
    rs.setAttribute("width", 460); rs.setAttribute("height", 300); rs.setAttribute("overflow", "visible");
    riderWrap.appendChild(rs);

    return { svg, ovenBack, ovenFront, flames, board, pack, boxBottom, pizza, flour, ballShade, sauceBase, spiral, cheeseBase, shredEls, topEls, baked, cutEls, steam, lidInner, lidOuter, pin, ladle, cutter, ding, riderWrap, rs, tArc };
  }

  function init() {
    const svg = document.getElementById("kitchen");
    if (!svg || !window.gsap) return;
    const k = build(svg);
    const steps = [...document.querySelectorAll("#processSteps .pstep")];
    const dots = [...document.querySelectorAll("#processDots li")];
    const bar = document.getElementById("processBar");
    const section = document.getElementById("process");

    const O = { svgOrigin: `${CX} ${CY}` };
    const spiralLen = k.spiral.getTotalLength();

    // ---------- initial state ----------
    gsap.set([k.ovenBack, k.ovenFront], { x: 900 });
    gsap.set([k.pizza, k.pack, k.flour], { ...O });
    gsap.set(k.pizza, { scale: 0.3, y: -560 });
    gsap.set(k.spiral, { strokeDasharray: spiralLen, strokeDashoffset: spiralLen });
    k.shredEls.forEach((s) => gsap.set(s, { x: s._x, y: s._y, rotation: s._rot, opacity: 0 }));
    k.topEls.forEach((t) => gsap.set(t, { x: t._x, y: t._y, rotation: t._rot, scale: t._s, opacity: 0 }));
    gsap.set(k.pin, { x: CX, y: -200 });
    gsap.set(k.ladle, { x: 1000, y: -200 });
    gsap.set(k.cutter, { x: 1000, y: 700 });
    gsap.set(k.lidInner, { svgOrigin: "400 70", scaleY: 0 });
    gsap.set(k.lidOuter, { svgOrigin: "400 70", scaleY: 0 });
    gsap.set(k.boxBottom, { ...O, scale: 0.85 });
    gsap.set(k.riderWrap, { x: -900, y: 300, scale: 1.05, autoAlpha: 0 });
    gsap.set([k.ovenBack, k.ovenFront, k.ladle, k.cutter], { autoAlpha: 0 });
    gsap.set(k.ding, { svgOrigin: "400 70", scale: 0.4 });
    const wheels = k.rs.querySelectorAll(".spokes");
    const speedLines = k.rs.querySelector(".rider__speed");
    gsap.set(speedLines, { opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    // ---------- 01 dough ----------
    tl.to(k.pizza, { y: 0, duration: 0.6, ease: "bounce.out" }, 0)
      .to(k.flour, { opacity: 1, duration: 0.2 }, 0.5)
      .to(k.pin, { y: 170, duration: 0.3 }, 0.6)
      .to(k.pin, { y: 500, duration: 0.5, ease: "sine.inOut" }, 0.9)
      .to(k.pin, { y: 200, duration: 0.4, ease: "sine.inOut" }, 1.4)
      .to(k.pizza, { scale: 1, duration: 0.9, ease: "power1.inOut" }, 0.9)
      .to(k.ballShade, { opacity: 0, duration: 0.8 }, 0.9)
      .to(k.flour, { scale: 1.25, opacity: 0, duration: 0.6 }, 1.2)
      .to(k.pin, { y: -220, duration: 0.3, ease: "power2.in" }, 1.75)
      .set(k.pin, { autoAlpha: 0 }, 2.06);

    // ---------- 02 sauce ----------
    const sauce = { p: 0 };
    const moveLadle = () => {
      const pt = k.spiral.getPointAtLength(spiralLen * sauce.p);
      gsap.set(k.ladle, { x: pt.x, y: pt.y });
      k.spiral.style.strokeDashoffset = spiralLen * (1 - sauce.p);
    };
    tl.set(k.ladle, { autoAlpha: 1 }, 1.99)
      .fromTo(k.ladle, { x: 900, y: -100 }, { x: CX, y: CY, duration: 0.3, immediateRender: false }, 2.0)
      .to(sauce, { p: 1, duration: 1.3, ease: "none", onUpdate: moveLadle }, 2.3)
      .to(k.sauceBase, { opacity: 1, duration: 0.4 }, 3.3)
      .to(k.ladle, { x: 1000, y: -250, duration: 0.3, ease: "power2.in" }, 3.65)
      .set(k.ladle, { autoAlpha: 0 }, 3.96);

    // ---------- 03 cheese ----------
    tl.fromTo(k.shredEls, { y: (i, t) => t._y - 700, opacity: 1 }, { y: (i, t) => t._y, rotation: (i, t) => t._rot + 200, opacity: 1, duration: 0.5, ease: "power2.in", stagger: { each: 0.009, from: "random" }, immediateRender: false }, 4.0)
      .to(k.cheeseBase, { opacity: 1, duration: 0.5 }, 5.2)
      .to(k.shredEls, { opacity: 0.75, duration: 0.3 }, 5.5);

    // ---------- 04 toppings ----------
    tl.fromTo(k.topEls, { y: (i, t) => t._y - 90, scale: (i, t) => t._s * 2.4, opacity: 0 }, { y: (i, t) => t._y, scale: (i, t) => t._s, opacity: 1, duration: 0.4, ease: "back.out(2)", stagger: 0.026, immediateRender: false }, 6.0);

    // ---------- 05 oven ----------
    tl.to(k.board, { opacity: 0, duration: 0.3 }, 8.0)
      .set([k.ovenBack, k.ovenFront], { autoAlpha: 1 }, 7.99)
      .to([k.ovenBack, k.ovenFront], { x: 0, duration: 0.6, ease: "power3.out" }, 8.0)
      .to(k.pizza, { scaleX: 0.55, scaleY: 0.17, y: 165, duration: 0.5, ease: "power2.inOut" }, 8.45)
      .to(k.flames, { svgOrigin: "400 520", scale: 1.5, duration: 0.3 }, 8.95)
      .to(k.tArc, { strokeDashoffset: 0, duration: 0.5, ease: "none" }, 8.95)
      .to(k.baked, { opacity: 1, duration: 0.45 }, 9.0)
      .to(k.ding, { opacity: 1, scale: 1, duration: 0.2, ease: "back.out(3)" }, 9.4)
      .to(k.pizza, { scaleX: 1, scaleY: 1, y: 0, duration: 0.45, ease: "power2.inOut" }, 9.5)
      .to(k.ding, { opacity: 0, duration: 0.15 }, 9.75)
      .to(k.flames, { scale: 1, duration: 0.2 }, 9.6)
      .to([k.ovenBack, k.ovenFront], { x: -950, duration: 0.45, ease: "power3.in" }, 9.6)
      .set([k.ovenBack, k.ovenFront], { autoAlpha: 0 }, 10.06);

    // ---------- 06 slice & pack ----------
    tl.to(k.boxBottom, { opacity: 1, scale: 1, duration: 0.3 }, 10.0)
      .to(k.lidInner, { scaleY: 0.22, duration: 0.3 }, 10.05)
      .to(k.pizza, { scale: 0.94, duration: 0.3 }, 10.0)
      .to(k.steam, { opacity: 1, duration: 0.3 }, 10.2);
    k.cutEls.forEach((ln, i) => {
      const [x1, y1, x2, y2] = ln._p;
      const t0 = 10.3 + i * 0.24;
      // the pizza is scaled 0.94 around the centre, so map cut-line points into that space
      const sx = (x) => CX + (x - CX) * 0.94, sy = (y) => CY + (y - CY) * 0.94;
      tl.fromTo(k.cutter, { x: sx(x1), y: sy(y1) }, { x: sx(x2), y: sy(y2), duration: 0.22, ease: "none", immediateRender: false }, t0)
        .to(ln, { strokeDashoffset: 0, duration: 0.22, ease: "none" }, t0);
    });
    tl.set(k.cutter, { autoAlpha: 1 }, 10.29)
      .to(k.cutter, { x: 1000, y: 700, duration: 0.2, ease: "power2.in" }, 11.3)
      .set(k.cutter, { autoAlpha: 0 }, 11.51)
      .to(k.steam, { opacity: 0, duration: 0.2 }, 11.4)
      .to(k.lidInner, { scaleY: 0, duration: 0.2, ease: "power2.in" }, 11.4)
      .to(k.lidOuter, { scaleY: 1, duration: 0.25, ease: "power2.out" }, 11.6);

    // ---------- 07 rider ----------
    // rider svg is 460x300 scaled 1.05; its box centre sits at (114,103) inside it
    const riderX = CX - (460 * 1.05) / 2;
    const boxGX = riderX + 114 * 1.05, boxGY = 300 + 103 * 1.05;
    tl.set(k.riderWrap, { autoAlpha: 1 }, 11.99)
      .to(k.riderWrap, { x: riderX, duration: 0.55, ease: "power3.out" }, 12.0)
      .to(wheels, { rotation: 900, duration: 0.55, ease: "power3.out" }, 12.0)
      .to(speedLines, { opacity: 1, duration: 0.1 }, 12.0)
      .to(speedLines, { opacity: 0, duration: 0.2 }, 12.4)
      .to(k.pack, { scale: 0.6, y: -120, duration: 0.3, ease: "power2.out" }, 12.25)
      .to(k.pack, { x: boxGX - CX, y: boxGY - CY, scaleX: 0.22, scaleY: 0.17, duration: 0.35, ease: "power2.in" }, 12.55)
      .to(k.pack, { opacity: 0, duration: 0.08 }, 12.88)
      .fromTo(k.riderWrap, { y: 300 }, { y: 292, duration: 0.08, yoyo: true, repeat: 1, immediateRender: false }, 12.9)
      .to(speedLines, { opacity: 1, duration: 0.1 }, 13.15)
      .to(k.riderWrap, { x: 1200, duration: 0.8, ease: "power2.in" }, 13.15)
      .to(wheels, { rotation: 2600, duration: 0.8, ease: "power2.in" }, 13.15)
      .to({}, { duration: 0.1 }, 13.95);

    // ---------- copy panel sync ----------
    let current = 0;
    const N = steps.length;
    gsap.set(steps, { opacity: 0, y: 24 });
    gsap.set(steps[0], { opacity: 1, y: 0 });
    function setStep(idx) {
      if (idx === current) return;
      const prev = steps[current];
      gsap.to(prev, { opacity: 0, y: idx > current ? -24 : 24, duration: 0.35, overwrite: true });
      gsap.fromTo(steps[idx], { opacity: 0, y: idx > current ? 24 : -24 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.1, overwrite: true });
      prev.classList.remove("is-active");
      steps[idx].classList.add("is-active");
      current = idx;
    }

    ScrollTrigger.create({
      trigger: "#processPin",
      start: "top top",
      end: () => "+=" + window.innerHeight * 7,
      pin: true,
      scrub: 0.7,
      animation: tl,
      anticipatePin: 1,
      onUpdate(self) {
        const p = self.progress;
        const idx = Math.min(N - 1, Math.floor(p * N));
        setStep(idx);
        bar.style.width = (p * 100).toFixed(1) + "%";
        dots.forEach((d, i) => {
          d.classList.toggle("is-active", i === idx);
          d.classList.toggle("is-done", i < idx);
        });
        const fireOn = p > 8.2 / 14 && p < 9.8 / 14;
        section.classList.toggle("is-fire", fireOn);
      },
    });
  }

  window.DKProcess = { init };
})();
