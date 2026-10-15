/* ==================== FILTERS + TIMELINE + PUBLICATIONS ==================== */

document.addEventListener('click', e => {
  const tab = e.target.closest('.skill-tab');
  if (tab) {
    document
      .querySelectorAll('.skill-tab')
      .forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.getAttribute('data-tab');
    document.querySelectorAll('.skill-card').forEach(card => {
      if (filter === 'all' || card.getAttribute('data-category') === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }

  const fbtn = e.target.closest('.filter-btn');
  if (fbtn) {
    document
      .querySelectorAll('.filter-btn')
      .forEach(b => b.classList.remove('active'));
    fbtn.classList.add('active');
    const filter = fbtn.getAttribute('data-filter');
    document.querySelectorAll('#projectGrid .project-card').forEach(card => {
      if (filter === 'all' || card.getAttribute('data-category') === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }

  const tabBtn = e.target.closest('.toggle-all-btn');
  if (tabBtn) {
    const sectionId = tabBtn.getAttribute('data-target');
    const section = document.getElementById(sectionId);
    if (!section) return;
    const items = section.querySelectorAll('.timeline-item');
    const allCollapsed = [...items].every(i =>
      i.classList.contains('collapsed')
    );
    items.forEach(i => {
      if (allCollapsed) i.classList.remove('collapsed');
      else i.classList.add('collapsed');
    });
    tabBtn.innerHTML = allCollapsed
      ? '<ion-icon name="chevron-up-outline"></ion-icon> Collapse All'
      : '<ion-icon name="chevron-down-outline"></ion-icon> Expand All';
  }

  const timelineItem = e.target.closest('.timeline-item');
  if (
    timelineItem &&
    !e.target.closest('a') &&
    !e.target.closest('.toggle-all-btn')
  ) {
    timelineItem.classList.toggle('collapsed');
  }
});

window.togglePublication = function (el) {
  el.classList.toggle('expanded');
};
