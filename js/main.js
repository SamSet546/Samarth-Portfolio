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

/* ---------------------------------------------------------------
   Hero background marquee
   Builds a shuffled strip of project images, duplicated so the
   translate loops seamlessly. Adjacent duplicates are avoided.
   --------------------------------------------------------------- */
(function () {
  'use strict';

  var track = document.getElementById('heroTrack');
  var pool = window.HERO_IMAGES;
  if (!track || !pool || !pool.length) return;

  function shuffled(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* Draw enough tiles to span a wide viewport. Re-shuffle each pass and
     reject a tile that would sit next to a copy of itself. */
  function buildStrip(count) {
    var out = [];
    var bag = [];
    while (out.length < count) {
      if (!bag.length) bag = shuffled(pool);
      var next = bag.pop();
      if (out.length && out[out.length - 1] === next) {
        if (bag.length) {           // swap with another from the bag
          var alt = bag.pop();
          bag.push(next);
          next = alt;
        } else {
          bag = shuffled(pool);
          continue;
        }
      }
      out.push(next);
    }
    // and make sure the loop seam isn't a repeat either
    if (out.length > 1 && out[0] === out[out.length - 1]) out.pop();
    return out;
  }

  var strip = buildStrip(Math.max(14, pool.length));

  function render(list) {
    var frag = document.createDocumentFragment();
    list.forEach(function (name) {
      var img = document.createElement('img');
      img.src = 'images/hero/' + name;
      img.alt = '';
      img.decoding = 'async';
      frag.appendChild(img);
    });
    return frag;
  }

  track.appendChild(render(strip));   // copy 1
  track.appendChild(render(strip));   // copy 2, for the seamless wrap

  /* Longer strips need proportionally longer duration for constant speed */
  var PX_PER_SEC = 19.5;
  requestAnimationFrame(function () {
    var half = track.scrollWidth / 2;
    if (half > 0) track.style.animationDuration = (half / PX_PER_SEC) + 's';
    track.classList.add('is-running');
  });
})();
