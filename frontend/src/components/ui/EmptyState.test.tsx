import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { Database } from 'lucide-react';
import { axe } from '../test/setup';
import { renderWithProviders } from '../../test/render';
import { EmptyState } from './EmptyState';

// AC-2: reusable UI empty states show their message and remain accessible
it('EmptyState renders accessible title and description with no axe violations', async () => {
  const { container } = renderWithProviders(
    <EmptyState icon={Database} title="No records available" description="Clear the filter to see the full data set." />,
  );

  expect(screen.getByText('No records available')).toBeVisible();
  expect(screen.getByText('Clear the filter to see the full data set.')).toBeVisible();
  expect(await axe(container)).toHaveNoViolations();
});
