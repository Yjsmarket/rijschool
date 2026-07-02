/* ============================================================
   Rijschool Amsterdam — script.js
   ============================================================ */

/* CONFIG: WhatsApp-nummer, internationaal formaat zonder + of spaties */
const WHATSAPP_NUMBER = "31600000000";

document.addEventListener("DOMContentLoaded", () => {

  /* ---- Nav: achtergrond bij scroll ---- */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 30);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobiel menu ---- */
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("mobileMenu");
  const setMenu = (open) => {
    toggle.classList.toggle("open", open);
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-hidden", String(!open));
  };
  toggle.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

  /* ---- Scroll reveal ---- */
  const reveals = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      entry.target.style.transitionDelay = `${(i % 4) * 80}ms`;
      entry.target.classList.add("in");
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  reveals.forEach((el) => io.observe(el));

  /* ---- Tellers in hero-stats ---- */
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const dur = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target).toLocaleString("nl-NL");
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      counterIO.unobserve(entry.target);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll(".num[data-count]").forEach((el) => counterIO.observe(el));

  /* ---- FAQ: één tegelijk open ---- */
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) faqItems.forEach((other) => { if (other !== item) other.open = false; });
    });
  });

  /* ---- Formulier -> WhatsApp ---- */
  document.getElementById("contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const val = (id) => document.getElementById(id).value.trim();
    const fields = [
      ["Naam", val("f-naam")],
      ["Telefoon", val("f-telefoon")],
      ["Plaats", val("f-plaats")],
      ["Voorkeur", val("f-type")],
      ["Bericht", val("f-bericht")],
    ];
    const lines = fields.filter(([, v]) => v).map(([k, v]) => `• ${k}: ${v}`);
    const msg = `Hoi! Ik wil graag een GRATIS PROEFLES aanvragen.\n\n${lines.join("\n")}\n\nKunnen jullie contact met mij opnemen?`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  });

  /* ---- Jaartal ---- */
  document.getElementById("year").textContent = new Date().getFullYear();
});
