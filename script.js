/* ============================================================================
   ★ PROPERTY LISTINGS — EDIT HERE (and ONLY here) ★
   ----------------------------------------------------------------------------
   This is the ONE place to add, remove, or update listings. No HTML needed.

   HOW TO ADD A LISTING:
     1. Copy one of the example objects below (from "{" to "},").
     2. Paste it inside the [ ] list, above or below the others.
     3. Change the fields to the real property. Save the file. Done.

   FIELDS (all text goes inside "quotes"; numbers do NOT):
     id       : any unique short text, e.g. "mls-12345"
     status   : MUST be one of: "For Sale" | "For Rent" | "Pending" | "Sold"
     price    : text, e.g. "$450,000"  or  "$2,400/mo"
     address  : street address, e.g. "123 Palm Avenue"
     city     : e.g. "Pinellas Park, FL"
     beds     : number, e.g. 3
     baths    : number, e.g. 2
     sqft     : number, e.g. 1450   (commas are added automatically)
     blurb    : one short sentence (optional — set to "" to hide)
     featured : true or false (optional — true adds a "Featured" tag + accent border)
     link     : URL to an MLS / details page (optional — leave "" for no link)
     photo    : leave "" to show the elegant placeholder. To use a real photo,
                put an image URL here. TIP: prefer your own hosted image; do not
                rely on hotlinking someone else's image.

   To temporarily show the "coming soon" empty state, make this an empty list: []
   ========================================================================== */
var LISTINGS = [
  // --- SAMPLE 1 (replace with a real listing) -------------------------------
  {
    id: "sample-1",
    status: "For Sale",
    price: "$439,900",
    address: "7412 58th Way N",
    city: "Pinellas Park, FL",
    beds: 3,
    baths: 2,
    sqft: 1548,
    blurb: "Updated block home with a split floor plan, two-car garage, and a fenced backyard.",
    featured: true,
    link: "",
    photo: ""
  },
  // --- SAMPLE 2 (replace with a real listing) -------------------------------
  {
    id: "sample-2",
    status: "For Sale",
    price: "$319,000",
    address: "4905 82nd Ave N",
    city: "Pinellas Park, FL",
    beds: 2,
    baths: 1,
    sqft: 1024,
    blurb: "Move-in-ready starter home minutes from Tampa Bay beaches and US-19.",
    featured: false,
    link: "",
    photo: ""
  },
  // --- SAMPLE 3 (replace with a real listing) -------------------------------
  //     Note: RENTALS now display live in the "Available Rentals" section via
  //     the TenantTurner widget — keep this list for FOR-SALE / featured homes.
  {
    id: "sample-3",
    status: "For Sale",
    price: "$525,000",
    address: "3120 68th Street N",
    city: "St. Petersburg, FL",
    beds: 3,
    baths: 2,
    sqft: 1340,
    blurb: "Bright home with a screened lanai, minutes from downtown St. Pete.",
    featured: false,
    link: "",
    photo: ""
  }
  // --- Add more listings below this line, following the same pattern --------
];

/* =========================================================
   Revive Property Group — Services Site
   Vanilla JS: nav, reveal, counters, help-bar, carousel,
   listings render, form validation + mailto. No dependencies. No secrets.
   ========================================================= */
