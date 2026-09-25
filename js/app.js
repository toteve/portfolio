const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navPanel = document.querySelector('.nav-panel');
const navLinks = document.querySelectorAll('.nav-links a');
const themeButton = document.querySelector('.theme-toggle');
const backToTop = document.querySelector('.back-to-top');
const filterButtons = document.querySelectorAll('.filter-button');
const projectCards = document.querySelectorAll('.project-card');

const closeMenu = () => {
  navPanel.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menú');
  document.body.classList.remove('menu-open');
};

menuButton.addEventListener('click', () => {
  const open = navPanel.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  document.body.classList.toggle('menu-open', open);
});

navLinks.forEach(link => link.addEventListener('click', closeMenu));

const savedTheme = localStorage.getItem('portfolio-theme');
const preferredLight = window.matchMedia('(prefers-color-scheme: light)').matches;
if (savedTheme === 'light' || (!savedTheme && preferredLight)) {
  document.documentElement.dataset.theme = 'light';
}

const updateThemeIcon = () => {
  const light = document.documentElement.dataset.theme === 'light';
  themeButton.querySelector('span').textContent = light ? '☾' : '☀';
  themeButton.setAttribute('aria-label', light ? 'Activar tema oscuro' : 'Activar tema claro');
};
updateThemeIcon();

themeButton.addEventListener('click', () => {
  const light = document.documentElement.dataset.theme === 'light';
  if (light) {
    delete document.documentElement.dataset.theme;
    localStorage.setItem('portfolio-theme', 'dark');
  } else {
    document.documentElement.dataset.theme = 'light';
    localStorage.setItem('portfolio-theme', 'light');
  }
  updateThemeIcon();
});

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    projectCards.forEach(card => {
      const matches = filter === 'all' || card.dataset.category.includes(filter);
      card.classList.toggle('hidden', !matches);
    });
  });
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

const sections = document.querySelectorAll('main section[id]');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(section => sectionObserver.observe(section));

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 16;
  header.classList.toggle('scrolled', scrolled);
  backToTop.classList.toggle('visible', window.scrollY > 600);
});

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.getElementById('current-year').textContent = new Date().getFullYear();
