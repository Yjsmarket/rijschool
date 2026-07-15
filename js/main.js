/* ============================================================
   Rijschool Amsterdam — main.js
   ============================================================ */

/* CONFIG: WhatsApp-nummer, internationaal, zonder + of spaties */
const WHATSAPP_NUMBER = "31600000000";

document.addEventListener("DOMContentLoaded", () => {

  /* ---- Sticky header ---- */
  const head = document.getElementById("siteHead");
  const onScroll = () => head.classList.toggle("scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobiel menu ---- */
  const burger = document.getElementById("burger");
  const mMenu = document.getElementById("mMenu");
  if (burger && mMenu) {
    const setMenu = (open) => {
      burger.classList.toggle("open", open);
      mMenu.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", String(open));
      mMenu.setAttribute("aria-hidden", String(!open));
    };
    burger.addEventListener("click", () => setMenu(!mMenu.classList.contains("open")));
    mMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  }

  /* ---- Fade-up bij scrollen ---- */
  const fadeIO = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      entry.target.style.transitionDelay = `${(i % 3) * 70}ms`;
      entry.target.classList.add("in");
      fadeIO.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".fade").forEach((el) => fadeIO.observe(el));

  /* ---- Stappen: lijn licht op per stap ---- */
  const stepIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("lit");
    });
  }, { threshold: 0.5 });
  document.querySelectorAll(".step[data-step]").forEach((el) => stepIO.observe(el));

  /* ---- Swipe-tracks: pijltjes ---- */
  document.querySelectorAll(".track-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const track = document.getElementById(btn.dataset.track);
      if (!track) return;
      const first = track.querySelector(":scope > *");
      const step = first ? first.getBoundingClientRect().width + 16 : 300;
      track.scrollBy({ left: step * Number(btn.dataset.dir), behavior: "smooth" });
    });
  });

  /* ---- Proefles-widget: 2 stappen + WhatsApp ---- */
  const form = document.getElementById("widgetForm");
  if (form) {
    const steps = form.querySelectorAll(".wstep");
    const bar = document.getElementById("progressBar");
    const showStep = (n) => {
      steps.forEach((s) => s.classList.toggle("is-active", Number(s.dataset.step) === n));
      if (bar) bar.style.width = n === 1 ? "50%" : "100%";
    };

    const markInvalid = (el, bad) => el.classList.toggle("err", bad);

    document.getElementById("toStep2").addEventListener("click", () => {
      const naam = document.getElementById("w-naam");
      const wijk = document.getElementById("w-wijk");
      const naamBad = !naam.value.trim();
      const wijkBad = !wijk.value.trim();
      markInvalid(naam, naamBad);
      markInvalid(wijk, wijkBad);
      if (naamBad || wijkBad) { (naamBad ? naam : wijk).focus(); return; }
      showStep(2);
    });

    document.getElementById("backStep1").addEventListener("click", () => showStep(1));

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = (id) => (document.getElementById(id).value || "").trim();
      const type = (form.querySelector('input[name="w-type"]:checked') || {}).value || "";
      const rows = [
        ["Naam", v("w-naam")],
        ["Wijk / postcode", v("w-wijk")],
        ["Schakel of automaat", type],
        ["Leeftijd", v("w-leeftijd")],
        ["Rijervaring", v("w-ervaring")],
        ["Beschikbaarheid", v("w-beschikbaar")],
        ["Opmerkingen", v("w-opm")],
      ].filter(([, val]) => val);
      const msg = `Hoi! Ik wil graag een PROEFLES inplannen.\n\n${rows.map(([k, val]) => `${k}: ${val}`).join("\n")}\n\nKunnen jullie contact met mij opnemen?`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
    });
  }

  /* ---- FAQ: één tegelijk open ---- */
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) faqItems.forEach((o) => { if (o !== item) o.open = false; });
    });
  });

  /* ---- Jaartal ---- */
  const yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
});
