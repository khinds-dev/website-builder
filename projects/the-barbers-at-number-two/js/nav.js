/* nav.js — accessible hamburger menu toggle with keyboard/escape & click-outside support */
(function () {
  'use strict';
  
  function initNav() {
    var btn = document.getElementById('menuBtn');
    var menu = document.getElementById('navLinks');
    if (!btn || !menu) return;

    function toggleMenu(force) {
      var isOpen = typeof force === 'boolean' ? force : !menu.classList.contains('open');
      menu.classList.toggle('open', isOpen);
      btn.classList.toggle('open', isOpen);
      btn.setAttribute('aria-expanded', String(isOpen));
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleMenu();
    });

    document.addEventListener('click', function (e) {
      if (!btn.contains(e.target) && !menu.contains(e.target)) {
        toggleMenu(false);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        toggleMenu(false);
        btn.focus();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();
