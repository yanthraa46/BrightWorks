import { describe, expect, it, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { axe } from '../test/setup';
import { renderWithProviders } from '../../test/render';
import { Button } from './Button';

// AC-2: reusable UI components render with accessible semantics and expected interaction behavior
// AC-3: interaction regressions on visible button actions are caught by user-event style assertions
it('Button renders accessible label, supports click interaction, and has no axe violations', async () => {
  const onClick = vi.fn();
  const { container } = renderWithProviders(<Button onClick={onClick}>Save changes</Button>);

  const button = screen.getByRole('button', { name: 'Save changes' });
  expect(button).toBeVisible();
  expect(button).toHaveTextContent('Save changes');

  fireEvent.click(button);
  expect(onClick).toHaveBeenCalledTimes(1);

  expect(await axe(container)).toHaveNoViolations();
});
