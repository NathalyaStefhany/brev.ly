import { describe, expect, it } from 'vitest';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { act, render, screen } from '@testing-library/react';
import { routesConfig } from '@/routes';

describe('Routes tests', () => {
  it('should render not found page when route does not exists', () => {
    const router = createMemoryRouter(routesConfig, {
      initialEntries: ['/not-found'],
    });

    render(<RouterProvider router={router} />);

    expect(screen.queryByTestId('container-home-page')).not.toBeInTheDocument();
    expect(screen.getByTestId('container-not-found')).toBeInTheDocument();
  });

  it('should render home page', async () => {
    const router = createMemoryRouter(routesConfig, {
      initialEntries: ['/'],
    });

    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
      render(<RouterProvider router={router} />);
    });

    expect(screen.queryByTestId('container-not-found')).not.toBeInTheDocument();
    expect(screen.getByTestId('container-home-page')).toBeInTheDocument();
  });
});
