const form = document.getElementById("requestForm");
const success = document.getElementById("success");
const errorBox = document.getElementById("errorBox");
const frame = document.getElementById("submitFrame");
const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");

menuBtn.addEventListener("click", () => mobileNav.classList.toggle("open"));
document.querySelectorAll(".mobile-nav a").forEach(a => a.addEventListener("click", () => mobileNav.classList.remove("open")));

const GAS_URL = "https://script.google.com/macros/s/AKfycby1nOrkI-SQBJ2nklykkxlFfawRSHKBZ0p7PgmtCYa0-qAhWOllZTWl-gj6CBF0YEgQ/exec"; // ← Google Apps ScriptのWebアプリURLをここに入れる

form.addEventListener("submit", e => {
  if (!GAS_URL) {
    e.preventDefault();
    errorBox.textContent = "まだ受付システムの接続先が設定されていません。script.js の GAS_URL を設定してください。";
    errorBox.classList.remove("hidden");
    return;
  }
  form.action = GAS_URL;
  errorBox.classList.add("hidden");

  const submitButton = form.querySelector("button[type=submit]");
  submitButton.disabled = true;
  submitButton.innerHTML = "送信しています…";

  setTimeout(() => {
    form.classList.add("hidden");
    success.classList.remove("hidden");
    submitButton.disabled = false;
    submitButton.innerHTML = '依頼内容を送信する <span>→</span>';
  }, 1200);
});

document.getElementById("backToForm").addEventListener("click", () => {
  success.classList.add("hidden");
  form.classList.remove("hidden");
  form.reset();
});

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({behavior:"smooth"});
    }
  });
});
