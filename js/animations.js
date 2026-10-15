/* ==================== TYPING + COUNTER + SCROLL + SKILL BARS ==================== */

/* Typing */
const typeWriter = (el, text, speed, cb) => {
  let i = 0;
  el.innerHTML = '';
  const type = () => {
    if (i < text.length) {
      el.innerHTML += text.charAt(i++);
      setTimeout(type, speed);
    } else if (cb) cb();
  };
  type();
};

window.initAnimations = function () {
  const name = document.getElementById('typed-name');
  const desc = document.getElementById('typed-description');
  if (name && desc) {
    typeWriter(name, 'Prottay Mojumder', 100, () => {
      name.innerHTML += '<span class="typing-cursor"></span>';
      setTimeout(
        () =>
          typeWriter(
            desc,
            'Early-stage Software Engineering Student passionate about learning, research, and global academic opportunities.',
            30
          ),
        300
      );
    });
  }
  animateCounters();
  observeSections();
  initSkillBars();
};

/* Counter */
const animateCounters = () => {
  document.querySelectorAll('.stat-number[data-target]').forEach(c => {
    const target = parseInt(c.getAttribute('data-target'));
    const suffix = c.getAttribute('data-suffix') || '';
    const step = target / 100;
    let current = 0;
    const update = () => {
      if ((current += step) < target) {
        c.textContent = Math.floor(current) + suffix;
        requestAnimationFrame(update);
      } else {
        c.textContent = target + suffix;
      }
    };
    setTimeout(update, 500);
  });
};

/* Scroll animations */
const observeSections = () => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('animate');
          const children = e.target.querySelectorAll(
            '.timeline-item, .project-card, .skill-card, .publication-item'
          );
          children.forEach((child, idx) => {
            child.style.opacity = '0';
            child.style.animation = `fadeIn 0.6s ease forwards`;
            child.style.animationDelay = `${idx * 0.08}s`;
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

/* Skill bars */
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
