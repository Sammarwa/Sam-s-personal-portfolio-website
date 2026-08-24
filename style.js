document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    .reveal {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.7s ease, transform 0.7s ease;
    }

    .reveal.visible {
      opacity: 1;
      transform: translateY(0);
    }

    nav {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: #fff;
      padding: 1rem 0;
    }

    nav ul {
      display: flex;
      gap: 1rem;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    nav a.active {
      color: #2563eb;
      font-weight: 700;
    }

    .menu-toggle {
      display: none;
      margin-left: auto;
      background: #111827;
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 0.6rem 0.9rem;
      cursor: pointer;
    }

    @media (max-width: 768px) {
      .menu-toggle {
        display: block;
      }

      nav ul {
        display: none;
        flex-direction: column;
        background: #fff;
        padding: 1rem;
        position: absolute;
        right: 1rem;
        top: 3.2rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      }

      nav ul.open {
        display: flex;
      }
    }
  `;
  document.head.appendChild(style);

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
    toggleButton.innerHTML = '☰';
    nav.insertBefore(toggleButton, navList);

    toggleButton.addEventListener('click', () => {
      navList.classList.toggle('open');
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
});
