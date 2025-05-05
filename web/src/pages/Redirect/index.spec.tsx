import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import AxiosMock from 'axios-mock-adapter';
import { Redirect } from '@/pages/Redirect';
import { api } from '@/service/api';
import { queryClient } from '@/service/queryClient';

const mockNavigate = vi.fn();

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useLocation: (): { pathname: string } => ({
      pathname: '/test',
    }),
    useNavigate: (): (() => void) => mockNavigate,
  };
});

const apiMock = new AxiosMock(api);

describe('Redirect page tests', () => {
  beforeEach(() => {
    apiMock.reset();
  });

  it('should render correctly', () => {
    const { container } = render(<Redirect />);

    expect(container).toMatchSnapshot();
  });

  it('should go to home page when click on "Access here" link', () => {
    render(<Redirect />);

    expect(screen.getByTestId('link-access-here')).toHaveAttribute('href', '/');
  });

  it('should redirect to the original page when url starts with "www."', async () => {
    apiMock
      .onGet('/shortened-links/test/original-link')
      .reply(200, { originalLink: 'www.test.com' });

    const locationMock = { href: '' };

    Object.defineProperty(window, 'location', {
      value: locationMock,
      writable: true,
    });

    render(<Redirect />);

    await waitFor(() => {
      expect(
        apiMock.history.get.some(
          ({ url }) => url === '/shortened-links/test/original-link',
        ),
      );
    });

    expect(locationMock.href).toBe('https://www.test.com');
  });

  it('should redirect to the original page when url does not start with "www."', async () => {
    apiMock
      .onGet('/shortened-links/test/original-link')
      .reply(200, { originalLink: 'https://www.test.com' });

    const locationMock = { href: '' };

    Object.defineProperty(window, 'location', {
      value: locationMock,
      writable: true,
    });

    render(<Redirect />);

    await waitFor(() => {
      expect(
        apiMock.history.get.some(
          ({ url }) => url === '/shortened-links/test/original-link',
        ),
      );
    });

    expect(locationMock.href).toBe('https://www.test.com');
  });

  it('should redirect to the not found page when shortened link does not exist', async () => {
    apiMock.onGet('/shortened-links/test/original-link').reply(404);

    render(<Redirect />);

    await waitFor(() => {
      expect(
        apiMock.history.get.some(
          ({ url }) => url === '/shortened-links/test/original-link',
        ),
      );
    });

    expect(mockNavigate).toBeCalledWith('/url/not-found');
  });

  it('should update access quantity when access the page', async () => {
    apiMock.onPatch('/shortened-links/test/access').reply(200);

    queryClient.refetchQueries = vi.fn();

    render(<Redirect />);

    await waitFor(() => {
      expect(
        apiMock.history.patch.some(
          ({ url }) => url === '/shortened-links/test/access',
        ),
      );
    });

    expect(queryClient.refetchQueries).toBeCalledWith({
      queryKey: ['links list'],
      exact: true,
    });
  });
});
