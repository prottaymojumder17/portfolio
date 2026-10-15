/* ==================== CONTACT FORM ==================== */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const email = document.getElementById('email');
  const msg = document.getElementById('message');
  const formMsg = document.getElementById('formMessage');
  const submit = document.getElementById('submitBtn');
  const counter = document.getElementById('charCounter');

  msg.addEventListener('input', () => {
    const len = msg.value.length;
    counter.textContent = `${len} / 1000`;
    counter.style.color = len > 900 ? '#c85a5a' : 'var(--text-tertiary)';
  });

  const validateEmail = e => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(e.value)) e.classList.add('error');
    else e.classList.remove('error');
  };

  email.addEventListener('blur', () => validateEmail(email));
  email.addEventListener('focus', () => email.classList.remove('error'));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email.value)) {
      email.classList.add('error');
      return;
    }
    if (msg.value.trim().length < 10) return;

    submit.textContent = 'Sending...';
    submit.disabled = true;

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    })
      .then(r => {
        if (r.ok) {
          formMsg.textContent = 'Message sent successfully!';
          formMsg.className = 'form-message success';
          formMsg.style.display = 'block';
          form.reset();
          counter.textContent = '0 / 1000';
          setTimeout(() => (formMsg.style.display = 'none'), 5000);
        } else throw new Error();
      })
      .catch(() => {
        formMsg.textContent = 'Error sending message';
        formMsg.className = 'form-message error';
        formMsg.style.display = 'block';
        setTimeout(() => (formMsg.style.display = 'none'), 5000);
      })
      .finally(() => {
        submit.textContent = 'Send Message';
        submit.disabled = false;
      });
  });
})();
