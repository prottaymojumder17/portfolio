/* ==================== THEME TOGGLE ==================== */
(function () {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  if (!themeToggle) {
    console.warn('Theme toggle button not found');
    return;
  }

  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    if (themeIcon) themeIcon.setAttribute('name', 'sunny-outline');
  } else {
    document.body.classList.remove('light-theme');
    if (themeIcon) themeIcon.setAttribute('name', 'moon-outline');
  }

  themeToggle.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    if (themeIcon) {
      themeIcon.setAttribute(
        'name',
        isLight ? 'sunny-outline' : 'moon-outline'
      );
    }
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
})();
