/**
 * GURULINGAPPA PORTFOLIO - GITHUB STATS & PROFILE RENDERER
 */

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGitHubStats);
} else {
  initGitHubStats();
}

async function initGitHubStats() {
  const container = document.getElementById('github-showcase');
  if (!container) return;

  const data = await fetchJSONData('data/github.json');
  if (!data) return;

  container.innerHTML = `
    <div class="github-stats-grid">
      <!-- Left User Bio Card -->
      <div class="glass-card github-user-card reveal-left">
        <img src="assets/profile/avatar.svg" alt="GitHub Avatar" class="github-avatar">
        <h3>@${data.username}</h3>
        <p style="margin: 8px 0 16px; font-size: 0.9rem;">${data.bio}</p>
        <div style="display: flex; justify-content: space-around; padding: 16px 0; border-top: var(--border-subtle);">
          <div>
            <div style="font-weight: 800; font-size: 1.3rem; color: var(--accent-cyan);">${data.publicRepos}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">REPOS</div>
          </div>
          <div>
            <div style="font-weight: 800; font-size: 1.3rem; color: var(--accent-cyan);">${data.followers}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">FOLLOWERS</div>
          </div>
          <div>
            <div style="font-weight: 800; font-size: 1.3rem; color: var(--accent-cyan);">${data.totalContributions}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">CONTRIBS</div>
          </div>
        </div>
      </div>

      <!-- Right Languages & Activity Breakdown -->
      <div class="glass-card reveal-right">
        <h4 style="margin-bottom: 16px; color: var(--accent-cyan);">Top Languages</h4>
        <div style="margin-bottom: 24px;">
          ${data.languages.map(l => `
            <div style="margin-bottom: 10px;">
              <div style="display: flex; justify-content: space-between; font-size: 0.88rem; font-weight: 600; margin-bottom: 4px;">
                <span><span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${l.color}; margin-right: 6px;"></span>${l.name}</span>
                <span>${l.percentage}%</span>
              </div>
              <div class="skill-progress-bg">
                <div class="skill-progress-fill" style="width: ${l.percentage}%; background: ${l.color};"></div>
              </div>
            </div>
          `).join('')}
        </div>

        <h4 style="margin-bottom: 12px; color: var(--accent-cyan);">Recent Activity</h4>
        <div>
          ${data.recentCommits.map(c => `
            <div style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.88rem;">
              <span style="color: var(--accent-blue); font-weight: 600;">${c.repo}:</span> ${c.message}
              <span style="float: right; color: var(--text-dim); font-size: 0.78rem;">${c.date}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Pinned Repositories Grid -->
    <h3 style="margin-bottom: 20px; text-align: center;">Pinned Repositories</h3>
    <div class="pinned-repos-grid">
      ${data.pinnedRepos.map(r => `
        <div class="glass-card repo-card reveal">
          <div class="repo-header">
            <span class="repo-name">📁 ${r.name}</span>
            <span style="font-size: 0.8rem; color: var(--accent-cyan);">★ ${r.stars}</span>
          </div>
          <p style="font-size: 0.88rem; margin-bottom: 16px; color: var(--text-muted);">${r.description}</p>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.78rem; font-family: var(--font-mono); color: var(--text-dim);">${r.language}</span>
            <a href="${r.url}" target="_blank" rel="noopener" class="btn btn-secondary" style="padding: 4px 12px; font-size: 0.78rem;">View</a>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  if (typeof initScrollReveals === 'function') initScrollReveals();
}
