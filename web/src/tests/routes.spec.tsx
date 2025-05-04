import { describe, expect, it } from 'vitest';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { act, render, screen } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/service/queryClient';
import { routesConfig } from '@/routes';

describe('Routes tests', () => {
  it('should render not found page when route does not exists', () => {
    const router = createMemoryRouter(routesConfig, {
      initialEntries: ['/not-found/route'],
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
      render(
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>,
      );
    });

    expect(screen.queryByTestId('container-not-found')).not.toBeInTheDocument();
    expect(screen.getByTestId('container-home-page')).toBeInTheDocument();
  });

  it('should render redirect page', () => {
    const router = createMemoryRouter(routesConfig, {
      initialEntries: ['/shortened-link'],
    });

    render(<RouterProvider router={router} />);

    expect(screen.queryByTestId('container-home-page')).not.toBeInTheDocument();
    expect(screen.queryByTestId('container-not-found')).not.toBeInTheDocument();
    expect(screen.getByTestId('container-redirect-page')).toBeInTheDocument();
  });
});
