import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from './test/setup';
import { renderWithProviders } from './test/render';
import App from './App';

// AC-1: single-command test suite can render the prototype in a clean environment
// AC-2: dashboard tabs, selection flows, and page-level content are covered
// AC-3: interactions must fail if visible behavior regresses
// AC-4: page-level accessibility checks run automatically
it('App renders the prototype dashboard, supports tab navigation, and keeps current interactive flows accessible', async () => {
  const user = userEvent.setup();
  const { container } = renderWithProviders(<App />);

  expect(screen.getByText('Static prototype / demo data only')).toBeVisible();
  expect(screen.getByRole('button', { name: 'Regional Map' })).toBeVisible();
  expect(screen.getByRole('heading', { name: /Provider Readiness Summary/i })).toBeVisible();

  await user.click(screen.getByRole('button', { name: 'Vendor Evaluation' }));
  expect(screen.getByRole('heading', { name: /Vendor Evaluation/i })).toBeVisible();

  await user.click(screen.getByRole('row', { name: /Abridge AI\/ML 6.4 Flagged/i }));
  expect(screen.getByRole('heading', { name: /Abridge Detail/i })).toBeVisible();
  expect(screen.getByText(/expired SOC 2 posture/i)).toBeVisible();

  await user.click(screen.getByRole('button', { name: 'AI Governance' }));
  expect(screen.getByRole('heading', { name: /Critical AI Governance Alert/i })).toBeVisible();
  expect(screen.getByText(/6 of 8 AI tools operating without PHI governance/i)).toBeVisible();

  expect(await axe(container)).toHaveNoViolations();
});
