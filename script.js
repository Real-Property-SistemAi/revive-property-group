/* =========================================================
   Revive Property Group — Services Site
   Vanilla JS: nav, reveal, counters, help-bar, carousel,
   form validation + mailto. No dependencies. No secrets.
   ========================================================= */
(function () {
  "use strict";

  var CONTACT_EMAIL = "heath@buyfloridaestate.com";
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Current year in footer ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Sticky header shadow ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Animated counters ---------- */
  var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    if (prefersReduced) { el.textContent = String(target); return; }
    var start = performance.now();
    var dur = 1200;
    function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window && !prefersReduced) {
    var cio = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCount(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.getAttribute("data-count"); });
  }

  /* ---------- Shared helper: preselect service + scroll to contact ---------- */
  var serviceSelect = document.getElementById("service");
  function selectService(val) {
    if (serviceSelect && val) {
      serviceSelect.value = val;
      serviceSelect.dispatchEvent(new Event("change"));
    }
  }
  function goToContact() {
    var contact = document.getElementById("contact");
    if (contact) contact.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
  }

  /* ---------- Hero "How can we help?" bar ---------- */
  var helpBar = document.getElementById("help-bar");
  var helpSelect = document.getElementById("help-select");
  if (helpBar && helpSelect) {
    helpBar.addEventListener("submit", function (e) {
      e.preventDefault();
      selectService(helpSelect.value);
      goToContact();
      window.setTimeout(function () {
        var name = document.getElementById("name");
        if (name) name.focus();
      }, prefersReduced ? 0 : 500);
    });
  }

  /* ---------- Service CTA prefill ---------- */
  Array.prototype.slice.call(document.querySelectorAll("[data-prefill]")).forEach(function (btn) {
    btn.addEventListener("click", function () {
      selectService(btn.getAttribute("data-prefill"));
    });
  });

  /* ---------- Testimonials carousel ---------- */
  (function initCarousel() {
    var track = document.getElementById("carousel-track");
    var dotsWrap = document.getElementById("carousel-dots");
    if (!track || !dotsWrap) return;

    var slides = Array.prototype.slice.call(track.children);
    if (slides.length === 0) return;

    var carousel = track.closest(".carousel");
    var prevBtn = carousel.querySelector('[data-carousel="prev"]');
    var nextBtn = carousel.querySelector('[data-carousel="next"]');
    var toggleBtn = carousel.querySelector('[data-carousel="toggle"]');

    var index = 0;
    var timer = null;
    var AUTO_MS = 6000;
    var playing = !prefersReduced;
    var manualStopped = prefersReduced;

    // Build dots
    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Go to testimonial " + (i + 1));
      dot.addEventListener("click", function () { goTo(i); if (!manualStopped) start(); });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function update() {
      track.style.transform = "translateX(" + (-index * 100) + "%)";
      slides.forEach(function (s, i) {
        s.setAttribute("aria-hidden", i === index ? "false" : "true");
      });
      dots.forEach(function (d, i) {
        d.setAttribute("aria-selected", i === index ? "true" : "false");
        d.tabIndex = i === index ? 0 : -1;
      });
    }
    function goTo(i) { index = (i + slides.length) % slides.length; update(); }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function start() {
      if (prefersReduced) return;
      stop();
      timer = window.setInterval(next, AUTO_MS);
      playing = true;
      syncToggle();
    }
    function stop() {
      if (timer) { window.clearInterval(timer); timer = null; }
      playing = false;
      syncToggle();
    }
    function syncToggle() {
      if (!toggleBtn) return;
      toggleBtn.setAttribute("aria-pressed", playing ? "true" : "false");
      toggleBtn.setAttribute("aria-label", playing ? "Pause automatic rotation" : "Play automatic rotation");
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { prev(); if (!manualStopped) start(); });
    if (nextBtn) nextBtn.addEventListener("click", function () { next(); if (!manualStopped) start(); });
    if (toggleBtn) toggleBtn.addEventListener("click", function () {
      if (playing) { manualStopped = true; stop(); }
      else { manualStopped = false; start(); }
    });

    // Keyboard: arrow keys when carousel has focus
    carousel.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { prev(); if (!manualStopped) start(); e.preventDefault(); }
      else if (e.key === "ArrowRight") { next(); if (!manualStopped) start(); e.preventDefault(); }
    });

    // Pause on hover / focus, resume on leave (unless user paused)
    carousel.addEventListener("mouseenter", function () { if (!manualStopped) stop(); });
    carousel.addEventListener("mouseleave", function () { if (!manualStopped) start(); });
    carousel.addEventListener("focusin", function () { if (!manualStopped) stop(); });
    carousel.addEventListener("focusout", function () {
      if (!manualStopped && !carousel.contains(document.activeElement)) start();
    });

    // Pause when tab is hidden
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else if (!manualStopped) start();
    });

    update();
    if (!prefersReduced) start();
    else { playing = false; syncToggle(); }
  })();

  /* ---------- Contact form validation + mailto ---------- */
  var form = document.getElementById("contact-form");
  if (!form) return;
  var status = document.getElementById("form-status");

  function setError(name, msg) {
    var field = form.querySelector('[name="' + name + '"]');
    if (!field) return;
    var wrap = field.closest(".field");
    var errEl = form.querySelector('[data-error-for="' + name + '"]');
    if (msg) {
      if (wrap) wrap.classList.add("invalid");
      if (errEl) errEl.textContent = msg;
      field.setAttribute("aria-invalid", "true");
    } else {
      if (wrap) wrap.classList.remove("invalid");
      if (errEl) errEl.textContent = "";
      field.removeAttribute("aria-invalid");
    }
  }

  function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  }

  // Clear error as the user fixes a field
  form.addEventListener("input", function (e) {
    if (e.target.name) setError(e.target.name, "");
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (status) { status.textContent = ""; status.className = "form-note"; }

    function val(n) {
      var el = form.elements.namedItem(n);
      return el && el.value ? el.value.trim() : "";
    }
    var data = {
      name: val("name"),
      email: val("email"),
      phone: val("phone"),
      service: val("service"),
      message: val("message")
    };

    var firstInvalid = null;
    function fail(field, msg) { setError(field, msg); if (!firstInvalid) firstInvalid = field; }

    if (!data.name) fail("name", "Please enter your name.");
    if (!data.email) fail("email", "Please enter your email.");
    else if (!isEmail(data.email)) fail("email", "Please enter a valid email address.");
    if (data.phone && data.phone.replace(/[^\d]/g, "").length < 7) fail("phone", "Please enter a valid phone number.");
    if (!data.service) fail("service", "Please choose a service.");
    if (!data.message) fail("message", "Please tell us how we can help.");

    if (firstInvalid) {
      var el = form.querySelector('[name="' + firstInvalid + '"]');
      if (el) el.focus();
      if (status) { status.textContent = "Please fix the highlighted fields."; status.className = "form-note err"; }
      return;
    }

    // Optional future no-code endpoint (set data-endpoint on the form). No secrets in markup.
    var endpoint = form.getAttribute("data-endpoint");
    if (endpoint) {
      submitToEndpoint(endpoint, data);
      return;
    }

    openMailto(data);
  });

  function openMailto(data) {
    var subject = "New inquiry: " + data.service + " — " + data.name;
    var lines = [
      "Name: " + data.name,
      "Email: " + data.email,
      "Phone: " + (data.phone || "(not provided)"),
      "Service: " + data.service,
      "",
      "Message:",
      data.message
    ];
    var href = "mailto:" + CONTACT_EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(lines.join("\n"));

    window.location.href = href;
    if (status) {
      status.textContent = "Opening your email app to send… If nothing happens, email " + CONTACT_EMAIL + " directly.";
      status.className = "form-note ok";
    }
  }

  function submitToEndpoint(endpoint, data) {
    if (status) { status.textContent = "Sending…"; status.className = "form-note"; }
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(data)
    })
      .then(function (res) {
        if (!res.ok) throw new Error("Request failed");
        form.reset();
        if (status) { status.textContent = "Thanks! Your message is on its way. We'll be in touch shortly."; status.className = "form-note ok"; }
      })
      .catch(function () {
        if (status) { status.textContent = "We couldn't reach the server — opening your email app instead."; status.className = "form-note err"; }
        openMailto(data);
      });
  }
})();
