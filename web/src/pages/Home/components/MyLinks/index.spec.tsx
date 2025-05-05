import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import AxiosMock from 'axios-mock-adapter';
import { MyLinks } from '@/pages/Home/components/MyLinks';
import { queryClient } from '@/service/queryClient';
import { api } from '@/service/api';

queryClient.setDefaultOptions({ queries: { retry: 0 } });

const apiMock = new AxiosMock(api);

describe('My Links testes', () => {
  beforeEach(() => {
    apiMock.reset();
    queryClient.clear();
  });

  it('should render correctly when list of links is empty', async () => {
    apiMock
      .onGet('/shortened-links?page=1&pageSize=20')
      .reply(200, { total: 0, page: 1, pageSize: 20, data: [] });

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <MyLinks />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        apiMock.history.get.some(
          ({ url }) => url === '/shortened-links?page=1&pageSize=20',
        ),
      ).toBeTruthy();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('container-link-list-empty'),
      ).toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });

  it('should render correctly when it is loading list of links', async () => {
    apiMock
      .onGet('/shortened-links?page=1&pageSize=20')
      .reply(200, { total: 0, page: 1, pageSize: 20, data: [] });

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <MyLinks />
      </QueryClientProvider>,
    );

    expect(
      screen.getByTestId('container-link-list-loading'),
    ).toBeInTheDocument();

    expect(container).toMatchSnapshot();

    await waitFor(() => {
      expect(
        screen.getByTestId('container-link-list-empty'),
      ).toBeInTheDocument();
    });
  });

  it('should render correctly when list of links request fails', async () => {
    apiMock.onGet('/shortened-links?page=1&pageSize=20').reply(400);

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <MyLinks />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        apiMock.history.get.some(
          ({ url }) => url === '/shortened-links?page=1&pageSize=20',
        ),
      ).toBeTruthy();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('container-link-list-error'),
      ).toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });

  it('should display list of links correclty', async () => {
    apiMock.onGet('/shortened-links?page=1&pageSize=20').reply(200, {
      total: 10,
      page: 1,
      pageSize: 20,
      data: [...Array(10)].map((_, i) => ({
        id: i.toString(),
        shortenedLink: `test-${i}`,
        originalLink: `https://test-${i}.com`,
        quantityAccesses: i,
      })),
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MyLinks />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        apiMock.history.get.some(
          ({ url }) => url === '/shortened-links?page=1&pageSize=20',
        ),
      ).toBeTruthy();
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('container-link-list-loading'),
      ).not.toBeInTheDocument();
    });

    for (let i = 0; i < 10; i++) {
      expect(screen.getByTestId(`container-${i}-link`)).toBeInTheDocument();

      expect(screen.getByTestId(`container-${i}-link`)).toHaveTextContent(
        `brev.ly/test-${i}`,
      );
      expect(screen.getByTestId(`container-${i}-link`)).toHaveTextContent(
        `https://test-${i}.com`,
      );
      expect(screen.getByTestId(`container-${i}-link`)).toHaveTextContent(
        `${i} acessos`,
      );
    }
  });

  it('should display skeleton loading in the end of list when has more pages to load', async () => {
    apiMock.onGet('/shortened-links?page=1&pageSize=20').reply(200, {
      total: 40,
      page: 1,
      pageSize: 20,
      data: [...Array(20)].map((_, i) => ({
        id: i.toString(),
        shortenedLink: `test-${i}`,
        originalLink: `https://test-${i}.com`,
        quantityAccesses: i,
      })),
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MyLinks />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        apiMock.history.get.some(
          ({ url }) => url === '/shortened-links?page=1&pageSize=20',
        ),
      ).toBeTruthy();
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('container-link-list-loading'),
      ).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('container-loading-link')).toBeInTheDocument();
  });

  it('should load the next page when go to the end of list', async () => {
    apiMock.onGet('/shortened-links?page=1&pageSize=20').reply(200, {
      total: 40,
      page: 1,
      pageSize: 20,
      data: [...Array(20)].map((_, i) => ({
        id: i.toString(),
        shortenedLink: `test-${i}`,
        originalLink: `https://test-${i}.com`,
        quantityAccesses: i,
      })),
    });

    apiMock.onGet('/shortened-links?page=2&pageSize=20').reply(200, {
      total: 40,
      page: 2,
      pageSize: 20,
      data: [...Array(20)].map((_, i) => {
        const index = i + 20;

        return {
          id: index.toString(),
          shortenedLink: `test-${index}`,
          originalLink: `https://test-${index}.com`,
          quantityAccesses: index,
        };
      }),
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MyLinks />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        apiMock.history.get.some(
          ({ url }) => url === '/shortened-links?page=1&pageSize=20',
        ),
      ).toBeTruthy();
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('container-link-list-loading'),
      ).not.toBeInTheDocument();
    });

    for (let i = 0; i < 40; i++) {
      if (i < 20) {
        expect(screen.getByTestId(`container-${i}-link`)).toBeInTheDocument();

        expect(screen.getByTestId(`container-${i}-link`)).toHaveTextContent(
          `brev.ly/test-${i}`,
        );
        expect(screen.getByTestId(`container-${i}-link`)).toHaveTextContent(
          `https://test-${i}.com`,
        );
        expect(screen.getByTestId(`container-${i}-link`)).toHaveTextContent(
          `${i} acessos`,
        );
      } else {
        expect(
          screen.queryByTestId(`container-${i}-link`),
        ).not.toBeInTheDocument();
      }
    }

    fireEvent.scroll(screen.getByTestId('container-my-links-scroll'), {
      currentTarget: { scrollY: 200 },
    });

    await waitFor(() => {
      expect(
        apiMock.history.get.some(
          ({ url }) => url === '/shortened-links?page=2&pageSize=20',
        ),
      ).toBeTruthy();
    });

    for (let i = 0; i < 40; i++) {
      expect(screen.getByTestId(`container-${i}-link`)).toBeInTheDocument();

      expect(screen.getByTestId(`container-${i}-link`)).toHaveTextContent(
        `brev.ly/test-${i}`,
      );
      expect(screen.getByTestId(`container-${i}-link`)).toHaveTextContent(
        `https://test-${i}.com`,
      );
      expect(screen.getByTestId(`container-${i}-link`)).toHaveTextContent(
        `${i} acessos`,
      );
    }

    expect(
      screen.queryByTestId('container-loading-link'),
    ).not.toBeInTheDocument();
  });

  it('should get report URL when click to download CSV', async () => {
    apiMock.onGet('/shortened-links?page=1&pageSize=20').reply(200, {
      total: 3,
      page: 1,
      pageSize: 20,
      data: [...Array(3)].map((_, i) => ({
        id: i.toString(),
        shortenedLink: `test-${i}`,
        originalLink: `https://test-${i}.com`,
        quantityAccesses: i,
      })),
    });
    apiMock
      .onGet('/shortened-links/export')
      .reply(200, { reportUrl: 'https://test.com' });

    render(
      <QueryClientProvider client={queryClient}>
        <MyLinks />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        apiMock.history.get.some(
          ({ url }) => url === '/shortened-links?page=1&pageSize=20',
        ),
      ).toBeTruthy();
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('container-link-list-loading'),
      ).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('button-download')).not.toBeDisabled();

    fireEvent.click(screen.getByTestId('button-download'));

    expect(screen.getByTestId('button-download')).toBeDisabled();
    expect(screen.getByTestId('button-loading')).toBeInTheDocument();

    await waitFor(() => {
      expect(
        apiMock.history.get.some(
          ({ url }) => url === '/shortened-links/export',
        ),
      ).toBeTruthy();
    });
  });
});
