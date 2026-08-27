(function () {
  'use strict';

  /* Mobile menu ---------------------------------------------------- */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* Back to top ---------------------------------------------------- */
  var toTop = document.getElementById('toTop');

  function onScroll() {
    if (toTop) {
      toTop.classList.toggle('is-visible', window.scrollY > 420);
    }
    spy();
  }

  /* Highlight the nav link for the section in view ------------------ */
  var links = menu ? Array.prototype.slice.call(menu.querySelectorAll('a[href^="#"]')) : [];
  var targets = links
    .map(function (a) {
      return { link: a, el: document.querySelector(a.getAttribute('href')) };
    })
    .filter(function (t) { return t.el; });

  function spy() {
    if (!targets.length) return;
    var line = window.scrollY + 140;
    var current = null;

    targets.forEach(function (t) {
      if (t.el.offsetTop <= line) current = t;
    });

    links.forEach(function (a) { a.classList.remove('is-active'); });
    if (current) current.link.classList.add('is-active');
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
