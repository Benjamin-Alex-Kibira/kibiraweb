const toggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('.site-nav');
const imageFeedUrl = '../images.json';

toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('is-open');
  toggle?.setAttribute('aria-expanded', 'false');
}));

document.querySelector('[data-year]').textContent = new Date().getFullYear();

const applyImage = (element, url) => {
  if (!url) return;
  element.style.backgroundImage = `url("${url}")`;
  element.classList.add('has-remote-image');
};

const startImageRotation = (images) => {
  const groups = { gevurah: [], eatAfrica: [] };
  const counters = { gevurah: 0, eatAfrica: 0 };

  document.querySelectorAll('[data-image-slot]').forEach((slot) => {
    if (groups[slot.dataset.imageSlot]) groups[slot.dataset.imageSlot].push(slot);
  });

  const renderGroup = (name) => {
    const sourceImages = images[name] || [];
    if (!sourceImages.length) return;
    groups[name].forEach((slot, index) => {
      const image = sourceImages[(counters[name] + index) % sourceImages.length];
      applyImage(slot, image.url || image);
    });
    counters[name] = (counters[name] + 1) % sourceImages.length;
  };

  renderGroup('gevurah');
  renderGroup('eatAfrica');
  window.setInterval(() => {
    renderGroup('gevurah');
    renderGroup('eatAfrica');
  }, 9000);
};

fetch(`${imageFeedUrl}?v=${Date.now()}`, { cache: 'no-store' })
  .then((response) => response.ok ? response.json() : Promise.reject(new Error('Image feed unavailable')))
  .then((feed) => startImageRotation(feed.images || {}))
  .catch(() => {});
