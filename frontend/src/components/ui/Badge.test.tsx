import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { axe } from '../test/setup';
import { renderWithProviders } from '../../test/render';
import { Badge } from './Badge';

// AC-2: reusable UI components expose visible status text and accessible output
it('Badge renders status content and passes axe checks', async () => {
  const { container } = renderWithProviders(<Badge tone="success">READY</Badge>);

  expect(screen.getByText('READY')).toBeVisible();
  expect(await axe(container)).toHaveNoViolations();
});
