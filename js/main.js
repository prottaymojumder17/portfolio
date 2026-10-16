/* ==================== MAIN ORCHESTRATION ==================== */

window.addEventListener('load', async () => {
  if (window.loadAllData) await window.loadAllData();

  setTimeout(() => {
    const loader = document.getElementById('loading-screen');
    if (loader) loader.classList.add('hidden');
    if (window.initAnimations) window.initAnimations();
    attachDynamicHandlers();
  }, 500);
});

/* ---- Navigation ---- */
window.scrollToSection = function (id) {
  const el = document.getElementById(id);
  if (el) {
    const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  }
};

function attachDynamicHandlers() {
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', e => {
      const id = el.getAttribute('data-nav');
      if (id && document.getElementById(id)) {
        e.preventDefault();
        window.scrollToSection(id);
        closeMobileMenu();
      }
    });
  });

  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenuIcon = document.getElementById('mobileMenuIcon');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    let lastToggleTime = 0;

    mobileMenuBtn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      lastToggleTime = Date.now();
      const isOpen = navLinks.classList.toggle('open');
      if (mobileMenuIcon) {
        mobileMenuIcon.setAttribute(
          'name',
          isOpen ? 'close-outline' : 'menu-outline'
        );
      }
    });

    document.addEventListener('click', e => {
      if (Date.now() - lastToggleTime < 300) return;
      if (!navLinks.classList.contains('open')) return;
      if (e.target.closest('.nav-links')) return;
      if (e.target.closest('#mobileMenuBtn')) return;
      closeMobileMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 992) closeMobileMenu();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMobileMenu();
    });
  }
}

function closeMobileMenu() {
  const navLinks = document.querySelector('.nav-links');
  const mobileMenuIcon = document.getElementById('mobileMenuIcon');
  if (navLinks) navLinks.classList.remove('open');
  if (mobileMenuIcon) mobileMenuIcon.setAttribute('name', 'menu-outline');
}

/* ---- Scroll tracking with section name ---- */
const backToTop = document.getElementById('back-to-top');
const navProgress = document.getElementById('navProgress');
const topNav = document.getElementById('topNav');

// Create section name indicator
// let sectionIndicator = null;
// if (topNav) {
//   sectionIndicator = document.createElement('span');
//   sectionIndicator.className = 'nav-progress-section';
//   topNav.appendChild(sectionIndicator);
// }

window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 150) {
      current = s.getAttribute('id');
    }
  });
  document.querySelectorAll('.nav-links a[data-nav]').forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('data-nav') === current) a.classList.add('active');
  });

  // // Update section indicator
  // if (sectionIndicator) {
  //   sectionIndicator.textContent = currentName;
  // }

  const total = document.documentElement.scrollHeight - window.innerHeight;
  const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
  if (navProgress) navProgress.style.width = progress + '%';

  if (topNav) {
    if (window.scrollY > 20) topNav.classList.add('scrolled');
    else topNav.classList.remove('scrolled');
  }

  if (backToTop) {
    if (window.scrollY > 500) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');
  }

  // Timeline progress
  updateTimelineProgress();
});

/* ---- Timeline progress line ---- */
function updateTimelineProgress() {
  const timelines = document.querySelectorAll('.timeline-list');
  timelines.forEach(timeline => {
    const rect = timeline.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const start = viewportH * 0.8;
    const end = viewportH * 0.2;
    const total = rect.height + (end - start);
    const visible = Math.max(0, start - rect.top);
    const percent = Math.min(100, (visible / total) * 100);
    timeline.style.setProperty('--timeline-progress', percent + '%');
  });
}

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---- Mouse tracking for card radial glow ---- */
document.addEventListener('mousemove', e => {
  const cards = document.querySelectorAll('.project-card, .skill-card');
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', x + '%');
    card.style.setProperty('--mouse-y', y + '%');
  });
});

/* ---- Touch support for mobile cards ---- */
document.addEventListener(
  'touchstart',
  e => {
    const card = e.target.closest(
      '.project-card, .skill-card, .publication-item, .timeline-item'
    );
    if (!card) return;
    document.querySelectorAll('.active-touch').forEach(el => {
      if (el !== card) el.classList.remove('active-touch');
    });
    card.classList.add('active-touch');
  },
  { passive: true }
);

document.addEventListener(
  'touchend',
  () => {
    setTimeout(() => {
      document
        .querySelectorAll('.active-touch')
        .forEach(el => el.classList.remove('active-touch'));
    }, 400);
  },
  { passive: true }
);

/* ---- Animations ---- */
window.initAnimations = function () {
  animateCounters();
  observeSections();
  initSkillBars();
  updateTimelineProgress();
};

const animateCounters = () => {
  document.querySelectorAll('.stat-number[data-target]').forEach(c => {
    const target = parseInt(c.getAttribute('data-target'));
    const suffix = c.getAttribute('data-suffix') || '';
    const step = target / 80;
    let current = 0;
    const update = () => {
      if ((current += step) < target) {
        c.textContent = Math.floor(current) + suffix;
        requestAnimationFrame(update);
      } else {
        c.textContent = target + suffix;
      }
    };
    setTimeout(update, 400);
  });
};

const observeSections = () => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('animate');
          const children = e.target.querySelectorAll(
            '.timeline-item, .project-card, .skill-card, .publication-item, .now-card'
          );
          children.forEach((child, idx) => {
            child.style.opacity = '0';
            child.style.animation = `fadeIn 0.5s ease forwards`;
            child.style.animationDelay = `${idx * 0.06}s`;
          });
        }
      });
    },
    { threshold: 0.1 }
  );
  document
    .querySelectorAll('article > section')
    .forEach(s => observer.observe(s));
};

