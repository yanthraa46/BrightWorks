import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { axe } from '../../test/setup';
import { renderWithProviders } from '../../test/render';
import { PrototypeNotice } from './PrototypeNotice';

// AC-2: prototype notice communicates the current demo-data limitation and is accessible
it('PrototypeNotice renders the demo warning text and passes axe checks', async () => {
  const { container } = renderWithProviders(<PrototypeNotice />);

  expect(screen.getByText('Static prototype / demo data only')).toBeVisible();
  expect(screen.getByText(/Illustrative Phase 0 demo data/i)).toBeVisible();
  expect(await axe(container)).toHaveNoViolations();
});
