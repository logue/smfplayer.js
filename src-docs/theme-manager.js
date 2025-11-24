import { CONSTANTS } from './constants.js';

/**
 * Theme Manager
 */
export class ThemeManager {
  constructor(player) {
    this.player = player;
  }

  getStoredTheme() {
    return localStorage.getItem('theme');
  }

  setStoredTheme(theme) {
    localStorage.setItem('theme', theme);
  }

  getPreferredTheme() {
    const storedTheme = this.getStoredTheme();
    if (storedTheme) {
      return storedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  setTheme(theme) {
    const effectiveTheme =
      theme === 'auto' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : theme;

    document.documentElement.dataset.bsTheme = effectiveTheme;

    const midiMessage =
      CONSTANTS.THEME_MIDI_MESSAGES[theme] ||
      CONSTANTS.THEME_MIDI_MESSAGES.auto;
    this.player.sendRawMidiMessage(midiMessage);
  }

  showActiveTheme(theme, focus = false) {
    const themeSwitcher = document.querySelector('#bd-theme');
    if (!themeSwitcher) return;

    const themeSwitcherText = document.querySelector('#bd-theme-text');
    const activeThemeIcon = document.querySelector('.theme-icon-active use');
    const btnToActive = document.querySelector(
      `[data-bs-theme-value="${theme}"]`
    );

    if (!btnToActive) return;

    const svgOfActiveBtn = btnToActive
      .querySelector('svg use')
      .getAttribute('href');

    document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
      element.classList.remove('active');
      element.setAttribute('aria-pressed', 'false');
    });

    btnToActive.classList.add('active');
    btnToActive.setAttribute('aria-pressed', 'true');
    activeThemeIcon.setAttribute('href', svgOfActiveBtn);

    const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`;
    themeSwitcher.setAttribute('aria-label', themeSwitcherLabel);

    if (focus) {
      themeSwitcher.focus();
    }
  }

  initialize() {
    this.setTheme(this.getPreferredTheme());
    this.showActiveTheme(this.getPreferredTheme());

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        const storedTheme = this.getStoredTheme();
        if (storedTheme !== 'light' && storedTheme !== 'dark') {
          this.setTheme(this.getPreferredTheme());
        }
      });

    document.querySelectorAll('[data-bs-theme-value]').forEach(toggle => {
      toggle.addEventListener('click', () => {
        const theme = toggle.getAttribute('data-bs-theme-value');
        this.setStoredTheme(theme);
        this.setTheme(theme);
        this.showActiveTheme(theme, true);
      });
    });
  }
}
