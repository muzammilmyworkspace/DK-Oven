/* =========================================================
   DK's Oven — site controller
   ========================================================= */
(function () {
  const DK = window.DK;
  const { el, ingredient, miniPizza, riderSVG, skyline } = window.DKArt;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fmt = (n) => "Rs " + Math.round(n).toLocaleString("en-PK");

  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

  /* ---------------- small helpers ---------------- */
  $("#year").textContent = new Date().getFullYear();
  $$(".js-insta").forEach((a) => (a.href = DK.instagram));

  let toastT;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove("is-on"), 2200);
  }

  /* ---------------- smooth scroll ---------------- */
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  function scrollToTarget(target) {
    const node = typeof target === "string" ? $(target) : target;
    if (!node) return;
    if (lenis) lenis.scrollTo(node, { offset: 0, duration: 1.6 });
    else node.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }
  $$('a[href^="#"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      e.preventDefault();
      closeNav();
      scrollToTarget(id === "#top" ? document.body : id);
    })
  );

  /* ---------------- nav ---------------- */
  const nav = $("#nav"), burger = $("#burger");
  function closeNav() { nav.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); }
  burger.addEventListener("click", () => {
    const open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
  });
  let lastY = 0;
  ScrollTrigger.create({
    start: 0, end: "max",
    onUpdate(self) {
      const y = self.scroll();
      if (!nav.classList.contains("is-open")) nav.classList.toggle("is-hidden", y > 300 && y > lastY);
      lastY = y;
    },
  });

  /* ---------------- cursor + magnetic ---------------- */
  if (fine) {
    const c = $("#cursor");
    const qx = gsap.quickTo(c, "x", { duration: 0.35, ease: "power3" });
    const qy = gsap.quickTo(c, "y", { duration: 0.35, ease: "power3" });
    window.addEventListener("pointermove", (e) => { qx(e.clientX); qy(e.clientY); });
    document.addEventListener("pointerover", (e) => c.classList.toggle("is-hover", !!e.target.closest("a, button, [data-tilt], label")));
  }
  function magnetic(btn) {
    if (!fine) return;
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      btn.style.setProperty("--mx", x + "px");
      btn.style.setProperty("--my", y + "px");
      gsap.to(btn, { x: (x - r.width / 2) * 0.25, y: (y - r.height / 2) * 0.35, duration: 0.4, ease: "power3" });
    });
    btn.addEventListener("pointerleave", () => gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, .4)" }));
  }
  $$(".magnetic").forEach(magnetic);

  /* =========================================================
     HERO
     ========================================================= */
  $$("[data-split]").forEach((n) => {
    n.innerHTML = [...n.textContent].map((ch) => `<span class="ch">${ch}</span>`).join("");
  });

  const floaterDefs = [
    ["tomato", 4, 16, 74, 0.9], ["basil", 78, 2, 70, 0.6], ["chili", 86, 58, 80, 1.1], ["olive", 14, 78, 46, 0.7],
    ["mushroom", 66, 86, 64, 0.8], ["capsicum", -2, 46, 66, 1.2], ["cheese", 50, -4, 62, 0.5], ["jalapeno", 92, 30, 50, 0.9],
    ["pepperoni", 28, 92, 60, 1], ["tomato", 74, 70, 46, 1.3],
  ];
  const floatWrap = $("#floaters");
  const floaters = floaterDefs.map(([type, x, y, size, depth], i) => {
    const d = document.createElement("div");
    d.className = "floater";
    d.style.cssText = `left:${x}%;top:${y}%;width:${size}px;height:${size}px;`;
    const s = el("svg", { viewBox: "-30 -30 60 60" }, d);
    const g = el("g", { transform: "scale(1.15)" }, s);
    ingredient(type, g, i + 3);
    floatWrap.appendChild(d);
    d._depth = depth;
    return d;
  });
  // idle bobbing
  floaters.forEach((f, i) => {
    gsap.to(f.firstChild, { y: "random(-14, 14)", rotation: "random(-25, 25)", duration: "random(2.4, 4)", repeat: -1, yoyo: true, ease: "sine.inOut", delay: i * 0.15 });
  });
  if (fine) {
    const stage = $("#heroStage");
    window.addEventListener("pointermove", (e) => {
      const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
      floaters.forEach((f) => gsap.to(f, { x: nx * 60 * f._depth, y: ny * 60 * f._depth, duration: 1, ease: "power3", overwrite: "auto" }));
      gsap.to("#heroPizza", { rotationY: nx * 10, rotationX: -ny * 10, duration: 1, ease: "power3", transformPerspective: 900 });
      stage && gsap.to(".hero__glow", { x: nx * 40, y: ny * 40, duration: 1.4 });
    });
  }

  function heroIntro() {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.from(".hero__line--pizza .ch", { yPercent: 110, rotate: 12, opacity: 0, duration: 1, stagger: 0.06 })
      .to(".hero__line--pizza .ch", { color: "#ffc21a", duration: 0.5, stagger: 0.08, ease: "power1.inOut" }, 0.7)
      .from(".hero__line--script", { opacity: 0, x: -30, duration: 0.9 }, 0.45)
      .from(".hero__line--passion .ch", { yPercent: 120, opacity: 0, duration: 0.9, stagger: 0.045 }, 0.55)
      .from(".hero__lead, .hero__ctas, .hero__tags, .hero .eyebrow", { y: 26, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.8)
      .from(".hero__plate", { scale: 0.4, rotation: -160, opacity: 0, duration: 1.6, ease: "expo.out" }, 0.2)
      .from(".hero__ring", { scale: 0.6, opacity: 0, duration: 1.2 }, 0.5)
      .from(floaters, { scale: 0, opacity: 0, duration: 0.8, stagger: 0.05, ease: "back.out(2)" }, 0.9)
      .from(".badge-spin", { scale: 0, rotate: -90, duration: 1, ease: "back.out(1.6)" }, 1.1)
      .from(".nav", { yPercent: -150, duration: 0.9 }, 0.6)
      .from(".scroll-hint", { opacity: 0, y: 10, duration: 0.6 }, 1.4);
    return tl;
  }

  // hero scroll: pizza spins, ingredients drift apart
  gsap.to("#heroPizza", { rotation: 140, ease: "none", scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 1 } });
  gsap.to(floatWrap, { scale: 1.25, opacity: 0.2, ease: "none", scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 1 } });
  gsap.to(".hero__copy", { y: -80, opacity: 0.2, ease: "none", scrollTrigger: { trigger: "#hero", start: "30% top", end: "bottom top", scrub: 1 } });

  /* ---------------- intro word reveal ---------------- */
  (function () {
    const p = $("#introText");
    const wrapWords = (node) => {
      [...node.childNodes].forEach((ch) => {
        if (ch.nodeType === 3) {
          const frag = document.createDocumentFragment();
          ch.textContent.split(/(\s+)/).forEach((w) => {
            if (!w) return;
            if (/^\s+$/.test(w)) frag.appendChild(document.createTextNode(w));
            else { const s = document.createElement("span"); s.className = "w"; s.textContent = w; frag.appendChild(s); }
          });
          ch.replaceWith(frag);
        } else if (ch.nodeType === 1) wrapWords(ch);
      });
    };
    wrapWords(p);
    gsap.to($$(".w", p), { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: p, start: "top 78%", end: "bottom 50%", scrub: 1 } });
  })();

  /* ---------------- process story ---------------- */
  window.DKProcess.init();

  /* =========================================================
     CRAVE
     ========================================================= */
  gsap.to("#cravePhoto", { clipPath: "inset(0% 0% 0% 0% round 34px)", ease: "none", scrollTrigger: { trigger: "#cravePhoto", start: "top 90%", end: "top 25%", scrub: 1 } });
  gsap.to(".crave__photo", { scale: 1, ease: "none", scrollTrigger: { trigger: "#cravePhoto", start: "top bottom", end: "bottom top", scrub: 1 } });
  gsap.to(".callout", { opacity: 1, y: 0, startAt: { y: 20 }, stagger: 0.25, duration: 0.8, ease: "back.out(2)", scrollTrigger: { trigger: "#cravePhoto", start: "top 40%", toggleActions: "play none none reverse" } });
  gsap.from(".crave__copy > *", { y: 40, opacity: 0, stagger: 0.12, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".crave__copy", start: "top 80%" } });

  // horizontal gallery
  (function () {
    const track = $("#hTrack");
    const fill = $("#hungerFill"), pct = $("#hungerPct");
    const dist = () => Math.max(0, track.scrollWidth - innerWidth);
    gsap.to(track, {
      x: () => -dist(),
      ease: "none",
      scrollTrigger: {
        trigger: "#hgallery", start: "top top", end: () => "+=" + dist(), pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate(self) {
          const v = Math.round(12 + self.progress * 88);
          fill.style.width = v + "%";
          pct.textContent = v >= 100 ? "100%!" : v + "%";
        },
      },
    });
    // 3D tilt
    if (fine) $$("[data-tilt]").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, { rotationY: x * 12, rotationX: -y * 12, transformPerspective: 900, duration: 0.5, ease: "power3" });
      });
      card.addEventListener("pointerleave", () => gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.8, ease: "elastic.out(1,.5)" }));
    });
  })();

  /* =========================================================
     MENU + CART
     ========================================================= */
  const sizeKeys = Object.keys(DK.sizes);
  let size = "small";
  const grid = $("#menuGrid");

  DK.pizzas.forEach((p, i) => {
    const card = document.createElement("article");
    card.className = "mcard";
    card.innerHTML = `
      <div class="mcard__top">
        <div class="mcard__pzwrap"></div>
        <div><h3>${p.name}</h3>${p.tag ? `<span class="mcard__tag">${p.tag}</span>` : ""}</div>
      </div>
      <ul class="mcard__ing">${p.ing.map((x) => `<li>${x}</li>`).join("")}</ul>
      <div class="mcard__foot">
        <span class="price"><small>RS</small><span class="js-price" data-i="${i}">${p.price[0]}</span></span>
        <button class="add" data-add="pizza" data-i="${i}" aria-label="Add ${p.name} to order">
          <svg viewBox="0 0 16 16"><path d="M8 3v10M3 8h10"/></svg><span>Add</span>
        </button>
      </div>`;
    card.querySelector(".mcard__pzwrap").replaceWith(miniPizza(p.top, i * 13 + 5));
    grid.appendChild(card);
  });

  DK.specials.forEach((s, i) => {
    const c = document.createElement("article");
    c.className = "scard";
    c.innerHTML = `<img src="${s.img}" alt="${s.name} pizza" loading="lazy" /><span class="scard__badge">${s.badge}</span>
      <h4>${s.name}</h4><p>${s.desc}</p>
      <button class="add" data-add="special" data-i="${i}"><svg viewBox="0 0 16 16"><path d="M8 3v10M3 8h10"/></svg><span>Add · price on order</span></button>`;
    $("#specialsGrid").appendChild(c);
  });

  DK.drinks.forEach((d, i) => {
    const c = document.createElement("div");
    c.className = "dchip";
    c.innerHTML = `<span class="dchip__can" style="background:${d.color}"></span><b>${d.name}</b>
      <button class="add" data-add="drink" data-i="${i}" aria-label="Add ${d.name}"><svg viewBox="0 0 16 16"><path d="M8 3v10M3 8h10"/></svg></button>`;
    $("#drinksList").appendChild(c);
  });

  // menu entrance
  gsap.from(".mcard", { y: 60, opacity: 0, rotate: () => gsap.utils.random(-4, 4), duration: 0.9, ease: "power3.out", stagger: { each: 0.05, grid: "auto" }, scrollTrigger: { trigger: grid, start: "top 85%" } });
  gsap.from(".scard", { y: 60, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, scrollTrigger: { trigger: "#specialsGrid", start: "top 85%" } });
  gsap.from(".menu__head > *", { y: 40, opacity: 0, duration: 1, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: ".menu__head", start: "top 85%" } });

  // size tabs
  const tabs = $$("#sizeTabs button"), pill = $("#sizePill");
  function placePill(btn) {
    pill.style.width = btn.offsetWidth + "px";
    pill.style.transform = `translateX(${btn.offsetLeft - 6}px)`;
  }
  tabs.forEach((b) =>
    b.addEventListener("click", () => {
      tabs.forEach((t) => t.setAttribute("aria-selected", String(t === b)));
      placePill(b);
      size = b.dataset.size;
      const k = DK.sizes[size].key;
      $$(".js-price").forEach((n) => {
        const target = DK.pizzas[+n.dataset.i].price[k];
        const o = { v: +n.textContent.replace(/\D/g, "") };
        gsap.to(o, { v: target, duration: 0.6, ease: "power2.out", onUpdate: () => (n.textContent = Math.round(o.v)) });
      });
      gsap.fromTo(".mcard__pz", { rotate: 0 }, { rotate: 360, duration: 0.8, ease: "power3.out" });
    })
  );
  requestAnimationFrame(() => placePill(tabs[0]));
  window.addEventListener("resize", () => placePill(tabs.find((t) => t.getAttribute("aria-selected") === "true")));

  // cart state
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem("dk-cart") || "[]"); } catch (e) { cart = []; }
  const save = () => { try { localStorage.setItem("dk-cart", JSON.stringify(cart)); } catch (e) {} };

  function addItem(kind, i, sz = size, qty = 1) {
    let item;
    if (kind === "pizza") {
      const p = DK.pizzas[i];
      item = { id: p.name + "|" + sz, name: p.name, note: DK.sizes[sz].label, price: p.price[DK.sizes[sz].key] };
    } else if (kind === "special") {
      const s = DK.specials[i];
      item = { id: s.name, name: s.name, note: "Signature crust", price: null };
    } else {
      const d = DK.drinks[i];
      item = { id: d.name, name: d.name, note: "Cold drink", price: null };
    }
    const ex = cart.find((c) => c.id === item.id);
    if (ex) ex.qty += qty;
    else cart.push({ ...item, qty });
    save();
    renderCart();
    toast(`${qty > 1 ? qty + " × " : ""}${item.name}${kind === "pizza" ? " (" + item.note + ")" : ""} added 🍕`);
  }

  function totals() {
    return cart.reduce((a, c) => ({ n: a.n + c.qty, t: a.t + (c.price || 0) * c.qty }), { n: 0, t: 0 });
  }

  function renderCart() {
    const { n, t } = totals();
    $("#cartCount").textContent = n;
    $("#cartBtnTotal").textContent = fmt(t);
    $("#cartTotal").textContent = fmt(t);
    $("#cartBtn").classList.toggle("is-visible", n > 0);
    $("#formTotal").textContent = fmt(t);
    const list = $("#cartItems"), flist = $("#formItems");
    if (!cart.length) {
      list.innerHTML = `<div class="drawer__empty">Abhi tak kuch add nahi kiya.<br/>Menu se apna favourite chuno!</div>`;
      flist.innerHTML = `<div class="oform__empty">Your order is empty. Pick an item above or add from the menu.</div>`;
      return;
    }
    $("#itemsErr").classList.remove("is-on");
    list.innerHTML = flist.innerHTML = cart.map((c, idx) => `
      <div class="citem">
        <b>${c.name}</b>
        <div class="citem__qty"><button data-q="-1" data-idx="${idx}" aria-label="Less">−</button><span>${c.qty}</span><button data-q="1" data-idx="${idx}" aria-label="More">+</button></div>
        <small>${c.note} · ${c.price ? fmt(c.price * c.qty) : "price on order"}</small>
      </div>`).join("");
  }

  function flyToCart(fromEl) {
    const btn = $("#cartBtn");
    const a = fromEl.getBoundingClientRect();
    const dot = document.createElement("div");
    dot.style.cssText = `position:fixed;z-index:400;left:${a.left + a.width / 2 - 22}px;top:${a.top + a.height / 2 - 22}px;width:44px;height:44px;pointer-events:none`;
    dot.appendChild(miniPizza(["tikka", "olive", "capsicum"], 9));
    dot.firstChild.style.cssText = "width:100%;height:100%";
    document.body.appendChild(dot);
    // the cart button may be hidden below the fold the first time; aim at its resting place
    const tx = 18 + 30 - (a.left + a.width / 2);
    const ty = innerHeight - 18 - 26 - (a.top + a.height / 2);
    gsap.timeline({ onComplete: () => { dot.remove(); btn.classList.remove("bump"); void btn.offsetWidth; btn.classList.add("bump"); } })
      .to(dot, { x: tx * 0.5, y: Math.min(ty * 0.5, -120) + ty * 0.1, rotation: 200, scale: 1.3, duration: 0.35, ease: "power2.out" })
      .to(dot, { x: tx, y: ty, rotation: 400, scale: 0.4, duration: 0.45, ease: "power2.in" });
  }

  document.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    if (add) {
      addItem(add.dataset.add, +add.dataset.i);
      if (!reduce) flyToCart(add);
      add.classList.add("is-added");
      setTimeout(() => add.classList.remove("is-added"), 900);
      return;
    }
    const q = e.target.closest("[data-q]");
    if (q) {
      const it = cart[+q.dataset.idx];
      it.qty += +q.dataset.q;
      if (it.qty <= 0) cart.splice(+q.dataset.idx, 1);
      save();
      renderCart();
    }
  });

  const drawer = $("#drawer");
  function openDrawer() { drawer.classList.add("is-open"); drawer.setAttribute("aria-hidden", "false"); lenis && lenis.stop(); setTimeout(() => $(".drawer__x").focus(), 300); }
  function closeDrawer() { drawer.classList.remove("is-open"); drawer.setAttribute("aria-hidden", "true"); lenis && lenis.start(); }
  $("#cartBtn").addEventListener("click", openDrawer);
  $$("[data-close]", drawer).forEach((b) => b.addEventListener("click", closeDrawer));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeDrawer(); closeNav(); } });

  $("[data-checkout]").addEventListener("click", () => {
    closeDrawer();
    setTimeout(() => scrollToTarget("#order-form"), 250);
  });

  /* ---------------- order form ---------------- */
  const form = $("#orderForm");
  const pickItem = $("#pickItem"), pickSize = $("#pickSize"), pickQty = $("#pickQty"), pickAdd = $("#pickAdd");
  pickItem.innerHTML =
    `<optgroup label="Pizza Flavors">${DK.pizzas.map((p, i) => `<option value="pizza:${i}">${p.name}</option>`).join("")}</optgroup>` +
    `<optgroup label="Signature Crusts">${DK.specials.map((p, i) => `<option value="special:${i}">${p.name}</option>`).join("")}</optgroup>` +
    `<optgroup label="Cold Drinks">${DK.drinks.map((p, i) => `<option value="drink:${i}">${p.name}</option>`).join("")}</optgroup>`;
  pickSize.innerHTML = sizeKeys.map((k) => `<option value="${k}">${DK.sizes[k].label}</option>`).join("");
  let pq = 1;
  function syncPicker() {
    const [kind, i] = pickItem.value.split(":");
    const isPizza = kind === "pizza";
    pickSize.disabled = !isPizza;
    pickSize.closest(".field").classList.toggle("is-disabled", !isPizza);
    pickQty.textContent = pq;
    const price = isPizza ? DK.pizzas[+i].price[DK.sizes[pickSize.value].key] * pq : null;
    pickAdd.querySelector("span").textContent = price ? `Add · ${fmt(price)}` : "Add";
  }
  pickItem.addEventListener("change", syncPicker);
  pickSize.addEventListener("change", syncPicker);
  $$("[data-pq]").forEach((b) => b.addEventListener("click", () => { pq = Math.max(1, Math.min(20, pq + +b.dataset.pq)); syncPicker(); }));
  pickAdd.addEventListener("click", () => {
    const [kind, i] = pickItem.value.split(":");
    addItem(kind, +i, pickSize.value, pq);
    pq = 1;
    syncPicker();
  });
  syncPicker();

  // remember the customer's details for next time (this browser only)
  const FIELDS = ["name", "phone", "email", "area", "address", "payment"];
  try {
    const saved = JSON.parse(localStorage.getItem("dk-customer") || "{}");
    FIELDS.forEach((k) => { if (saved[k] && form.elements[k]) form.elements[k].value = saved[k]; });
  } catch (e) {}

  const isDelivery = () => form.elements.otype.value === "Delivery";
  function syncType() { $$(".js-delivery", form).forEach((n) => (n.hidden = !isDelivery())); }
  $$('input[name="otype"]', form).forEach((r) => r.addEventListener("change", syncType));
  syncType();

  const phoneOk = (v) => /^(\+92|0092|92|0)?3\d{9}$/.test(v.replace(/[\s-]/g, ""));
  const emailOk = (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  function setErr(name, bad) {
    form.elements[name].closest(".field").classList.toggle("is-invalid", bad);
    return bad;
  }
  ["name", "phone", "email", "address"].forEach((n) =>
    form.elements[n].addEventListener("input", () => form.elements[n].closest(".field").classList.remove("is-invalid"))
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = (k) => (form.elements[k].value || "").trim();
    const errs = [
      setErr("name", v("name").length < 2),
      setErr("phone", !phoneOk(v("phone"))),
      setErr("email", !emailOk(v("email"))),
      setErr("address", isDelivery() && v("address").length < 5),
    ];
    const noItems = !cart.length;
    $("#itemsErr").classList.toggle("is-on", noItems);
    if (noItems || errs.some(Boolean)) {
      const first = noItems ? $("#formItems") : form.querySelector(".is-invalid");
      if (first) scrollToTarget(first.closest(".oform__col") || first);
      toast(noItems ? "Pehle kam az kam ek item add karein 🍕" : "Kuch fields check karein ✋");
      return;
    }
    try { localStorage.setItem("dk-customer", JSON.stringify(Object.fromEntries(FIELDS.map((k) => [k, v(k)])))); } catch (err) {}

    const { t } = totals();
    const bar = "━━━━━━━━━━━━━━";
    const msg = [
      "🛒 *NEW ORDER*  ·  DK's Oven 🍕",
      bar,
      "*Order:*",
      ...cart.map((c) => `• ${c.qty} × ${c.name} (${c.note})${c.price ? " = " + fmt(c.price * c.qty) : " · price on order"}`),
      "",
      `*Estimated total:* ${fmt(t)}${cart.some((c) => !c.price) ? " + items priced on order" : ""}`,
      bar,
      "*Customer details:*",
      `👤 Name: ${v("name")}`,
      `📞 Contact: ${v("phone")}`,
      v("email") ? `✉️ Email: ${v("email")}` : null,
      `🛵 Order type: ${form.elements.otype.value}`,
      isDelivery() ? `📍 Area: ${v("area")}` : null,
      isDelivery() ? `🏠 Address: ${v("address")}` : null,
      `⏰ When: ${v("time")}`,
      `💳 Payment: ${v("payment")}`,
      v("notes") ? `📝 Notes: ${v("notes")}` : null,
      bar,
      "Sent from the DK's Oven website",
    ].filter((x) => x !== null).join("\n");

    const url = `https://wa.me/${DK.phone}?text=${encodeURIComponent(msg)}`;
    $("#waRetry").href = url;
    const w = window.open(url, "_blank", "noopener");
    if (!w) location.href = url; // popup blocked: open in this tab instead
    form.hidden = true;
    $("#orderDone").hidden = false;
    gsap.from("#orderDone", { y: 30, opacity: 0, scale: 0.96, duration: 0.7, ease: "back.out(1.6)" });
    ScrollTrigger.refresh();
    scrollToTarget("#order-form");
  });

  $("#newOrder").addEventListener("click", () => {
    cart = [];
    save();
    renderCart();
    form.elements.notes.value = "";
    $("#orderDone").hidden = true;
    form.hidden = false;
    ScrollTrigger.refresh();
  });

  gsap.from(".oform__head > *, .oform__card", { y: 50, opacity: 0, stagger: 0.1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: "#order-form", start: "top 75%" } });

  /* ---------------- quick order (intro section) ---------------- */
  (function () {
    const qf = $("#quickForm");
    const qItem = $("#qItem"), qSize = $("#qSize"), qQty = $("#qQty"), qTotal = $("#qTotal");
    qItem.innerHTML = DK.pizzas.map((p, i) => `<option value="${i}">${p.name}</option>`).join("");
    qSize.innerHTML = sizeKeys.map((k) => `<option value="${k}">${DK.sizes[k].label}</option>`).join("");
    let qq = 1;
    const price = () => DK.pizzas[+qItem.value].price[DK.sizes[qSize.value].key] * qq;
    const sync = () => { qQty.textContent = qq; qTotal.textContent = fmt(price()); };
    qItem.addEventListener("change", sync);
    qSize.addEventListener("change", sync);
    $$("[data-qq]", qf).forEach((b) => b.addEventListener("click", () => { qq = Math.max(1, Math.min(20, qq + +b.dataset.qq)); sync(); }));
    sync();

    try {
      const saved = JSON.parse(localStorage.getItem("dk-customer") || "{}");
      ["name", "phone", "address"].forEach((k) => { if (saved[k]) qf.elements[k].value = saved[k]; });
    } catch (e) {}

    const mark = (name, bad) => { qf.elements[name].closest(".field").classList.toggle("is-invalid", bad); return bad; };
    ["name", "phone", "address"].forEach((n) => qf.elements[n].addEventListener("input", () => mark(n, false)));

    qf.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = (k) => (qf.elements[k].value || "").trim();
      const bad = [mark("name", v("name").length < 2), mark("phone", !phoneOk(v("phone"))), mark("address", v("address").length < 4)];
      if (bad.some(Boolean)) { toast("Kuch fields check karein ✋"); return; }
      try {
        const saved = JSON.parse(localStorage.getItem("dk-customer") || "{}");
        localStorage.setItem("dk-customer", JSON.stringify({ ...saved, name: v("name"), phone: v("phone"), address: v("address") }));
      } catch (err) {}
      const p = DK.pizzas[+qItem.value];
      const bar = "━━━━━━━━━━━━━━";
      const msg = [
        "⚡ *NEW QUICK ORDER*  ·  DK's Oven 🍕",
        bar,
        `• ${qq} × ${p.name} (${DK.sizes[qSize.value].label}) = ${fmt(price())}`,
        "",
        `*Estimated total:* ${fmt(price())}`,
        bar,
        `👤 Name: ${v("name")}`,
        `📞 Contact: ${v("phone")}`,
        `🏠 Address: ${v("address")}`,
        bar,
        "Sent from the DK's Oven website",
      ].join("\n");
      const url = `https://wa.me/${DK.phone}?text=${encodeURIComponent(msg)}`;
      const w = window.open(url, "_blank", "noopener");
      if (!w) location.href = url;
      toast("WhatsApp khul gaya. Bas Send dabayein ✅");
    });

    gsap.from(qf, { x: 60, opacity: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: "#intro", start: "top 75%" } });
  })();

  /* ---------------- Google reviews ---------------- */
  (function () {
    const fallback = "https://www.google.com/search?q=" + encodeURIComponent("DK's Oven Wah Cantt reviews");
    $("#gAll").href = DK.googleReviewsUrl || fallback;
    $("#gWrite").href = DK.googleWriteReviewUrl || DK.googleReviewsUrl || fallback;
    const stars = (n) => `<span class="stars" style="--r:${(Math.max(0, Math.min(5, n)) / 5) * 100}%" aria-label="${n} out of 5 stars">★★★★★</span>`;
    if (DK.googleRating) {
      $("#gRating").innerHTML = `<strong>${(+DK.googleRating).toFixed(1)}</strong>${stars(+DK.googleRating)}${DK.googleReviewCount ? `<span>${DK.googleReviewCount} reviews</span>` : ""}`;
    }
    const track = $("#reviewsTrack");
    const esc = (x) => String(x || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    if (!DK.reviews.length) {
      track.innerHTML = `
        <div class="rv-empty">
          <div class="rv-empty__ic">★</div>
          <div><h3>Aap ka review hamari taaqat hai</h3>
          <p>Enjoyed your DK's pizza? Leave us a quick review on Google. It helps more people in Wah Cantt find real, passion-made pizza.</p></div>
          <a href="${$("#gWrite").href}" target="_blank" rel="noopener" class="btn btn--red">Review us on Google</a>
        </div>`;
      return;
    }
    const cols = ["#e0261b", "#8a1a12", "#e9a440", "#3d8b3d", "#1976d2", "#6a3a26"];
    const g = $(".gcard__g").outerHTML.replace('class="gcard__g"', 'class="rv__g"');
    track.innerHTML = DK.reviews.map((r, i) => `
      <figure class="rv">
        <div class="rv__top">
          <span class="rv__av" style="background:${cols[i % cols.length]}">${esc(r.name).charAt(0).toUpperCase()}</span>
          <div><b>${esc(r.name)}</b><small>${esc(r.date)}</small></div>
          ${g}
        </div>
        ${stars(+r.rating || 5)}
        <blockquote>${esc(r.text)}</blockquote>
      </figure>`).join("");
    gsap.from(".rv", { y: 40, opacity: 0, stagger: 0.08, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: track, start: "top 85%" } });
  })();
  gsap.from(".reviews__head > *", { y: 40, opacity: 0, stagger: 0.12, duration: 1, ease: "power3.out", scrollTrigger: { trigger: "#reviews", start: "top 80%" } });

  renderCart();

  /* =========================================================
     ROAD — rider racing through the city
     ========================================================= */
  (function () {
    skyline($("#skyFar"), "far");
    skyline($("#skyNear"), "near");
    const rider = $("#rider");
    rider.appendChild(riderSVG());
    const wheels = $$(".spokes", rider);
    const st = {
      trigger: "#road", start: "top top", end: () => "+=" + innerHeight * 1.6, pin: true, scrub: 0.6, anticipatePin: 1,
    };
    const tl = gsap.timeline({ scrollTrigger: st, defaults: { ease: "none" } });
    tl.to("#skyFar", { xPercent: -16.66 }, 0)
      .to("#skyNear", { xPercent: -33.33 }, 0)
      .to("#roadLines", { xPercent: -50 }, 0)
      .to("#roadSigns", { x: () => -($("#roadSigns").scrollWidth + innerWidth * 0.2) }, 0)
      .to(wheels, { rotation: 3600 }, 0)
      .fromTo(rider, { xPercent: -120 }, { xPercent: 20 }, 0)
      .fromTo(".road__sun", { y: 40 }, { y: -40 }, 0)
      .from(".road__title", { y: 60, opacity: 0, duration: 0.15 }, 0);
    // continuous bounce + puffs
    gsap.to(".rider .rider__bike", { y: -5, duration: 0.18, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".rider .rider__man", { y: -3, rotation: -1.5, transformOrigin: "50% 100%", duration: 0.36, repeat: -1, yoyo: true, ease: "sine.inOut" });
    $$(".rider .puff").forEach((p, i) => gsap.fromTo(p, { x: 0, scale: 0.4, opacity: 0.9 }, { x: -90, y: -20, scale: 1.6, opacity: 0, duration: 1, repeat: -1, delay: i * 0.33, ease: "power1.out", transformOrigin: "50% 50%" }));
    $$(".rider .rider__speed line").forEach((l, i) => gsap.fromTo(l, { x: 40, opacity: 0 }, { x: -80, opacity: 1, duration: 0.5, repeat: -1, delay: i * 0.12, ease: "none" }));
  })();

  /* =========================================================
     MAP — rider tours Wah Cantt, New City, Taxila, Hassan Abdal
     ========================================================= */
  (function () {
    const svg = $("#mapSvg");
    const P = { wah: [450, 320], newcity: [315, 535], taxila: [735, 435], hassan: [165, 150] };
    const names = { wah: "WAH CANTT", newcity: "NEW CITY", taxila: "TAXILA", hassan: "HASSAN ABDAL" };
    const defs = el("defs", null, svg);
    defs.innerHTML = `
      <pattern id="mGrid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="rgba(255,194,26,.06)" stroke-width="1"/></pattern>
      <radialGradient id="mGlow"><stop offset="0" stop-color="#ff7a1f" stop-opacity=".45"/><stop offset="1" stop-color="#ff7a1f" stop-opacity="0"/></radialGradient>
      <filter id="mShadow"><feDropShadow dx="0" dy="6" stdDeviation="6" flood-opacity=".5"/></filter>
      <filter id="mNeon"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
    el("rect", { x: 0, y: 0, width: 900, height: 700, rx: 36, fill: "#1f100a" }, svg);
    el("rect", { x: 0, y: 0, width: 900, height: 700, rx: 36, fill: "url(#mGrid)" }, svg);
    // terrain
    el("path", { d: "M0 0 H420 C380 60 300 80 240 60 C160 30 90 90 0 120 Z", fill: "#2b3a1c", opacity: 0.55 }, svg);
    el("path", { d: "M560 0 H900 V180 C830 150 780 90 700 80 C640 70 590 40 560 0 Z", fill: "#2b3a1c", opacity: 0.45 }, svg);
    el("path", { d: "M0 560 C100 520 160 600 240 640 L240 700 H0 Z", fill: "#2b3a1c", opacity: 0.4 }, svg);
    el("path", { d: "M600 700 C640 620 760 600 900 620 V700 Z", fill: "#2b3a1c", opacity: 0.35 }, svg);
    const hills = el("text", { x: 720, y: 60, fill: "rgba(255,244,220,.25)", "font-size": 14, "font-family": "Bricolage Grotesque, sans-serif", "letter-spacing": 4 }, svg);
    hills.textContent = "MARGALLA HILLS ↗";
    el("ellipse", { cx: P.wah[0], cy: P.wah[1], rx: 260, ry: 200, fill: "url(#mGlow)" }, svg);

    // minor streets
    const minor = el("g", { stroke: "#3a2116", "stroke-width": 3, fill: "none", "stroke-linecap": "round" }, svg);
    ["M380 260 L520 300 L560 380", "M400 380 L470 260", "M340 300 L420 400", "M500 380 L600 360", "M260 500 L360 560 L420 520", "M690 400 L780 470 M700 470 L770 410", "M140 120 L200 190 M120 180 L210 130", "M520 240 L600 200", "M300 420 L240 380"].forEach((d) => el("path", { d }, minor));

    // main roads
    const gt = "M30 70 C120 110 140 140 165 150 C260 200 360 280 450 320 C560 370 650 400 735 435 C790 458 840 470 900 480";
    const r2 = "M450 320 C430 400 370 470 315 535 C290 565 270 610 250 700";
    const r3 = "M315 535 C440 560 620 520 735 435";
    [[gt, 18], [r2, 12], [r3, 12]].forEach(([d, w]) => {
      el("path", { d, stroke: "#4a2c1e", "stroke-width": w + 8, fill: "none", "stroke-linecap": "round" }, svg);
      el("path", { d, stroke: "#6a4330", "stroke-width": w, fill: "none", "stroke-linecap": "round" }, svg);
    });
    el("path", { d: gt, stroke: "rgba(255,194,26,.55)", "stroke-width": 2, "stroke-dasharray": "14 12", fill: "none" }, svg);
    const gtl = el("text", { "font-size": 13, fill: "rgba(255,244,220,.45)", "font-family": "Bricolage Grotesque, sans-serif", "letter-spacing": 3 }, svg);
    gtl.innerHTML = `<textPath href="#gtPath" startOffset="62%">G.T. ROAD</textPath>`;
    el("path", { id: "gtPath", d: "M450 300 C560 350 650 380 735 415", fill: "none" }, defs);

    // route the rider takes
    const routeD = "M450 320 C430 400 370 470 315 535 C440 560 620 520 735 435 C650 400 560 370 450 320 C360 280 260 200 165 150 C230 250 360 350 450 320";
    el("path", { d: routeD, stroke: "rgba(255,194,26,.3)", "stroke-width": 3, "stroke-dasharray": "2 12", "stroke-linecap": "round", fill: "none" }, svg);
    const trail = el("path", { d: routeD, stroke: "#ffc21a", "stroke-width": 6, fill: "none", "stroke-linecap": "round", filter: "url(#mNeon)" }, svg);
    const route = el("path", { id: "mapRoute", d: routeD, fill: "none", stroke: "none" }, svg);
    const len = route.getTotalLength();
    trail.style.strokeDasharray = len;
    trail.style.strokeDashoffset = len;

    // places
    const pins = {};
    Object.entries(P).forEach(([key, [x, y]]) => {
      const g = el("g", { class: "mplace", transform: `translate(${x} ${y})` }, svg);
      if (key === "wah") {
        el("circle", { r: 54, fill: "none", stroke: "#ffc21a", "stroke-width": 2, class: "mring" }, g);
        el("circle", { r: 54, fill: "none", stroke: "#ffc21a", "stroke-width": 2, class: "mring mring--2" }, g);
        el("circle", { r: 44, fill: "#fff", filter: "url(#mShadow)" }, g);
        el("image", { href: "assets/img/logo.png", x: -42, y: -42, width: 84, height: 84 }, g);
        const t = el("text", { y: 76, "text-anchor": "middle", "font-family": "Bungee, sans-serif", "font-size": 20, fill: "#fff4dc" }, g);
        t.textContent = names[key];
        const s = el("text", { y: 96, "text-anchor": "middle", "font-family": "Bricolage Grotesque, sans-serif", "font-size": 13, fill: "#ffc21a", "letter-spacing": 2 }, g);
        s.textContent = "DK'S OVEN HQ";
      } else {
        const pin = el("g", { class: "mpin" }, g);
        el("path", { d: "M0 0 C-16 -18 -22 -28 -22 -38 A22 22 0 0 1 22 -38 C22 -28 16 -18 0 0 Z", fill: "#3a2116", stroke: "#ffc21a", "stroke-width": 3, filter: "url(#mShadow)" }, pin);
        el("circle", { cy: -38, r: 8, fill: "#ffc21a" }, pin);
        const t = el("text", { y: 24, "text-anchor": "middle", "font-family": "Bungee, sans-serif", "font-size": 18, fill: "#fff4dc" }, g);
        t.textContent = names[key];
        pins[key] = pin;
      }
    });

    // compass
    const comp = el("g", { transform: "translate(830 630)", opacity: 0.6 }, svg);
    el("circle", { r: 30, fill: "none", stroke: "#fff4dc", "stroke-width": 1.5 }, comp);
    el("path", { d: "M0 -26 L7 0 L0 26 L-7 0 Z", fill: "#fff4dc" }, comp);
    el("path", { d: "M0 -26 L7 0 L-7 0 Z", fill: "#e0261b" }, comp);
    const n = el("text", { y: -36, "text-anchor": "middle", fill: "#fff4dc", "font-size": 13, "font-family": "Bungee, sans-serif" }, comp);
    n.textContent = "N";

    // rider marker
    const marker = el("g", { id: "mapRider" }, svg);
    el("circle", { r: 34, fill: "rgba(255,194,26,.25)", class: "mring" }, marker);
    el("circle", { r: 26, fill: "#ffc21a", stroke: "#1a0d08", "stroke-width": 4, filter: "url(#mShadow)" }, marker);
    const ic = el("g", { transform: "translate(-17 -13) scale(.075)" }, marker);
    // reuse the full rider illustration, tiny
    const mini = riderSVG({ speedColor: "transparent", puffColor: "transparent" });
    mini.setAttribute("width", 460); mini.setAttribute("height", 300); mini.setAttribute("overflow", "visible");
    ic.appendChild(mini);

    // checkpoint fractions along the route
    const fr = { wah: 0 };
    ["newcity", "taxila", "hassan"].forEach((k) => {
      let best = 1e9, at = 0;
      for (let i = 0; i <= 400; i++) {
        const pt = route.getPointAtLength((len * i) / 400);
        const d = Math.hypot(pt.x - P[k][0], pt.y - P[k][1]);
        if (d < best) { best = d; at = i / 400; }
      }
      fr[k] = at;
    });

    const zones = $$("#zones li");
    const toastEl = $("#mapToast"), toastTxt = toastEl.querySelector("span");
    let lastHit = "wah";
    const tl = gsap.timeline({ defaults: { ease: "none" } });
    tl.to(marker, { motionPath: { path: route, align: route, alignOrigin: [0.5, 0.5] }, duration: 1 }, 0)
      .to(trail, { strokeDashoffset: 0, duration: 1 }, 0);

    ScrollTrigger.create({
      trigger: "#mapPin", start: "top top", end: () => "+=" + innerHeight * 2.6, pin: true, scrub: 0.8, animation: tl, anticipatePin: 1,
      onUpdate(self) {
        const p = self.progress;
        zones.forEach((z) => z.classList.toggle("is-on", p + 0.005 >= fr[z.dataset.zone]));
        // which checkpoint did we just pass?
        let hit = "wah";
        ["newcity", "taxila", "hassan"].forEach((k) => { if (p >= fr[k]) hit = k; });
        if (p > 0.97) hit = "home";
        if (hit !== lastHit) {
          lastHit = hit;
          if (hit !== "wah") {
            toastTxt.textContent = hit === "home" ? "Back to the oven for the next order!" : `Hot pizza delivered in ${names[hit].replace(/\b\w+/g, (w) => w[0] + w.slice(1).toLowerCase())}!`;
            gsap.fromTo(toastEl, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.4, ease: "back.out(2)", overwrite: true });
            gsap.to(toastEl, { opacity: 0, y: -10, duration: 0.4, delay: 1.8 });
            if (pins[hit]) gsap.fromTo(pins[hit], { scale: 1 }, { scale: 1.35, duration: 0.25, yoyo: true, repeat: 1, transformOrigin: "50% 100%" });
          }
        }
      },
    });
    gsap.from(".map__copy > *", { y: 30, opacity: 0, stagger: 0.08, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: "#mapPin", start: "top 70%" } });
  })();

  /* =========================================================
     DANISH + PROMISES + ORDER
     ========================================================= */
  gsap.from("#danishBadge", { scale: 0.7, rotate: -20, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: "#danish", start: "top 70%" } });
  gsap.from(".danish__hat", { y: -120, rotate: -60, opacity: 0, duration: 1.2, delay: 0.4, ease: "bounce.out", scrollTrigger: { trigger: "#danish", start: "top 70%" } });
  gsap.from(".danish__copy > *", { y: 40, opacity: 0, stagger: 0.1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".danish__copy", start: "top 80%" } });
  gsap.from(".danish__sign", { clipPath: "inset(0 100% 0 0)", duration: 1.6, ease: "power2.inOut", scrollTrigger: { trigger: ".danish__sign", start: "top 90%" } });
  gsap.from(".promise", { y: 60, opacity: 0, stagger: 0.1, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: ".promises", start: "top 85%" } });
  gsap.from(".order__inner > *", { y: 50, opacity: 0, stagger: 0.1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: "#order", start: "top 70%" } });

  /* =========================================================
     PRELOADER
     ========================================================= */
  (function () {
    document.body.classList.add("is-loading");
    const imgs = $$("img").filter((i) => i.loading !== "lazy");
    let done = 0;
    const total = imgs.length + 1; // + fonts
    const state = { v: 0 };
    const bar = $("#loaderBar"), pct = $("#loaderPct");
    const bump = () => {
      done++;
      gsap.to(state, { v: (done / total) * 100, duration: 0.5, ease: "power2.out", onUpdate: () => { bar.style.width = state.v + "%"; pct.textContent = Math.round(state.v); } });
      if (done >= total) finish();
    };
    imgs.forEach((i) => (i.complete ? bump() : (i.addEventListener("load", bump, { once: true }), i.addEventListener("error", bump, { once: true }))));
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(bump);
    const failSafe = setTimeout(finish, 6000);
    let finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      clearTimeout(failSafe);
      const wait = Math.max(0, 1400 - performance.now());
      gsap.timeline({ delay: wait / 1000 + 0.35 })
        .to(state, { v: 100, duration: 0.3, onUpdate: () => { bar.style.width = state.v + "%"; pct.textContent = Math.round(state.v); } })
        .to(".loader__curtain--red", { y: "0%", duration: 0.6, ease: "power4.inOut" })
        .to(".loader__curtain--yellow", { y: "0%", duration: 0.6, ease: "power4.inOut" }, "-=0.45")
        .set(".loader__inner", { opacity: 0 })
        .set("#loader", { background: "transparent" })
        .to(".loader__curtain--yellow", { y: "-100%", duration: 0.7, ease: "power4.inOut" })
        .to(".loader__curtain--red", { y: "-100%", duration: 0.7, ease: "power4.inOut" }, "-=0.55")
        .add(() => {
          document.body.classList.remove("is-loading");
          lenis && lenis.start();
          ScrollTrigger.refresh();
        }, "-=0.5")
        .add(heroIntro(), "-=0.7")
        .set("#loader", { display: "none" });
    }
  })();

  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
