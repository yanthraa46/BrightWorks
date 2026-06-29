import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '../../test/setup';
import { renderWithProviders } from '../../test/render';
import { BaseLayout } from './BaseLayout';

// AC-2: base layout exposes the dashboard shell and theme toggle
// AC-3: clicking the theme toggle changes the visible label and invokes the callback
it('BaseLayout renders shell content and toggles theme action', async () => {
  const user = userEvent.setup();
  const onToggleTheme = vi.fn();
  const { container } = renderWithProviders(
    <BaseLayout darkMode={true} onToggleTheme={onToggleTheme}>
      <div>Child content</div>
    </BaseLayout>,
  );

  expect(screen.getByRole('heading', { name: /Rural Health Transformation Assessment Dashboard/i })).toBeVisible();
  expect(screen.getByRole('button', { name: /Switch to light mode/i })).toBeVisible();
  await user.click(screen.getByRole('button', { name: /Switch to light mode/i }));
  expect(onToggleTheme).toHaveBeenCalledTimes(1);
  expect(await axe(container)).toHaveNoViolations();
});
