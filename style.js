document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', targetId);
    });
  });

  const revealTargets = document.querySelectorAll('section, table, footer');
  revealTargets.forEach((element) => element.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach((element) => revealObserver.observe(element));

  const nav = document.querySelector('nav');
  const navList = nav ? nav.querySelector('ul') : null;

  if (nav && navList) {
    const toggleButton = document.createElement('button');
    toggleButton.className = 'menu-toggle';
    toggleButton.setAttribute('aria-label', 'Toggle navigation');
    toggleButton.textContent = 'Menu';
    toggleButton.setAttribute('aria-expanded', 'false');
    nav.insertBefore(toggleButton, navList);

    toggleButton.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('open');
      toggleButton.setAttribute('aria-expanded', String(isOpen));
    });
  }

  const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
  const sections = Array.from(document.querySelectorAll('section[id], table[id]'));

  const activateNavLink = () => {
    const scrollPosition = window.scrollY + 140;
    let currentId = '';

    sections.forEach((section) => {
      if (scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${currentId}`);
    });
  };

  window.addEventListener('scroll', activateNavLink);
  activateNavLink();

  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  const contactForm = document.querySelector('.contact-form');
  const formStatus = document.querySelector('.form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const formAction = contactForm.getAttribute('action') || '';

      formStatus.className = 'form-status';
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';

      if (formAction.startsWith('https://formspree.io/')) {
        try {
          const response = await fetch(formAction, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: { Accept: 'application/json' }
          });

          if (!response.ok) throw new Error('Form submission failed');
          formStatus.textContent = 'Message sent successfully. Thank you for getting in touch.';
          contactForm.reset();
        } catch (error) {
          formStatus.textContent = 'The message could not be sent. Please try again later.';
          formStatus.classList.add('error');
        }
      } else {
        formStatus.textContent = 'Your message is ready. Connect this form to Formspree to send it directly from the website.';
        contactForm.reset();
      }

      formStatus.classList.add('show');
      submitButton.disabled = false;
      submitButton.textContent = 'Send Message';
    });
  }
});