(function () {
  "use strict";

  var CONTACT_EMAIL = "heath@buyfloridaestate.com";
  // Dedicated Formspree form for Florianopolis / Brazil leads (routes to Jucileide, jucipolli@gmail.com).
  var FLORIANOPOLIS_ENDPOINT = "https://formspree.io/f/mbdnebnl";
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

  /* ---------- Property listings render (data-driven from LISTINGS) ---------- */
  (function initListings() {
    var grid = document.getElementById("listings-grid");
    if (!grid) return;

    var list = (typeof LISTINGS !== "undefined" && Array.isArray(LISTINGS)) ? LISTINGS : [];

    // Escape any text before it touches the DOM as HTML.
    function esc(v) {
      return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    }
    function num(v) {
      var n = Number(v);
      return isFinite(n) ? n.toLocaleString("en-US") : esc(v);
    }

    // Map a status to a badge modifier class. Unknown statuses fall back to "sale".
    var STATUS_CLASS = {
      "For Sale": "sale",
      "For Rent": "rent",
      "Pending": "pending",
      "Sold": "sold"
    };

    var ICON = {
      bed: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 9v9M22 18v-4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2M2 14h20"/><path d="M6 12V8a2 2 0 0 1 2-2h3v6"/></svg>',
      bath: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12V6a2 2 0 0 1 4 0M3 12h18v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5zM7 19l-1.5 2M17 19l1.5 2"/></svg>',
      sqft: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9V4h5M20 15v5h-5M20 9V4h-5M4 15v5h5"/></svg>',
      star: '<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true"><path d="m12 3 2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z"/></svg>',
      home: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z"/></svg>'
    };

    // Empty state — tasteful "coming soon" instead of an empty grid.
    if (!list.length) {
      grid.classList.add("is-empty");
      grid.innerHTML =
        '<div class="listings-empty">' +
          '<span class="listings-empty-icon">' + ICON.home + '</span>' +
          '<h3>New listings coming soon</h3>' +
          '<p>We are lining up our next homes for sale and rentals. Call to be the first to know.</p>' +
          '<a class="btn btn-primary" href="tel:+17277551662">Call (727) 755-1662</a>' +
        '</div>';
      return;
    }

    var html = list.map(function (item) {
      item = item || {};
      var statusText = esc(item.status || "For Sale");
      var statusClass = STATUS_CLASS[item.status] || "sale";
      var hasPhoto = typeof item.photo === "string" && item.photo.trim() !== "";
      var hasLink = typeof item.link === "string" && item.link.trim() !== "";
      var isFeatured = item.featured === true;

      var mediaStyle = hasPhoto
        ? ' style="background-image:url(\'' + esc(item.photo.trim()) + '\')"'
        : "";
      var photoTag = hasPhoto ? "" : '<span class="listing-photo-tag">Photo</span>';
      var featuredTag = isFeatured
        ? '<span class="listing-featured-tag">' + ICON.star + ' Featured</span>'
        : "";

      // Quick stats — labels are visible text (never color-only meaning).
      var stats = [
        '<span class="listing-stat">' + ICON.bed + ' <b>' + num(item.beds) + '</b> beds</span>',
        '<span class="listing-stat-sep" aria-hidden="true">&middot;</span>',
        '<span class="listing-stat">' + ICON.bath + ' <b>' + num(item.baths) + '</b> baths</span>',
        '<span class="listing-stat-sep" aria-hidden="true">&middot;</span>',
        '<span class="listing-stat">' + ICON.sqft + ' <b>' + num(item.sqft) + '</b> sqft</span>'
      ].join("");

      var blurb = (item.blurb && String(item.blurb).trim() !== "")
        ? '<p class="listing-blurb">' + esc(item.blurb) + '</p>'
        : "";

      var addressLabel = esc(item.address || "") + ", " + esc(item.city || "");
      var link = hasLink
        ? '<a class="listing-link" href="' + esc(item.link.trim()) + '" rel="noopener"' +
          ' aria-label="View details for ' + addressLabel + '">View details <span aria-hidden="true">&rarr;</span></a>'
        : "";

      var cardClass = "listing-card" +
        (hasLink ? " listing-card--link" : "") +
        (isFeatured ? " listing-card--featured" : "");

      return '' +
        '<article class="' + cardClass + '">' +
          '<div class="listing-media' + (hasPhoto ? " listing-media--photo" : "") + '">' +
            '<span class="listing-media-img"' + mediaStyle + '></span>' +
            '<span class="listing-badge listing-badge--' + statusClass + '">' + statusText + '</span>' +
            featuredTag +
            photoTag +
          '</div>' +
          '<div class="listing-body">' +
            '<p class="listing-price">' + esc(item.price || "") + '</p>' +
            '<h3 class="listing-address">' + esc(item.address || "") +
              '<span class="listing-city">' + esc(item.city || "") + '</span></h3>' +
            '<div class="listing-stats">' + stats + '</div>' +
            blurb +
            link +
          '</div>' +
        '</article>';
    }).join("");

    grid.innerHTML = html;
  })();

  /* ---------- Retire-abroad savings calculator ---------- */
  (function initRetireCalc() {
    var input = document.getElementById("us-spend");
    if (!input) return;
    var outFloripa = document.getElementById("rc-floripa");
    var outMonthly = document.getElementById("rc-monthly-save");
    var outAnnual = document.getElementById("rc-annual-save");
    var RATIO = 0.46; // Florianopolis cost ~= 46% of the US equivalent (Numbeo, 2026)
    function fmt(n) { return "$" + Math.round(n).toLocaleString("en-US"); }
    function calc() {
      var us = parseFloat(input.value) || 0;
      if (outFloripa) outFloripa.textContent = us > 0 ? fmt(us * RATIO) : "—";
      if (outMonthly) outMonthly.textContent = us > 0 ? fmt(us * (1 - RATIO)) : "—";
      if (outAnnual)  outAnnual.textContent  = us > 0 ? fmt(us * (1 - RATIO) * 12) : "—";
    }
    input.addEventListener("input", calc);
    calc();
  })();

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
      var svc = helpSelect.value;
      // Same-page contact form? Scroll + prefill. Otherwise go to the contact page.
      if (document.getElementById("contact-form")) {
        selectService(svc);
        goToContact();
        window.setTimeout(function () {
          var name = document.getElementById("name");
          if (name) name.focus();
        }, prefersReduced ? 0 : 500);
      } else {
        window.location.href = "contact.html?service=" + encodeURIComponent(svc);
      }
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

  /* ---------- Investment page calculators (run only if present) ---------- */
  (function initCalculators() {
    var mc = document.getElementById("mortgage-calc");
    var ic = document.getElementById("investment-calc");
    if (!mc && !ic) return;

    // Read a numeric input; empty/invalid -> 0. Never negative.
    function n(id) {
      var el = document.getElementById(id);
      if (!el) return 0;
      var v = parseFloat(el.value);
      if (!isFinite(v) || v < 0) return 0;
      return v;
    }
    function money(v) {
      if (!isFinite(v)) return "$0";
      var neg = v < 0;
      var s = "$" + Math.round(Math.abs(v)).toLocaleString("en-US");
      return neg ? "-" + s : s;
    }
    function pct(v) {
      if (!isFinite(v)) return "0.00%";
      return v.toFixed(2) + "%";
    }
    function set(id, text, cls) {
      var el = document.getElementById(id);
      if (!el) return;
      el.textContent = text;
      if (cls !== undefined) {
        el.classList.remove("is-neg", "is-pos");
        if (cls) el.classList.add(cls);
      }
    }
    // Standard amortized monthly principal + interest.
    function monthlyPayment(loan, annualRatePct, years) {
      var nMonths = Math.round(years * 12);
      if (loan <= 0 || nMonths <= 0) return 0;
      var r = (annualRatePct / 100) / 12;
      if (r === 0) return loan / nMonths;
      var pow = Math.pow(1 + r, nMonths);
      return loan * (r * pow) / (pow - 1);
    }

    function calcMortgage() {
      var price = n("mc-price");
      var downPct = Math.min(n("mc-down"), 100);
      var rate = n("mc-rate");
      var term = n("mc-term");
      var loan = price * (1 - downPct / 100);
      var pay = monthlyPayment(loan, rate, term);
      var total = pay * Math.round(term * 12);
      set("mc-loan", money(loan));
      set("mc-monthly", money(pay));
      set("mc-total", money(total));
    }

    function calcInvestment() {
      var price = n("ic-price");
      var downPct = Math.min(n("ic-down"), 100);
      var rate = n("ic-rate");
      var term = n("ic-term");
      var rent = n("ic-rent");
      var expenses = n("ic-exp");

      var downAmount = price * (downPct / 100);
      var loan = price - downAmount;
      var pay = monthlyPayment(loan, rate, term);

      var monthlyCashFlow = rent - expenses - pay;
      var annualCashFlow = monthlyCashFlow * 12;
      var annualNOI = (rent - expenses) * 12; // excludes debt service
      var capRate = price > 0 ? (annualNOI / price) * 100 : 0;
      var coc = downAmount > 0 ? (annualCashFlow / downAmount) * 100 : 0;

      set("ic-mortgage", money(pay));
      set("ic-cashflow", money(monthlyCashFlow), monthlyCashFlow < 0 ? "is-neg" : "is-pos");
      set("ic-caprate", price > 0 ? pct(capRate) : "—");
      set("ic-coc", downAmount > 0 ? pct(coc) : "—", coc < 0 ? "is-neg" : (coc > 0 ? "is-pos" : ""));
    }

    if (mc) {
      mc.addEventListener("input", calcMortgage);
      calcMortgage();
    }
    if (ic) {
      ic.addEventListener("input", calcInvestment);
      calcInvestment();
    }
  })();

  /* ---------- Contact form validation + mailto ---------- */
  var form = document.getElementById("contact-form");
  if (!form) return;
  var status = document.getElementById("form-status");

  /* Preselect the service dropdown from ?service= (set by CTAs on other pages) */
  (function prefillServiceFromQuery() {
    try {
      var params = new URLSearchParams(window.location.search);
      var svc = params.get("service");
      if (!svc) return;
      var sel = document.getElementById("service");
      if (!sel) return;
      for (var i = 0; i < sel.options.length; i++) {
        if (sel.options[i].value === svc) { sel.value = svc; sel.dispatchEvent(new Event("change")); break; }
      }
    } catch (e) { /* no-op */ }
  })();

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

    // No-code endpoint (set data-endpoint on the form). No secrets in markup.
    var endpoint = form.getAttribute("data-endpoint");
    // Florianopolis / Brazil leads go to their own form (routes to Jucileide).
    if (data.service === "Florianopolis" && FLORIANOPOLIS_ENDPOINT) {
      endpoint = FLORIANOPOLIS_ENDPOINT;
    }
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
    // Route Florianopolis / Brazil investment leads to the local partner (Jucileide), CC Heath.
    var recipient = CONTACT_EMAIL;
    var ccPart = "";
    if (data.service === "Florianopolis") {
      recipient = "jucipolli@gmail.com";
      ccPart = "&cc=" + encodeURIComponent(CONTACT_EMAIL);
    }
    var href = "mailto:" + recipient +
      "?subject=" + encodeURIComponent(subject) +
      ccPart +
      "&body=" + encodeURIComponent(lines.join("\n"));

    window.location.href = href;
    if (status) {
      status.textContent = "Opening your email app to send… If nothing happens, email " + recipient + " directly.";
      status.className = "form-note ok";
    }
  }

  function submitToEndpoint(endpoint, data) {
    if (status) { status.textContent = "Sending…"; status.className = "form-note"; }
    var payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      service: data.service,
      message: data.message,
      _replyto: data.email,
      _subject: "New inquiry: " + data.service + " — " + data.name
    };
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload)
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
