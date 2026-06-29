import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme';

// AC-2: theme hook persists and toggles the document theme state
it('useTheme initializes dark mode and toggles the html class and storage', () => {
  window.localStorage.clear();
  const { result } = renderHook(() => useTheme());

  expect(result.current.darkMode).toBe(true);

  act(() => result.current.toggleTheme());
  expect(result.current.darkMode).toBe(false);
  expect(window.localStorage.getItem('brightcone-phase0-theme')).toBe('light');
  expect(document.documentElement.classList.contains('dark')).toBe(false);
});
