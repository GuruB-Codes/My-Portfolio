/**
 * GURULINGAPPA PORTFOLIO - GITHUB STATS & PROFILE RENDERER
 * Automatically fetches live GitHub contributions securely without exposing API keys.
 */

// Centralized Configuration - Configure GitHub username and fallback parameters here
const GITHUB_CONFIG = {
  username: 'GuruB-Codes',
  fallbackContributions: 120,
  cacheDurationMs: 15 * 60 * 1000, // 15 minutes client cache
  endpoints: [
    {
      name: 'Vercel API',
      url: (username) => `https://github-contributions.vercel.app/api/v1/${username}`,
      parse: (data) => {
        if (data && Array.isArray(data.years)) {
          return data.years.reduce((acc, y) => acc + (Number(y.total) || 0), 0);
        }
        return null;
      }
    },
    {
      name: 'JoGruber API',
      url: (username) => `https://github-contributions-api.jogruber.de/v4/${username}?y=all`,
      parse: (data) => {
        if (data && data.total && typeof data.total === 'object') {
          return Object.values(data.total).reduce((acc, count) => acc + (Number(count) || 0), 0);
        }
        if (data && Array.isArray(data.contributions)) {
          return data.contributions.reduce((acc, day) => acc + (Number(day.count) || 0), 0);
        }
        return null;
      }
    }
  ]
};

// Expose config globally for portfolio scripts
window.GITHUB_CONFIG = GITHUB_CONFIG;

/**
 * Safely fetches the total GitHub contribution count using public CORS endpoints.
 * Includes caching and fallback handling to ensure 100% uptime.
 */
async function fetchLiveGitHubContributions(username = GITHUB_CONFIG.username) {
  const cacheKey = `gh_contribs_${username}`;

  // 1. Try Cache First for instant rendering
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && typeof parsed.count === 'number' && (Date.now() - parsed.timestamp) < GITHUB_CONFIG.cacheDurationMs) {
        return parsed.count;
      }
    }
  } catch (e) {
    // Storage access may fail in restricted/sandboxed environments; proceed to fetch
  }

  // 2. Fetch from available endpoints with timeout
  for (const endpoint of GITHUB_CONFIG.endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(endpoint.url(username), {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });
      clearTimeout(timeoutId);

      if (!response.ok) continue;

      const data = await response.json();
      const totalCount = endpoint.parse(data);

      if (typeof totalCount === 'number' && !isNaN(totalCount) && totalCount >= 0) {
        try {
          localStorage.setItem(cacheKey, JSON.stringify({ count: totalCount, timestamp: Date.now() }));
        } catch (e) {}
        return totalCount;
      }
    } catch (err) {
      // Endpoint error, try next fallback
    }
  }

  // 3. Fallback to default static value if all endpoints fail
  return GITHUB_CONFIG.fallbackContributions;
}

/**
 * Updates the stats banner counter with the live GitHub contributions value.
 */
async function updateDynamicGitHubContributions() {
  const statEl = document.getElementById('github-contribs-stat');
  if (!statEl) return;

  try {
    const liveCount = await fetchLiveGitHubContributions(GITHUB_CONFIG.username);
    if (typeof liveCount !== 'number' || isNaN(liveCount)) return;

    // Update target for intersection observer
    statEl.setAttribute('data-target', liveCount);

    // If counter has already animated or is in viewport, smoothly animate to the live count
    if (statEl.hasAttribute('data-animated') || (statEl.textContent && statEl.textContent !== '0')) {
      if (typeof window.animateCounterElement === 'function') {
        window.animateCounterElement(statEl, liveCount);
      } else {
        statEl.textContent = liveCount;
      }
    }
  } catch (error) {
    console.warn('Could not update live GitHub contributions, using fallback:', error);
  }
}

/**
 * Initializes the GitHub Showcase section if present on the page.
 */
async function initGitHubStats() {
  // Update the stats banner counter dynamically
  updateDynamicGitHubContributions();

  const container = document.getElementById('github-showcase');
  if (!container) return;

  const data = await fetchJSONData('data/github.json');
  if (!data) return;

  // Use live contribution count if available
  const liveCount = await fetchLiveGitHubContributions(data.username || GITHUB_CONFIG.username);
  const displayContribs = liveCount || data.totalContributions || GITHUB_CONFIG.fallbackContributions;

  container.innerHTML = `
    <div class="github-stats-grid">
      <!-- Left User Bio Card -->
      <div class="glass-card github-user-card reveal-left">
        <img src="assets/profile/avatar.svg" alt="GitHub Avatar" class="github-avatar">
        <h3>@${data.username || GITHUB_CONFIG.username}</h3>
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
            <div style="font-weight: 800; font-size: 1.3rem; color: var(--accent-cyan);">${displayContribs}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">CONTRIBS</div>
          </div>
        </div>
      </div>

      <!-- Right Languages & Activity Breakdown -->
      <div class="glass-card reveal-right">
        <h4 style="margin-bottom: 16px; color: var(--accent-cyan);">Top Languages</h4>
        <div style="margin-bottom: 24px;">
          ${(data.languages || []).map(l => `
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
          ${(data.recentCommits || []).map(c => `
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
      ${(data.pinnedRepos || []).map(r => `
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

// Auto-run on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGitHubStats);
} else {
  initGitHubStats();
}
