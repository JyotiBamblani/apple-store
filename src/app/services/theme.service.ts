import { Injectable, signal, effect, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/** Theme mode: 'light' or 'dark' */
export type ThemeMode = 'light' | 'dark';

/** Local storage key for theme preference */
const THEME_KEY = 'apple-store-theme';

/** Detect whether we are running in a browser (localStorage is available). */
const IS_BROWSER: boolean =
  typeof window !== 'undefined' && typeof localStorage !== 'undefined';

/**
 * Theme service: manages light/dark mode with localStorage persistence
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private platformId = inject(PLATFORM_ID);

  /** Current theme mode signal */
  private themeSignal = signal<ThemeMode>(this.loadTheme());

  /** Read-only theme signal */
  theme = this.themeSignal.asReadonly();

  /** Check if current theme is dark (computed from theme signal) */
  isDark = computed(() => this.themeSignal() === 'dark');

  constructor() {
    // Apply theme to document on changes
    effect(() => {
      const mode = this.themeSignal();
      if (IS_BROWSER) {
        this.applyTheme(mode);
      }
    });

    // Initialize theme on service creation (browser only)
    if (IS_BROWSER) {
      this.applyTheme(this.themeSignal());
    }
  }

  /**
   * Load theme from localStorage or system preference
   */
  private loadTheme(): ThemeMode {
    if (!IS_BROWSER) {
      return 'light'; // Default for SSR
    }

    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
    }

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  /**
   * Apply theme to document
   */
  private applyTheme(mode: ThemeMode): void {
    if (!IS_BROWSER) return;

    const html = document.documentElement;
    if (mode === 'dark') {
      html.classList.add('dark');
      html.setAttribute('data-theme', 'dark');
    } else {
      html.classList.remove('dark');
      html.setAttribute('data-theme', 'light');
    }

    // Persist to localStorage
    try {
      localStorage.setItem(THEME_KEY, mode);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }

  /**
   * Toggle between light and dark mode
   */
  toggleTheme(): void {
    const current = this.themeSignal();
    const next: ThemeMode = current === 'dark' ? 'light' : 'dark';
    this.themeSignal.set(next);
  }

  /**
   * Set theme mode explicitly
   */
  setTheme(mode: ThemeMode): void {
    this.themeSignal.set(mode);
  }
}
