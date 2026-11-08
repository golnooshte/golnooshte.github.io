document.documentElement.classList.add('js');

// Work chooser: visitors pick which kind of work to see
(() => {
  const work = document.getElementById('work');
  const buttons = document.querySelectorAll('.chooser [data-filter]');
  if (!work || !buttons.length) return;
  const groups = work.querySelectorAll('.work-group');
  const empty = work.querySelector('.empty-state');
  const bar = work.querySelector('.chooser');

  function apply(filter, scroll) {
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === filter)));
    work.classList.toggle('is-filtered', filter !== 'all');
    let shown = 0;
    groups.forEach(group => {
      const kinds = group.dataset.group.split(' ');
      const groupOn = filter === 'all' || kinds.includes(filter);
      let cardsOn = 0;
      group.querySelectorAll('[data-category]').forEach(card => {
        const on = groupOn && (filter === 'all' || kinds.length === 1 || card.dataset.category === filter);
        card.hidden = !on;
        if (on) { cardsOn++; card.classList.add('is-visible'); }
      });
      group.hidden = !(groupOn && cardsOn);
      shown += group.hidden ? 0 : cardsOn;
    });
    if (empty) empty.hidden = shown > 0;
    if (scroll) {
      const target = filter === 'all' ? work : work.querySelector('.work-group:not([hidden])');
      const top = target.getBoundingClientRect().top + window.scrollY - (filter === 'all' ? 20 : bar.offsetHeight + 40);
      if (window.scrollY > top || filter !== 'all') window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  buttons.forEach(b => b.addEventListener('click', () => {
    apply(b.dataset.filter, true);
    history.replaceState(null, '', b.dataset.filter === 'all' ? '#work' : '#show-' + b.dataset.filter);
  }));

  // Shareable links, e.g. index.html#show-analysis
  const m = location.hash.match(/^#show-(\w+)/);
  if (m && [...buttons].some(b => b.dataset.filter === m[1])) {
    apply(m[1], false);
    requestAnimationFrame(() => work.scrollIntoView());
  }
})();

// Gentle reveal on scroll
(() => {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { items.forEach(el => el.classList.add('is-visible')); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach(el => io.observe(el));
})();
