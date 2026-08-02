(function () {
  "use strict";

  /* ---------- Contador de tiempo juntos ---------- */
  var START_DATE = new Date(2024, 10, 6, 9, 10, 0); // 6 de noviembre de 2024, 9:10 AM

  var elYears = document.getElementById("counterYears");
  var elMonths = document.getElementById("counterMonths");
  var elDays = document.getElementById("counterDays");
  var elHours = document.getElementById("counterHours");
  var elMinutes = document.getElementById("counterMinutes");
  var elSeconds = document.getElementById("counterSeconds");

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function updateCounter() {
    var now = new Date();

    var years = now.getFullYear() - START_DATE.getFullYear();
    var months = now.getMonth() - START_DATE.getMonth();
    if (now.getDate() < START_DATE.getDate()) {
      months -= 1;
    }
    if (months < 0) {
      months += 12;
      years -= 1;
    }
    if (years < 0) {
      years = 0;
      months = 0;
    }

    // Fecha ancla: inicio + años y meses completos ya transcurridos
    var anchor = new Date(
      START_DATE.getFullYear() + years,
      START_DATE.getMonth() + months,
      START_DATE.getDate(),
      START_DATE.getHours(),
      START_DATE.getMinutes(),
      START_DATE.getSeconds()
    );

    var diffMs = now.getTime() - anchor.getTime();
    if (diffMs < 0) diffMs = 0;

    var totalSeconds = Math.floor(diffMs / 1000);
    var days = Math.floor(totalSeconds / 86400);
    var hours = Math.floor((totalSeconds % 86400) / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;

    if (elYears) elYears.textContent = years;
    if (elMonths) elMonths.textContent = months;
    if (elDays) elDays.textContent = days;
    if (elHours) elHours.textContent = pad(hours);
    if (elMinutes) elMinutes.textContent = pad(minutes);
    if (elSeconds) elSeconds.textContent = pad(seconds);
  }

  if (elYears && elMonths && elDays && elHours && elMinutes && elSeconds) {
    updateCounter();
    setInterval(updateCounter, 1000);
  }

  /* ---------- Corazones flotando al scrollear ---------- */
  var heartsContainer = document.getElementById("heartsContainer");
  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (heartsContainer && !prefersReducedMotion) {
    var SYMBOLS = ["♡", "❤", "✧", "❀"];
    var COLORS = [
      "var(--purple-x11)",
      "var(--deep-lilac)",
      "var(--dusty-grape)",
      "var(--amethyst-smoke)",
    ];
    var MAX_HEARTS = 14;
    var SCROLL_STEP = 150; // px de scroll acumulado antes de soltar un corazón

    var lastScrollY = window.scrollY;
    var accumulated = 0;
    var ticking = false;

    function spawnHeart() {
      if (heartsContainer.childElementCount >= MAX_HEARTS) return;

      var heart = document.createElement("span");
      heart.className = "floating-heart";
      heart.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

      var size = (Math.random() * 1.3 + 0.9).toFixed(2);
      var duration = (Math.random() * 4 + 8).toFixed(2);
      var sway = Math.round(Math.random() * 70 - 35);

      heart.style.left = Math.random() * 100 + "vw";
      heart.style.fontSize = size + "rem";
      heart.style.animationDuration = duration + "s";
      heart.style.setProperty("--sway", sway + "px");
      heart.style.color = COLORS[Math.floor(Math.random() * COLORS.length)];

      heart.addEventListener("animationend", function () {
        heart.remove();
      });

      heartsContainer.appendChild(heart);
    }

    function handleScroll() {
      var currentScrollY = window.scrollY;
      accumulated += Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;

      while (accumulated >= SCROLL_STEP) {
        spawnHeart();
        accumulated -= SCROLL_STEP;
      }

      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(handleScroll);
          ticking = true;
        }
      },
      { passive: true }
    );
  }
})();
