(function () {
  "use strict";
  var C = window.WEDDING, I = window.I18N;
  var doc = document.documentElement;
  doc.classList.add("js");

  /* ---------- environment ---------- */
  var framed = (function () { try { return window.self !== window.top; } catch (e) { return true; } })();
  var params = new URLSearchParams(location.search);
  var sideKey = (params.get("side") === "bride" || location.hash === "#bride") ? "bride" : "groom";
  var S = C.sides[sideKey];
  var lang = "en";
  try { var saved = localStorage.getItem("invite-lang"); if (saved === "pa" || saved === "en") lang = saved; } catch (e) {}
  if (params.get("lang") === "pa") lang = "pa";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var L = function (o) { if (!o) return ""; if (typeof o === "string") return o; return o[lang] || o.en || ""; };
  var person = function (k) { return L(C.couple[k]); };
  var first = function () { return person(S.order[0]); };
  var second = function () { return person(S.order[1]); };
  var t = function (k) { var s = (I[lang] && I[lang][k]) || I.en[k] || ""; return s.replace(/\{first\}/g, first()).replace(/\{second\}/g, second()); };

  /* ---------- dates ---------- */
  var DAYS = { en: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"], pa: ["ਐਤਵਾਰ","ਸੋਮਵਾਰ","ਮੰਗਲਵਾਰ","ਬੁੱਧਵਾਰ","ਵੀਰਵਾਰ","ਸ਼ੁੱਕਰਵਾਰ","ਸ਼ਨਿੱਚਰਵਾਰ"] };
  var MONTHS = { en: ["January","February","March","April","May","June","July","August","September","October","November","December"], pa: ["ਜਨਵਰੀ","ਫ਼ਰਵਰੀ","ਮਾਰਚ","ਅਪ੍ਰੈਲ","ਮਈ","ਜੂਨ","ਜੁਲਾਈ","ਅਗਸਤ","ਸਤੰਬਰ","ਅਕਤੂਬਰ","ਨਵੰਬਰ","ਦਸੰਬਰ"] };
  function parts(d) { var p = (d || "").split("-").map(Number); return p.length === 3 && p[0] ? p : null; }
  function fmtDate(d, withDay) {
    var p = parts(d); if (!p) return "";
    var wd = new Date(Date.UTC(p[0], p[1] - 1, p[2])).getUTCDay();
    var s = p[2] + " " + MONTHS[lang][p[1] - 1] + " " + p[0];
    return withDay === false ? s : DAYS[lang][wd] + ", " + s;
  }
  function hm(s) { var m = /^(\d{1,2}):(\d{2})$/.exec(s || ""); return m ? [+m[1], +m[2]] : null; }
  function fmtTime(s) {
    var x = hm(s); if (!x) return "";
    var h12 = ((x[0] + 11) % 12) + 1, mm = (x[1] < 10 ? "0" : "") + x[1];
    if (lang === "pa") {
      var part = x[0] < 12 ? "ਸਵੇਰੇ" : x[0] < 16 ? "ਦੁਪਹਿਰ" : x[0] < 19 ? "ਸ਼ਾਮ" : "ਰਾਤ";
      return part + " " + h12 + ":" + mm + " ਵਜੇ";
    }
    return h12 + ":" + mm + " " + (x[0] < 12 ? "a.m." : "p.m.");
  }
  function fmtRange(ev) {
    if (!hm(ev.start)) return "";
    if (!hm(ev.end)) return fmtTime(ev.start);
    if (lang === "pa") return fmtTime(ev.start).replace(" ਵਜੇ", "") + " " + t("to") + " " + fmtTime(ev.end).replace(/^\S+ /, "");
    return fmtTime(ev.start) + " – " + fmtTime(ev.end);
  }
  function toDate(d, time) { if (!parts(d) || !hm(time)) return null; var x = new Date(d + "T" + time + ":00" + C.utcOffset); return isNaN(x) ? null : x; }

  var events = C.events.filter(function (e) { return e.enabled !== false; });
  var mainEv = events.filter(function (e) { return e.id === C.mainEventId; })[0] || null;
  var venueOf = function (k) { return C.venues[k] || null; };

  /* ---------- links ---------- */
  function mapsUrl(v) { if (!v) return ""; return v.mapUrl || ("https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(v.mapQuery || (v.name.en + ", " + v.address.en))); }
  function utcStamp(d) { return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }
  function evEnd(ev) { return toDate(ev.date, ev.end) || toDate(ev.date, ev.start); }
  function calTitle(ev) { return ev.name.en + " · " + C.couple[S.order[0]].en + " & " + C.couple[S.order[1]].en; }
  function calLocation(v) { return v ? v.name.en + ", " + v.address.en : ""; }
  function calDetails(ev) { var d = []; if (ev.note) d.push(ev.note.en); d.push(shareUrl()); return d.join("\n"); }
  function gcalUrl(ev) {
    var s = toDate(ev.date, ev.start); if (!s) return "";
    var v = venueOf(ev.venue);
    return "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent(calTitle(ev)) +
      "&dates=" + utcStamp(s) + "/" + utcStamp(evEnd(ev)) +
      "&ctz=" + encodeURIComponent(C.timezone) +
      "&location=" + encodeURIComponent(calLocation(v)) +
      "&details=" + encodeURIComponent(calDetails(ev));
  }
  function icsEsc(s) { return String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n"); }
  function icsFile(ev) {
    var s = toDate(ev.date, ev.start); if (!s) return;
    var v = venueOf(ev.venue);
    var lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedding Invitation//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "BEGIN:VEVENT",
      "UID:" + ev.id + "-" + ev.date + "@wedding-invite",
      "DTSTAMP:" + utcStamp(new Date()),
      "DTSTART:" + utcStamp(s)];
    if (hm(ev.end)) lines.push("DTEND:" + utcStamp(evEnd(ev)));
    lines.push("SUMMARY:" + icsEsc(calTitle(ev)), "LOCATION:" + icsEsc(calLocation(v)), "DESCRIPTION:" + icsEsc(calDetails(ev)), "END:VEVENT", "END:VCALENDAR");
    var blob = new Blob([lines.join("\r\n") + "\r\n"], { type: "text/calendar;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = ev.id + ".ics";
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  function shareUrl() {
    var base = C.siteUrl || (framed ? "" : location.origin + location.pathname);
    if (!base) return "";
    return base + (sideKey === "bride" ? "#bride" : "");
  }
  function shareText() { return L(C.shareMessage).replace("{first}", first()).replace("{second}", second()); }

  /* ---------- render ---------- */
  function bind(name, value) { $$('[data-bind="' + name + '"]').forEach(function (el) { el.textContent = value || ""; }); }
  var MOTIF = { ring: "m-ring", roka: "m-ring", "anand-karaj": "m-khanda", reception: "m-lamp" };

  function actionButtons(ev, compact) {
    var v = venueOf(ev.venue), h = "";
    if (v) h += '<a class="btn btn--ghost btn--sm" href="' + esc(mapsUrl(v)) + '" target="_blank" rel="noopener">' + esc(t("directions")) + "</a>";
    if (toDate(ev.date, ev.start)) {
      h += '<div class="cal"><button class="btn btn--ghost btn--sm" type="button" aria-expanded="false" data-cal="' + esc(ev.id) + '">' + esc(t("add_calendar")) + "</button>" +
        '<div class="cal__menu" hidden><a href="' + esc(gcalUrl(ev)) + '" target="_blank" rel="noopener">' + esc(t("google_calendar")) + "</a>" +
        (framed ? "" : '<button type="button" data-ics="' + esc(ev.id) + '">' + esc(t("apple_ics")) + "</button>") + "</div></div>";
    }
    return h;
  }

  function renderTimeline() {
    $("#timeline").innerHTML = events.map(function (ev) {
      var v = venueOf(ev.venue), isMain = ev.id === C.mainEventId;
      var noteV = ev.noteVenue ? venueOf(ev.noteVenue) : null;
      return '<li class="fn reveal' + (isMain ? " fn--main" : "") + '">' +
        '<span class="fn__dot" aria-hidden="true"><svg><use href="#' + (MOTIF[ev.type] || "m-lotus") + '"/></svg></span>' +
        '<article class="fn__card">' +
          '<div class="fn__when"><span class="fn__date">' + esc(fmtDate(ev.date)) + '</span><span class="fn__time">' + esc(fmtRange(ev)) + "</span></div>" +
          "<h3 class=\"fn__name\">" + esc(L(ev.name)) + (ev.subtitle ? " <small>" + esc(L(ev.subtitle)) + "</small>" : "") + "</h3>" +
          (v ? '<p class="fn__venue">' + esc(L(v.name)) + (v.subtitle ? "<br><span class=\"fn__addr\">" + esc(L(v.subtitle)) + "</span>" : "") + '</p><p class="fn__addr">' + esc(L(v.address)) + "</p>" : "") +
          (ev.note ? '<p class="fn__note">' + esc(L(ev.note)) + (noteV ? ' · <a href="' + esc(mapsUrl(noteV)) + '" target="_blank" rel="noopener">' + esc(t("directions")) + "</a>" : "") + "</p>" : "") +
          (ev.dressCode ? '<p class="fn__dress"><strong>' + esc(t("dress_label")) + ":</strong> " + esc(L(ev.dressCode.text)) + "</p>" : "") +
          (isMain ? '<p class="fn__etiquette">' + esc(t("anand_note")) + "</p>" : "") +
          '<div class="actions">' + actionButtons(ev) + (isMain && S.film ? '<button class="btn btn--ghost btn--sm" type="button" data-film>' + esc(t("watch_film")) + "</button>" : "") + "</div>" +
        "</article></li>";
    }).join("");
  }

  function renderAnand() {
    var sec = $("#anand-karaj"), navItem = $('a[href="#anand-karaj"]');
    if (!mainEv) { sec.hidden = true; if (navItem) navItem.parentNode.hidden = true; return; }
    var v = venueOf(mainEv.venue), rows = [];
    if (v) rows.push([lang === "pa" ? "ਗੁਰਦੁਆਰਾ ਸਾਹਿਬ" : "Gurdwara", L(v.name) + (v.subtitle ? " (" + L(v.subtitle) + ")" : "")]);
    rows.push([lang === "pa" ? "ਮਿਤੀ ਅਤੇ ਸਮਾਂ" : "Date & time", fmtDate(mainEv.date) + " · " + fmtRange(mainEv)]);
    if (v) rows.push([lang === "pa" ? "ਪਤਾ" : "Address", L(v.address)]);
    if (mainEv.note) rows.push([lang === "pa" ? "ਉਪਰੰਤ" : "Afterwards", L(mainEv.note)]);
    $("#anandFacts").innerHTML = rows.map(function (r) { return "<div><dt>" + esc(r[0]) + "</dt><dd>" + esc(r[1]) + "</dd></div>"; }).join("");
    $("#anandActions").innerHTML = actionButtons(mainEv);
  }

  function renderVenues() {
    var order = [], uses = {};
    events.forEach(function (ev) {
      [[ev.venue, ev, false], [ev.noteVenue, ev, true]].forEach(function (x) {
        if (!x[0] || !venueOf(x[0])) return;
        if (!uses[x[0]]) { uses[x[0]] = []; order.push(x[0]); }
        uses[x[0]].push({ ev: x[1], note: x[2] });
      });
    });
    $("#venueList").innerHTML = order.map(function (k) {
      var v = venueOf(k);
      var when = uses[k].map(function (u) {
        var label = u.note ? L(u.ev.note) : L(u.ev.name);
        var time = u.note ? fmtDate(u.ev.date) : fmtDate(u.ev.date) + " · " + fmtRange(u.ev);
        return "<span><b>" + esc(label) + "</b> — " + esc(time) + "</span>";
      }).join("");
      return '<div class="venue reveal"><div style="min-width:0">' +
        '<h3 class="venue__name">' + esc(L(v.name)) + "</h3>" +
        (v.subtitle ? '<p class="venue__sub">' + esc(L(v.subtitle)) + "</p>" : "") +
        '<p class="venue__addr">' + esc(L(v.address)) + "</p>" +
        (v.parking ? '<p class="venue__addr"><b>' + esc(t("parking")) + ":</b> " + esc(L(v.parking)) + "</p>" : "") +
        '<p class="venue__when">' + when + "</p></div>" +
        '<div class="venue__btns"><a class="btn btn--gold btn--sm" href="' + esc(mapsUrl(v)) + '" target="_blank" rel="noopener">' + esc(t("directions")) + "</a></div></div>";
    }).join("");
  }

  var photos = [];
  function renderGallery() {
    photos = C.gallery.filter(function (g) { return !g.placeholder && g.src; });
    var i = 0;
    $("#galleryGrid").innerHTML = C.gallery.map(function (g) {
      if (g.placeholder) return '<div class="tile tile--ph" role="img" aria-label="' + esc(L(g.label) + " — " + t("photo_coming")) + '"><span><span class="ph__label">' + esc(L(g.label)) + '</span><span class="ph__hint">' + esc(t("photo_coming")) + "</span></span></div>";
      var idx = i++;
      return '<figure class="tile"><button type="button" class="tile__btn" data-photo="' + idx + '" aria-label="' + esc(L(g.alt)) + '">' +
        '<img src="' + esc(g.src) + '" alt="' + esc(L(g.alt)) + '" loading="lazy" decoding="async"></button>' +
        (g.caption ? "<figcaption>" + esc(L(g.caption)) + "</figcaption>" : "") + "</figure>";
    }).join("");
  }

  function renderDress() {
    var withDress = events.filter(function (e) { return e.dressCode; });
    var on = withDress.length > 0;
    $("#dress").hidden = !on; $("[data-nav-dress]").hidden = !on;
    if (!on) return;
    $("#dressGrid").innerHTML = withDress.map(function (e) {
      return '<div class="dress-card"><h3>' + esc(L(e.name)) + "</h3><p>" + esc(L(e.dressCode.text)) + "</p>" +
        (e.dressCode.colours ? '<div class="swatches">' + e.dressCode.colours.map(function (c) { return '<span style="background:' + esc(c) + '"></span>'; }).join("") + "</div>" : "") +
        (e.dressCode.image ? '<img src="' + esc(e.dressCode.image) + '" alt="" loading="lazy" style="margin-top:12px">' : "") + "</div>";
    }).join("");
  }

  function renderStatic() {
    doc.lang = lang === "pa" ? "pa" : "en";
    $$("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    $$("[data-lang-toggle]").forEach(function (b) { b.setAttribute("aria-label", t("langSwitchAria")); b.lang = lang === "pa" ? "en" : "pa"; });
    bind("initials", C.couple[S.order[0]].en.charAt(0) + " · " + C.couple[S.order[1]].en.charAt(0));
    bind("first", first()); bind("second", second());
    bind("city", lang === "pa" ? "ਸ੍ਰੀ ਗੰਗਾਨਗਰ" : "Sri Ganganagar");
    bind("mainDate", mainEv ? fmtDate(mainEv.date) : "");
    bind("mainDateTime", mainEv ? fmtDate(mainEv.date) + " · " + fmtRange(mainEv) : "");
    var mv = mainEv && venueOf(mainEv.venue);
    bind("mainVenue", mv ? L(mv.name) + (mv.subtitle ? " · " + L(mv.subtitle) : "") + ", " + L(mv.address) : "");
    bind("blessingLine", L(S.blessingLine));
    ["heavenlyBlessings", "hosts", "request", "firstLineage", "secondLineage", "eagerlyAwaiting"].forEach(function (k) { bind(k, L(S[k])); });
    $("#awaitingBlock").hidden = !S.eagerlyAwaiting;
    $("#complimentsList").innerHTML = (S.compliments || []).map(function (c) { return "<li>" + esc(L(c)) + "</li>"; }).join("");
    var ct = S.contact; $("#contactBlock").hidden = !ct;
    if (ct) {
      bind("contactNames", L(ct.names)); bind("contactAddress", L(ct.address));
      $("#contactPhones").innerHTML = ct.phones.map(function (p) { return '<a href="tel:+91' + p.replace(/\D/g, "") + '">' + esc(p) + "</a>"; }).join("");
    }
    $("#printBtn").hidden = framed;
    var url = shareUrl();
    $("#waBtn").href = "https://wa.me/?text=" + encodeURIComponent(shareText() + (url ? " " + url : ""));
    $("#copyBtn").hidden = !url;
    var mb = $("#musicBtn"); mb.hidden = !C.music || !C.music.src;
    $(".sr", mb).textContent = t(mb.getAttribute("aria-pressed") === "true" ? "music_pause" : "music_play");
  }

  /* split names into letters (English) or words (Punjabi, so vowel signs stay joined) */
  function splitText() {
    $$("[data-split]").forEach(function (root) {
      var i = 0;
      (root.hasAttribute("data-bind") ? [root] : $$("[data-bind], .names__amp", root)).forEach(function (el) {
        var txt = el.textContent; if (!txt) return;
        var units = lang === "pa" ? txt.split(/(\s+)/) : Array.from(txt);
        el.setAttribute("aria-label", txt);
        el.innerHTML = units.map(function (u) {
          if (/^\s+$/.test(u)) return " ";
          return '<span class="ch" aria-hidden="true" style="--i:' + (i++) + '">' + esc(u) + "</span>";
        }).join("");
      });
    });
  }

  function renderAll() { renderStatic(); splitText(); renderTimeline(); renderGallery(); renderDress(); tick(); setupReveal(); }

  /* ---------- countdown ---------- */
  var timer;
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function tick() {
    var start = mainEv && toDate(mainEv.date, mainEv.start);
    var end = mainEv && (toDate(mainEv.date, mainEv.end) || (start && new Date(start.getTime() + 3 * 3600e3)));
    var cd = $("#cd"), msg = $("#cdMsg"), now = Date.now();
    if (!start) { cd.hidden = true; msg.hidden = false; msg.textContent = t("countdown_tba"); return; }
    if (now >= start.getTime()) {
      cd.hidden = true; msg.hidden = false;
      msg.textContent = now < end.getTime() ? t("countdown_live") : t("countdown_done");
      if (now >= end.getTime()) clearInterval(timer);
      return;
    }
    cd.hidden = false; msg.hidden = true;
    var s = Math.floor((start.getTime() - now) / 1000);
    $("#cdD").textContent = Math.floor(s / 86400);
    $("#cdH").textContent = pad(Math.floor(s % 86400 / 3600));
    $("#cdM").textContent = pad(Math.floor(s % 3600 / 60));
    $("#cdS").textContent = pad(s % 60);
  }

  /* ---------- reveal ---------- */
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealObs = null;
  function setupReveal() {
    if (reduce || !("IntersectionObserver" in window)) return;
    if (!revealObs) revealObs = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove("pre"); revealObs.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    $$(".reveal, .stagger, .divider, [data-split]").forEach(function (el) {
      if (el.closest(".welcome")) return;
      if (el.dataset.seen) return; el.dataset.seen = "1";
      if (el.getBoundingClientRect().top > innerHeight) { el.classList.add("pre"); revealObs.observe(el); }
    });
  }

  /* ---------- navigation ---------- */
  var nav = $("#nav"), menuBtn = $("#menuBtn");
  function closeMenu() { nav.classList.remove("is-open"); menuBtn.setAttribute("aria-expanded", "false"); }
  menuBtn.addEventListener("click", function () {
    var open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open); menuBtn.setAttribute("aria-expanded", String(open));
    if (open) { var a = $("a", nav); a && a.focus(); }
  });
  function goTo(id) {
    var el = document.getElementById(id); if (!el) return;
    var top = el.getBoundingClientRect().top + scrollY - ($("#topbar").offsetHeight - 1);
    scrollTo({ top: id === "welcome" ? 0 : top, behavior: reduce ? "auto" : "smooth" });
    el.setAttribute("tabindex", "-1"); el.focus({ preventScroll: true });
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (a) {
      var id = a.getAttribute("href").slice(1);
      if (id && document.getElementById(id)) { e.preventDefault(); closeMenu(); goTo(id); }
      return;
    }
    var calBtn = e.target.closest("[data-cal]");
    $$(".cal__menu").forEach(function (m) { if (!calBtn || m !== calBtn.nextElementSibling) { m.hidden = true; if (m.previousElementSibling) m.previousElementSibling.setAttribute("aria-expanded", "false"); } });
    if (calBtn) { var m = calBtn.nextElementSibling; m.hidden = !m.hidden; calBtn.setAttribute("aria-expanded", String(!m.hidden)); }
    var ics = e.target.closest("[data-ics]");
    if (ics) { var ev = events.filter(function (x) { return x.id === ics.getAttribute("data-ics"); })[0]; if (ev) icsFile(ev); }
    var ph = e.target.closest("[data-photo]");
    if (ph) openLightbox(+ph.getAttribute("data-photo"), ph);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    closeMenu();
    $$(".cal__menu").forEach(function (m) { m.hidden = true; });
    if (!$("#lightbox").hidden) closeLightbox();
    if (!$("#filmBox").hidden) closeFilm();
  });

  var sections = ["blessings", "invitation", "functions", "anand-karaj", "venues", "gallery", "dress"];
  if ("IntersectionObserver" in window) {
    var navObs = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        $$(".nav__list a").forEach(function (a) { a.setAttribute("aria-current", a.getAttribute("href") === "#" + e.target.id ? "true" : "false"); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (id) { var el = document.getElementById(id); el && navObs.observe(el); });
  }
  var topbar = $("#topbar");
  addEventListener("scroll", function () { topbar.classList.toggle("is-scrolled", scrollY > 8); }, { passive: true });

  /* ---------- language ---------- */
  $$("[data-lang-toggle]").forEach(function (b) {
    b.addEventListener("click", function () {
      lang = lang === "en" ? "pa" : "en";
      try { localStorage.setItem("invite-lang", lang); } catch (e) {}
      renderAll();
    });
  });

  /* ---------- the gate ---------- */
  var gate = $("#gate"), body = document.body;
  var skipGate = params.has("nogate") || !gate;
  function openGate(instant) {
    if (!gate || gate.classList.contains("is-opening")) return;
    body.classList.remove("gate-locked");
    if (instant || reduce) { gate.remove(); body.classList.add("gate-open"); return; }
    gate.classList.add("is-opening");
    setTimeout(function () { body.classList.add("gate-open"); petals(); }, 900);
    setTimeout(function () { gate.remove(); }, 2600);
    var h = $("#welcomeNames"); if (h) { h.setAttribute("tabindex", "-1"); setTimeout(function () { h.focus({ preventScroll: true }); }, 1200); }
  }
  if (skipGate) { openGate(true); if (window.PetalField) PetalField.start(); }
  else {
    body.classList.add("gate-locked");
    $("#gateBtn").addEventListener("click", function () { playMusic(); openGate(false); });
    gate.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      var f = $$("button", gate), i = f.indexOf(document.activeElement); e.preventDefault();
      f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    });
    setTimeout(function () { var b = $("#gateBtn"); b && b.focus({ preventScroll: true }); }, 50);
  }

  function petals() { if (window.PetalField) PetalField.start({ burst: true }); }

  /* ---------- scroll-linked motion: parallax + timeline thread ---------- */
  var pxEls = $$("[data-parallax]"), tl = $("#timeline"), ticking = false;
  function onScroll() {
    ticking = false;
    pxEls.forEach(function (el) {
      var r = el.getBoundingClientRect(), mid = r.top + r.height / 2 - innerHeight / 2;
      el.style.setProperty("--py", (mid * -parseFloat(el.getAttribute("data-parallax"))).toFixed(1) + "px");
      if (el.hasAttribute("data-spin")) el.style.setProperty("--spin", (mid * .06).toFixed(2));
    });
    if (tl) {
      var r = tl.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, (innerHeight * .75 - r.top) / r.height));
      tl.style.setProperty("--thread", p.toFixed(3));
    }
  }
  if (!reduce) {
    addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    addEventListener("resize", onScroll); onScroll();
  }

  /* ---------- lightbox ---------- */
  var lbIndex = 0, lbReturn = null, lb = $("#lightbox");
  function showPhoto(i) {
    lbIndex = (i + photos.length) % photos.length;
    var p = photos[lbIndex];
    $("#lbImg").src = p.src; $("#lbImg").alt = L(p.alt); $("#lbCap").textContent = L(p.caption);
    $("#lbPrev").hidden = $("#lbNext").hidden = photos.length < 2;
  }
  function openLightbox(i, from) { lbReturn = from; lb.setAttribute("aria-label", t("lightbox")); lb.hidden = false; showPhoto(i); $("#lbClose").focus(); document.body.style.overflow = "hidden"; }
  function closeLightbox() { lb.hidden = true; document.body.style.overflow = ""; lbReturn && lbReturn.focus(); }
  $("#lbClose").addEventListener("click", closeLightbox);
  $("#lbPrev").addEventListener("click", function () { showPhoto(lbIndex - 1); });
  $("#lbNext").addEventListener("click", function () { showPhoto(lbIndex + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
  lb.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") showPhoto(lbIndex - 1);
    if (e.key === "ArrowRight") showPhoto(lbIndex + 1);
    if (e.key === "Tab") { var f = $$("button:not([hidden])", lb); var i = f.indexOf(document.activeElement); e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus(); }
  });
  var sx = null, sy = null;
  lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (sx == null) return;
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) showPhoto(lbIndex + (dx < 0 ? 1 : -1));
    sx = null;
  });

  /* ---------- film ---------- */
  var fb = $("#filmBox"), fv = $("#filmVideo");
  var filmFrom = null, musicWasOn = false;
  function closeFilm() { fv.pause(); fb.hidden = true; document.body.style.overflow = ""; filmFrom && filmFrom.focus(); if (musicWasOn) playMusic(); }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-film]"); if (!b || !S.film) return;
    filmFrom = b; musicWasOn = !bgm.paused; pauseMusic();
    if (!fv.src) { fv.src = S.film.src; if (S.film.poster) fv.poster = S.film.poster; }
    fb.hidden = false; document.body.style.overflow = "hidden"; $("#filmClose").focus();
    var p = fv.play(); if (p && p.catch) p.catch(function () {});
  });
  $("#filmClose").addEventListener("click", closeFilm);
  fb.addEventListener("click", function (e) { if (e.target === fb) closeFilm(); });

  /* ---------- sharing ---------- */
  var toastT;
  function toast(msg) { var el = $("#toast"); el.textContent = msg; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { el.hidden = true; }, 3200); }
  function copyFallback(url) { var f = $("#copyField"); f.value = url; f.hidden = false; f.focus(); f.select(); toast(t("copy_failed")); }
  function copyLink() {
    var url = shareUrl(); if (!url) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () { toast(t("copied")); }, function () { copyFallback(url); });
    } else copyFallback(url);
  }
  $("#copyBtn").addEventListener("click", copyLink);
  $("#shareBtn").addEventListener("click", function () {
    var url = shareUrl();
    var data = { title: first() + " & " + second(), text: shareText() };
    if (url) data.url = url;
    if (navigator.share) {
      navigator.share(data).catch(function (err) { if (!err || err.name !== "AbortError") $("#waBtn").click(); });
    } else $("#waBtn").click();
  });
  $("#printBtn").addEventListener("click", function () { window.print(); });

  /* ---------- music: starts when the guest taps "Open Invitation" (never autoplays on load) ---------- */
  var bgm = $("#bgm"), mb = $("#musicBtn"), userPaused = false;
  function setMusicUi(on) { mb.setAttribute("aria-pressed", String(on)); $(".sr", mb).textContent = t(on ? "music_pause" : "music_play"); }
  function playMusic() {
    if (!C.music || !C.music.src) return;
    if (!bgm.src) { bgm.src = C.music.src; }
    bgm.volume = C.music.volume != null ? C.music.volume : .5;
    var p = bgm.play();
    if (p && p.then) p.then(function () { setMusicUi(true); }, function () { setMusicUi(false); });
  }
  function pauseMusic() { bgm.pause(); setMusicUi(false); }
  mb.addEventListener("click", function () {
    if (bgm.paused) { userPaused = false; playMusic(); } else { userPaused = true; pauseMusic(); }
  });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { if (!bgm.paused) { bgm.pause(); bgm.dataset.resume = "1"; } }
    else if (bgm.dataset.resume) { delete bgm.dataset.resume; if (!userPaused) playMusic(); }
  });
  bgm.addEventListener("error", function () { mb.hidden = true; });

  $("#openBtn").addEventListener("click", function () { topbar.classList.add("is-scrolled"); });

  /* ---------- go ---------- */
  renderAll();
  timer = setInterval(tick, 1000);
})();
