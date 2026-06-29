import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { axe } from '../test/setup';
import { renderWithProviders } from '../../test/render';
import { Card } from './Card';
import { Button } from './Button';

// AC-2: reusable UI components render accessible headings and optional header actions
it('Card renders title, subtitle, and header action accessibly', async () => {
  const { container } = renderWithProviders(
    <Card title="Example card" subtitle="Supporting description" headerAction={<Button>Action</Button>}>
      <p>Card body</p>
    </Card>,
  );

  expect(screen.getByRole('heading', { name: 'Example card' })).toBeVisible();
  expect(screen.getByText('Supporting description')).toBeVisible();
  expect(screen.getByRole('button', { name: 'Action' })).toBeVisible();
  expect(await axe(container)).toHaveNoViolations();
});
