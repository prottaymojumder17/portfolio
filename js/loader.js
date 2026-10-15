/* ==================== JSON DATA LOADER ==================== */

async function fetchJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

/* ---------- Header ---------- */
function renderHeader(site) {
  const img = document.getElementById('profileImage');
  const name = document.getElementById('profileName');
  const tagline = document.getElementById('profileTagline');
  const resumeBtn = document.getElementById('resumeBtn');
  const statsContainer = document.getElementById('statsContainer');
  const contactPrimary = document.getElementById('contactInfoPrimary');
  const contactSocial = document.getElementById('contactInfoSocial');

  if (img) {
    img.src = site.profileImage || 'img/main.jpg';
    img.alt = site.name || 'Profile';
  }
  if (name) name.textContent = site.name || '';
  if (tagline) tagline.textContent = site.tagline || '';
  if (resumeBtn && site.resumeLink) resumeBtn.href = site.resumeLink;

  if (statsContainer && site.stats) {
    statsContainer.innerHTML = site.stats
      .map(
        s => `
      <div class="stat-item">
        <div class="stat-number" data-target="${s.number}" data-suffix="${s.suffix || ''}">0</div>
        <div class="stat-label">${s.label}</div>
      </div>`
      )
      .join('');
  }

  if (contactPrimary && site.contactInfo) {
    contactPrimary.innerHTML = site.contactInfo
      .map(
        c => `
      <li>
        <ion-icon name="${c.icon}"></ion-icon>
        ${c.link ? `<a href="${c.link}">${c.text}</a>` : c.text}
      </li>`
      )
      .join('');
  }

  if (contactSocial && site.socialLinks) {
    contactSocial.innerHTML = site.socialLinks
      .map(
        s => `
      <li>
        <ion-icon name="${s.icon}"></ion-icon>
        <a href="${s.link}" target="_blank" rel="noopener">${s.text}</a>
      </li>`
      )
      .join('');
  }
}

/* ---------- Currently Working On ---------- */
function renderNow(data) {
  const grid = document.getElementById('nowGrid');
  const updated = document.getElementById('nowUpdated');
  if (!grid) return;

  if (updated && data.updated) {
    updated.textContent = `Updated ${data.updated}`;
  }

  grid.innerHTML = data.items
    .map(
      item => `
    <li class="now-card">
      <ion-icon name="${item.icon}" class="now-icon"></ion-icon>
      <div class="now-content">
        <span class="now-label">${item.label}</span>
        <span class="now-value">${item.value}</span>
      </div>
    </li>`
    )
    .join('');
}

/* ---------- Profile Summary ---------- */
function renderProfileSummary(site) {
  const container = document.getElementById('profileSummaryContainer');
  if (!container || !site.profileSummary) return;
  container.innerHTML = site.profileSummary.map(p => `<p>${p}</p>`).join('');
}

/* ---------- Research Interests ---------- */
function renderResearch(data) {
  const container = document.getElementById('researchGrid');
  if (!container) return;
  container.innerHTML = data.areas
    .map(
      a => `
    <li class="project-card">
      <div class="project-card-content">
        <ion-icon name="${a.icon}" class="project-icon"></ion-icon>
        <h3 class="project-title">${a.title}</h3>
        <p class="project-description">${a.description}</p>
      </div>
    </li>`
    )
    .join('');
}

/* ---------- Awards ---------- */
function renderAwards(data) {
  const container = document.getElementById('awardsGrid');
  if (!container) return;
  container.innerHTML = data
    .map(
      a => `
    <li class="project-card">
      <div class="project-card-content">
        <ion-icon name="${a.icon}" class="project-icon"></ion-icon>
        <h3 class="project-title">${a.title}</h3>
        <span class="meta-line">${a.meta}</span>
        <p class="project-description">${a.description}</p>
      </div>
    </li>`
    )
    .join('');
}

/* ---------- Teaching ---------- */
function renderTeaching(data) {
  const container = document.getElementById('teachingList');
  if (!container) return;
  container.innerHTML = data
    .map(
      t => `
    <li class="timeline-item">
      <h4 class="timeline-item-title">${t.title}</h4>
      <span class="meta">${t.meta}</span>
      <div class="timeline-text">
        <p>${t.description}</p>
      </div>
    </li>`
    )
    .join('');
}

/* ---------- Skills ---------- */
function renderSkills(skillsData) {
  const tabsEl = document.getElementById('skillTabs');
  const gridEl = document.getElementById('skillsGrid');
  if (!tabsEl || !gridEl) return;

  if (skillsData.tabs) {
    tabsEl.innerHTML = skillsData.tabs
      .map(
        (t, i) =>
          `<button class="skill-tab ${i === 0 ? 'active' : ''}" data-tab="${t.id}">${t.label}</button>`
      )
      .join('');
  }

  if (skillsData.skills) {
    gridEl.innerHTML = skillsData.skills
      .map(
        s => `
      <li class="skill-card" data-category="${s.category}">
        <div class="skill-header"><span class="skill-name">${s.name}</span></div>
        <div class="skill-bar-bg">
          <div class="skill-bar-fill" data-width="${s.level}"></div>
        </div>
      </li>`
      )
      .join('');
  }
}

