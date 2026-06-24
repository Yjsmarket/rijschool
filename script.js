/* =========================================================
   Rijschool Amsterdam — script.js
   ========================================================= */

/* ---- CONFIGURATIE: pas hier je WhatsApp-nummer aan ----
   Internationaal formaat ZONDER + of spaties (bijv. 31612345678) */
const WHATSAPP_NUMBER = "31600000000";
/* ------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

  /* ===== Sticky header schaduw bij scroll ===== */
  const header = document.getElementById("header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ===== Mobiel menu ===== */
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const closeMenu = () => {
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
  };
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));

  /* ===== Scroll reveal animaties ===== */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = (i % 4) * 80 + "ms";
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("in"));
  }

  /* ===== Tellers (cijfers) animeren ===== */
  const counters = document.querySelectorAll(".stat-num[data-count]");
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const suffix = el.dataset.suffix || "";
    const dur = 1500;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = (eased * target);
      el.textContent = val.toLocaleString("nl-NL", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString("nl-NL", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { animateCount(entry.target); co.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(el => co.observe(el));
  } else {
    counters.forEach(el => { el.textContent = el.dataset.count + (el.dataset.suffix || ""); });
  }

  /* ===== FAQ: maximaal één tegelijk open ===== */
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    item.addEventListener("toggle", () => {
      if (item.open) faqItems.forEach(o => { if (o !== item) o.open = false; });
    });
  });

  /* ===== Contactformulier -> WhatsApp ===== */
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const naam = (document.getElementById("f-naam").value || "").trim();
      const tel = (document.getElementById("f-telefoon").value || "").trim();
      const plaats = (document.getElementById("f-plaats").value || "").trim();
      const type = (document.getElementById("f-type").value || "").trim();
      const bericht = (document.getElementById("f-bericht").value || "").trim();

      let msg = "Hoi! Ik wil graag een GRATIS PROEFLES aanvragen.\n\n";
      if (naam)    msg += `• Naam: ${naam}\n`;
      if (tel)     msg += `• Telefoon: ${tel}\n`;
      if (plaats)  msg += `• Plaats: ${plaats}\n`;
      if (type)    msg += `• Voorkeur: ${type}\n`;
      if (bericht) msg += `• Bericht: ${bericht}\n`;
      msg += "\nKunnen jullie contact met mij opnemen? Bedankt!";

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      window.open(url, "_blank", "noopener");
    });
  }

  /* ===== Jaartal in footer ===== */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
