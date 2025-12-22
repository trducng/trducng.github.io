(function() {
  'use strict';

  // Get current theme
  function getCurrentTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme || (systemPrefersDark ? 'dark' : 'light');
  }

  // Set theme
  function setTheme(theme, savePreference = true) {
    document.documentElement.setAttribute('data-theme', theme);

    if (savePreference) {
      localStorage.setItem('theme', theme);
    }

    updateToggleButton(theme);
  }

  // Update button icon and aria-label
  function updateToggleButton(theme) {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    const icon = getLightBulbIcon();

    toggle.setAttribute('aria-label', label);
    toggle.setAttribute('title', label);
    toggle.innerHTML = icon;
  }

  // Light bulb icon (same for both modes)
  function getLightBulbIcon() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
      <!-- Bulb -->
      <path d="M12 2a5 5 0 0 1 5 5c0 2-1 3-2 4v2H9v-2c-1-1-2-2-2-4a5 5 0 0 1 5-5z"/>
      <!-- Base -->
      <path d="M9 17h6"/>
      <path d="M10 20h4"/>
    </svg>`;
  }

  // Toggle theme
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next, true);
  }

  // Listen for system preference changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', function(e) {
    // Only auto-switch if user hasn't made an explicit choice
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light', false);
    }
  });

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    const currentTheme = getCurrentTheme();
    setTheme(currentTheme, false);

    // Add click handler
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', toggleTheme);

      // Keyboard accessibility
      toggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleTheme();
        }
      });
    }
  });
})();
