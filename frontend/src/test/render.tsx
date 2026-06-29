import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';

export function renderWithProviders(ui: ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}
