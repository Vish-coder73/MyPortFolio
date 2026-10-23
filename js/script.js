document.addEventListener('DOMContentLoaded', () => {
  const revealItems = document.querySelectorAll('.reveal');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, revealObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  }

  const nav = document.querySelector('.site-nav');
  window.addEventListener('scroll', () => nav.classList.toggle('nav-scrolled', window.scrollY > 20), { passive: true });

  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      const menu = document.querySelector('#mainNav');
      if (menu.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(menu).hide();
    });
  });

  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.nav-link[href^="#"]')];
  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
  sections.forEach((section) => activeObserver.observe(section));

  const filterButtons = document.querySelectorAll('.filter-button');
  const projectCards = document.querySelectorAll('.project-card[data-categories]');
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((item) => item.classList.toggle('active', item === button));
      projectCards.forEach((card) => {
        const matches = filter === 'all' || card.dataset.categories.split(' ').includes(filter);
        card.classList.toggle('is-hidden', !matches);
      });
    });
  });

  // Replace these placeholders with the EmailJS values from your account.
  const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
  const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
  const form = document.querySelector('#contactForm');
  const status = document.querySelector('#formStatus');
  const sendButton = document.querySelector('#sendButton');
  let isSending = false;

  if (window.emailjs && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (isSending) return;
    if (EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' || EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID' || EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
      status.textContent = 'EmailJS is ready to configure: add your Service ID, Template ID, and Public Key in js/script.js.';
      return;
    }
    isSending = true;
    sendButton.disabled = true;
    sendButton.innerHTML = 'Sending... <i class="bi bi-hourglass-split"></i>';
    status.textContent = '';
    try {
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);
      status.textContent = 'Message sent successfully.';
      form.reset();
    } catch (error) {
      status.textContent = 'Unable to send the message right now. Please try again.';
    } finally {
      isSending = false;
      sendButton.disabled = false;
      sendButton.innerHTML = 'Send Message <i class="bi bi-arrow-up-right"></i>';
    }
  });
});