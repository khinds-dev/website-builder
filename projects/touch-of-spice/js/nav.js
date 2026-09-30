// Accessible hamburger nav + accordion
(function () {
  'use strict';

  // ── Hamburger toggle ──
  var btn = document.querySelector('.navbar__hamburger');
  var menu = document.querySelector('.navbar__links');
  if (btn && menu) {
    btn.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('click', function (e) {
      if (!btn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── Active nav link ──
  var links = document.querySelectorAll('.navbar__links a:not(.navbar__cta)');
  links.forEach(function (link) {
    if (link.getAttribute('href') === window.location.pathname ||
        window.location.pathname.startsWith(link.getAttribute('href').replace(/\/$/, '') + '/')) {
      link.classList.add('active');
    }
  });

  // ── Accordion ──
  var triggers = document.querySelectorAll('.accordion-trigger');
  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var expanded = trigger.getAttribute('aria-expanded') === 'true';
      var bodyId = trigger.getAttribute('aria-controls');
      var body = document.getElementById(bodyId);

      // Close all
      triggers.forEach(function (t) {
        t.setAttribute('aria-expanded', 'false');
        var id = t.getAttribute('aria-controls');
        var b = document.getElementById(id);
        if (b) b.classList.remove('open');
      });

      // Open clicked if it was closed
      if (!expanded && body) {
        trigger.setAttribute('aria-expanded', 'true');
        body.classList.add('open');
      }
    });
  });
}());
