import { get, set } from '@/utils/localStorage';
import { themeConfig } from '~/theme.config';
import type { UserTheme } from '~/types/user-theme';

// Expressive Code theme names (per mode) used as the `data-theme` value so that
// code blocks render with the matching theme. Derived from `theme.config.ts`.
const EC_THEME_LIGHT = themeConfig.expressiveCodeThemes?.light as string;
const EC_THEME_DARK = (themeConfig.expressiveCodeThemes?.dark || EC_THEME_LIGHT) as string;

/**
 * Applies the given theme to the <html> element: toggles the `dark` class and
 * sets `data-theme` to the Expressive Code theme name for that mode.
 */
const applyTheme = (theme: UserTheme) => {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  if (EC_THEME_LIGHT !== undefined && EC_THEME_DARK !== undefined) {
    root.setAttribute('data-theme', theme === 'dark' ? EC_THEME_DARK : EC_THEME_LIGHT);
  }
};

/**
 * Inline script run synchronously in <head> before first paint to prevent theme flash.
 * Dark mode is disabled - the light Expressive Code theme is always applied and the
 * `dark` class is never set. Must be self-contained (no imports) - injected via
 * `set:html` in base.astro. The theme name is interpolated at build time from
 * `theme.config.ts`.
 */
export const THEME_INIT_SCRIPT = `(function(){document.documentElement.setAttribute('data-theme','${EC_THEME_LIGHT}')})();`;

function getSystemPreference(): UserTheme {
  // dark mode is disabled - ignore the system preference and fall back to light
  return 'light';
}

export const getUserTheme = (): UserTheme => {
  // try to get the theme from local storage, but never honor a stored dark theme
  let theme = get('user-theme') as UserTheme;
  if (theme !== 'light') {
    theme = getSystemPreference();
    void set('user-theme', theme);
  }
  // adjust the html element (dark class + data-theme) before returning the theme
  applyTheme(theme);
  return theme;
};

export const setUserTheme = (theme: UserTheme) => {
  // save the theme to local storage (async, non-blocking)
  void set('user-theme', theme);
  // adjust the html element (dark class + data-theme)
  applyTheme(theme);
};