/* ---------- Timeline (experience/education) ---------- */
function renderTimeline(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = items
    .map(
      exp => `
    <li class="timeline-item">
      <h4 class="timeline-item-title">${exp.title}</h4>
      <span class="meta">${exp.meta}</span>
      <div class="timeline-text">
        <ul>${exp.points.map(p => `<li>${p}</li>`).join('')}</ul>
      </div>
    </li>`
    )
    .join('');
}

/* ---------- Projects ---------- */
function renderProjects(projects) {
  const container = document.getElementById('projectGrid');
  if (!container) return;
  container.innerHTML = projects
    .map(
      p => `
    <li class="project-card" data-category="${p.category}">
      <div class="project-card-content">
        <ion-icon name="${p.icon}" class="project-icon"></ion-icon>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-description">${p.description}</p>
        <div class="project-tags">${(p.tags || []).map(t => `<span>${t}</span>`).join('')}</div>
        ${p.link ? `<a href="${p.link}" target="_blank" rel="noopener" class="project-link">View Details<ion-icon name="arrow-forward-outline"></ion-icon></a>` : ''}
      </div>
    </li>`
    )
    .join('');
}

/* ---------- Publications (with type badge + BibTeX) ---------- */
function renderPublications(pubs) {
  const container = document.getElementById('publicationList');
  const countEl = document.getElementById('publicationsCount');
  if (!container) return;

  if (countEl) {
    countEl.textContent = `${pubs.length} papers · Peer-reviewed`;
  }

  container.innerHTML = pubs
    .map((pub, idx) => {
      const typeClass = (pub.type || 'journal').toLowerCase();
      return `
    <li class="publication-item">
      <span class="pub-type-badge ${typeClass}">${pub.type || 'Journal'}</span>
      <p style="display:inline;">${pub.text} <i><a href="${pub.journalLink}" target="_blank" rel="noopener">${pub.journal}</a></i>, ${pub.volume}.<span class="citation">${pub.citation}</span></p>
      ${pub.conference ? `<div class="publication-details"><p><strong>Conference:</strong> ${pub.conference}</p></div>` : ''}
      <div class="pub-actions">
        <button class="pub-action-btn" data-bibtex-idx="${idx}" onclick="copyBibtex(event, ${idx})">
          <ion-icon name="copy-outline"></ion-icon>
          <span>BibTeX</span>
        </button>
        <a class="pub-action-btn" href="${pub.journalLink}" target="_blank" rel="noopener">
          <ion-icon name="open-outline"></ion-icon>
          <span>View Paper</span>
        </a>
        ${
          pub.conference
            ? `<button class="pub-action-btn" onclick="togglePubDetails(this)">
          <ion-icon name="chevron-down-outline"></ion-icon>
          <span>Details</span>
        </button>`
            : ''
        }
      </div>
      <div class="publication-details" data-details-idx="${idx}">
        <p><strong>Conference:</strong> ${pub.conference || ''}</p>
      </div>
    </li>`;
    })
    .join('');

  // Store bibtex data globally for copy function
  window.__bibtexData = pubs.map(p => p.bibtex || '');
}

window.copyBibtex = function (e, idx) {
  e.stopPropagation();
  const bibtex = (window.__bibtexData && window.__bibtexData[idx]) || '';
  if (!bibtex) return;

  navigator.clipboard
    .writeText(bibtex)
    .then(() => {
      const btn = e.currentTarget;
      const span = btn.querySelector('span');
      const originalText = span.textContent;
      btn.classList.add('copied');
      span.textContent = 'Copied!';
      setTimeout(() => {
        btn.classList.remove('copied');
        span.textContent = originalText;
      }, 1800);
    })
    .catch(err => {
      console.error('Copy failed:', err);
    });
};

window.togglePubDetails = function (btn) {
  const item = btn.closest('.publication-item');
  if (!item) return;
  item.classList.toggle('expanded');
};

/* ---------- Master load ---------- */
window.loadAllData = async function () {
  try {
    const [
      site,
      now,
      research,
      publications,
      experience,
      projects,
      skills,
      awards,
      teaching,
      education
    ] = await Promise.all([
      fetchJSON('data/site.json'),
      fetchJSON('data/now.json'),
      fetchJSON('data/research.json'),
      fetchJSON('data/publications.json'),
      fetchJSON('data/experience.json'),
      fetchJSON('data/projects.json'),
      fetchJSON('data/skills.json'),
      fetchJSON('data/awards.json'),
      fetchJSON('data/teaching.json'),
      fetchJSON('data/education.json')
    ]);

    renderHeader(site);
    renderNow(now);
    renderProfileSummary(site);
    renderResearch(research);
    renderPublications(publications);
    renderTimeline('experienceList', experience);
    renderProjects(projects);
    renderSkills(skills);
    renderAwards(awards);
    renderTeaching(teaching);
    renderTimeline('educationList', education);

    return true;
  } catch (err) {
    console.error('Data loading error:', err);
    return false;
  }
};