const initSkillBars = () => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const bar = e.target;
          const width = bar.getAttribute('data-width');
          bar.style.setProperty('--target-width', width + '%');
          setTimeout(() => bar.classList.add('filled'), 100);
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );
  document
    .querySelectorAll('.skill-bar-fill')
    .forEach(b => observer.observe(b));
};

/* ---- Command Palette ---- */
const commandPalette = document.getElementById('commandPalette');
const commandInput = document.getElementById('commandInput');
const commandList = document.getElementById('commandList');

const commands = [
  { label: 'Go to About', icon: 'person-outline', section: 'profile-summary' },
  { label: 'Go to Now', icon: 'time-outline', section: 'now' },
  {
    label: 'Go to Research Interests',
    icon: 'bulb-outline',
    section: 'research-interests'
  },
  {
    label: 'Go to Publications',
    icon: 'newspaper-outline',
    section: 'publications'
  },
  {
    label: 'Go to Research Experience',
    icon: 'flask-outline',
    section: 'experience'
  },
  {
    label: 'Go to Projects',
    icon: 'folder-open-outline',
    section: 'projects-done'
  },
  { label: 'Go to Skills', icon: 'sparkles-outline', section: 'top-skills' },
  { label: 'Go to Awards', icon: 'trophy-outline', section: 'awards' },
  { label: 'Go to Teaching', icon: 'school-outline', section: 'teaching' },
  { label: 'Go to Education', icon: 'book-outline', section: 'education' },
  { label: 'Go to Contact', icon: 'mail-outline', section: 'contact' },
  { label: 'Download CV', icon: 'download-outline', action: 'download' },
  { label: 'Toggle Theme', icon: 'contrast-outline', action: 'theme' },
  { label: 'Google Scholar', icon: 'school-outline', action: 'scholar' },
  { label: 'ResearchGate', icon: 'flask-outline', action: 'researchgate' },
  { label: 'ORCID', icon: 'finger-print-outline', action: 'orcid' },
  { label: 'LinkedIn', icon: 'logo-linkedin', action: 'linkedin' },
  { label: 'GitHub', icon: 'logo-github', action: 'github' },
  { label: 'Send Email', icon: 'mail-outline', action: 'email' }
];

let filteredCommands = [...commands];
let activeIndex = 0;

const renderCommands = () => {
  if (!commandList) return;
  if (filteredCommands.length === 0) {
    commandList.innerHTML = '<li class="no-results">No results found</li>';
    return;
  }
  commandList.innerHTML = filteredCommands
    .map(
      (cmd, i) => `
      <li data-index="${i}" class="${i === activeIndex ? 'active' : ''}">
        <ion-icon name="${cmd.icon}"></ion-icon>
        <span>${cmd.label}</span>
      </li>`
    )
    .join('');
  commandList.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', () =>
      executeCommand(filteredCommands[+li.dataset.index])
    );
  });
};

const executeCommand = cmd => {
  closePalette();
  if (!cmd) return;
  if (cmd.section) {
    window.scrollToSection(cmd.section);
  } else if (cmd.action === 'download') {
    window.location.href = 'resume.pdf';
  } else if (cmd.action === 'theme') {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
      themeIcon.setAttribute(
        'name',
        isLight ? 'sunny-outline' : 'moon-outline'
      );
    }
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  } else if (cmd.action === 'scholar') {
    window.open('https://scholar.google.com/', '_blank');
  } else if (cmd.action === 'researchgate') {
    window.open('https://www.researchgate.net/', '_blank');
  } else if (cmd.action === 'orcid') {
    window.open('https://orcid.org/', '_blank');
  } else if (cmd.action === 'linkedin') {
    window.open(
      'https://www.linkedin.com/in/prottay-mojumder-154296377/',
      '_blank'
    );
  } else if (cmd.action === 'github') {
    window.open('https://github.com/prottaymojumder17', '_blank');
  } else if (cmd.action === 'email') {
    window.location.href = 'mailto:prottaymojumder695@gmail.com';
  }
};

const openPalette = () => {
  if (!commandPalette) return;
  commandPalette.classList.add('open');
  commandPalette.setAttribute('aria-hidden', 'false');
  commandInput.value = '';
  filteredCommands = [...commands];
  activeIndex = 0;
  renderCommands();
  setTimeout(() => commandInput.focus(), 100);
};

const closePalette = () => {
  if (!commandPalette) return;
  commandPalette.classList.remove('open');
  commandPalette.setAttribute('aria-hidden', 'true');
};

document.getElementById('openPalette')?.addEventListener('click', openPalette);
document.getElementById('openPalette2')?.addEventListener('click', openPalette);
document
  .querySelectorAll('[data-close-palette]')
  .forEach(el => el.addEventListener('click', closePalette));

document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if (commandPalette?.classList.contains('open')) closePalette();
    else openPalette();
    return;
  }
  if (!commandPalette?.classList.contains('open')) return;

  if (e.key === 'Escape') closePalette();
  else if (e.key === 'ArrowDown') {
    e.preventDefault();
    activeIndex = (activeIndex + 1) % filteredCommands.length;
    renderCommands();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    activeIndex =
      (activeIndex - 1 + filteredCommands.length) % filteredCommands.length;
    renderCommands();
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (filteredCommands[activeIndex])
      executeCommand(filteredCommands[activeIndex]);
  }
});

if (commandInput) {
  commandInput.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    filteredCommands = commands.filter(c => c.label.toLowerCase().includes(q));
    activeIndex = 0;
    renderCommands();
  });
}
