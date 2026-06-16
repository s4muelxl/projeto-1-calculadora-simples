// js/app.js – Main entry point
// Handles navigation, dark‑mode toggle, and dynamic section loading

// Import module renderers
import { renderSimpleInterest } from "./jurosSimples.js";
import { renderCompoundInterest } from "./jurosCompostos.js";
import { renderInvestmentSimulator } from "./investimentos.js";
import { renderLoanSimulator } from "./emprestimos.js";
import { renderDashboard } from "./charts.js";

const main = document.getElementById("main-content");
const themeToggle = document.getElementById("theme-toggle");
const navLinks = document.querySelectorAll("nav a[data-section]");

// ---------- Dark mode ----------
function loadTheme() {
  const saved = localStorage.getItem("theme");
  if (saved) document.documentElement.dataset.theme = saved;
}
function toggleTheme() {
  const current = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = current;
  localStorage.setItem("theme", current);
}

themeToggle.addEventListener("click", toggleTheme);
loadTheme();

// ---------- Navigation ----------
function clearActive() {
  navLinks.forEach(l => l.classList.remove("active"));
}
function loadSection(section) {
  main.innerHTML = ""; // clear previous content
  switch (section) {
    case "simple-interest":
      renderSimpleInterest(main);
      break;
    case "compound-interest":
      renderCompoundInterest(main);
      break;
    case "investment-simulator":
      renderInvestmentSimulator(main);
      break;
    case "loan-simulator":
      renderLoanSimulator(main);
      break;
    case "dashboard":
      renderDashboard(main);
      break;
    default:
      main.innerHTML = `<p>Seção não encontrada.</p>`;
  }
}

navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const sec = link.dataset.section;
    clearActive();
    link.classList.add("active");
    loadSection(sec);
  });
});

// Load default section on first visit
if (!location.hash) {
  const first = navLinks[0];
  first.classList.add("active");
  loadSection(first.dataset.section);
} else {
  const hash = location.hash.replace("#", "");
  const target = document.querySelector(`nav a[data-section="${hash}"]`);
  if (target) {
    target.classList.add("active");
    loadSection(hash);
  }
}

// Persist last visited section
function saveLastSection(section) {
  localStorage.setItem("lastSection", section);
}
function restoreLastSection() {
  const sec = localStorage.getItem("lastSection");
  if (sec) {
    const link = document.querySelector(`nav a[data-section="${sec}"]`);
    if (link) {
      clearActive();
      link.classList.add("active");
      loadSection(sec);
    }
  }
}
restoreLastSection();

// Save on navigation
navLinks.forEach(l => l.addEventListener("click", () => saveLastSection(l.dataset.section)));

// ---------- Service Worker Registration (PWA) ----------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('Service Worker registrado com sucesso:', reg.scope))
      .catch(err => console.error('Falha ao registrar o Service Worker:', err));
  });
}

// ---------- PWA Install Prompt ----------
let deferredPrompt;
const installBtn = document.getElementById('pwa-install');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBtn) {
    installBtn.style.display = 'inline-flex';
  }
});

if (installBtn) {
  installBtn.addEventListener('click', () => {
    if (!deferredPrompt) return;
    installBtn.style.display = 'none';
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('Instalação aceita');
      } else {
        console.log('Instalação recusada');
      }
      deferredPrompt = null;
    });
  });
}
