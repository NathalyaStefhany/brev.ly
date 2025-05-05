import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AxiosMock from 'axios-mock-adapter';
import { Link } from '@/pages/Home/components/MyLinks/Link';
import { api } from '@/service/api';
import { queryClient } from '@/service/queryClient';

const apiMock = new AxiosMock(api);

const linkInfo = {
  id: '123',
  originalLink: 'https://test.com',
  shortenedLink: 'test',
  quantityAccesses: 0,
};

describe('Link tests', () => {
  beforeEach(() => {
    apiMock.reset();
  });

  it('should render correctly when it is first link', () => {
    const { container } = render(<Link isFirstLink info={linkInfo} />);

    expect(container).toMatchSnapshot();
  });

  it('should render correctly when it is not first link', () => {
    const { container } = render(<Link isFirstLink={false} info={linkInfo} />);

    expect(container).toMatchSnapshot();
  });

  it('should render correctly when it is loading', () => {
    const { container } = render(
      <Link isFirstLink info={linkInfo} isLoading />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should diplay shortened link', () => {
    render(<Link isFirstLink={false} info={linkInfo} />);

    expect(screen.getByTestId('link-shortened-link')).toHaveTextContent(
      'brev.ly/test',
    );
  });

  it('should diplay original link', () => {
    render(<Link isFirstLink={false} info={linkInfo} />);

    expect(screen.getByTestId('text-original-link')).toHaveTextContent(
      'https://test.com',
    );
  });

  it('should diplay quantity of accesses', () => {
    render(<Link isFirstLink={false} info={linkInfo} />);

    expect(screen.getByTestId('text-quantity-accesses')).toHaveTextContent(
      '0 acessos',
    );
  });

  it('should copy shortened link', () => {
    const writeText = vi.fn();

    Object.assign(navigator, {
      clipboard: {
        writeText,
      },
    });

    render(<Link isFirstLink={false} info={linkInfo} />);

    fireEvent.click(screen.getByTestId('button-copy'));

    expect(writeText).toHaveBeenCalledWith('http://localhost:3000/test');

    expect(screen.getByTestId('toast-shortened-link-copied')).toHaveTextContent(
      'Link copiado com sucesso',
    );
    expect(screen.getByTestId('toast-shortened-link-copied')).toHaveTextContent(
      'O link test foi copiado para a área de transferência',
    );
  });

  it('should delete the link', async () => {
    apiMock.onDelete('/shortened-links/test').reply(200);

    queryClient.refetchQueries = vi.fn();

    render(<Link isFirstLink={false} info={linkInfo} />);

    expect(
      screen.queryByTestId('container-delete-confirmation'),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('button-delete'));

    expect(
      screen.getByTestId('container-delete-confirmation'),
    ).toBeInTheDocument();

    expect(screen.queryByTestId('button-loading')).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('button-delete-confirmation'));

    expect(screen.getByTestId('button-delete-confirmation')).toBeDisabled();
    expect(screen.getByTestId('button-loading')).toBeInTheDocument();

    await waitFor(() => {
      expect(
        apiMock.history.delete.some(
          ({ url }) => url === '/shortened-links/test',
        ),
      ).toBeTruthy();
    });

    expect(queryClient.refetchQueries).toBeCalledWith({
      queryKey: ['links list'],
      exact: true,
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('container-delete-confirmation'),
      ).not.toBeInTheDocument();
    });
  });

  it('should display toast error when deletion fails', async () => {
    apiMock.onDelete('/shortened-links/test').reply(400);

    render(<Link isFirstLink={false} info={linkInfo} />);

    fireEvent.click(screen.getByTestId('button-delete'));

    fireEvent.click(screen.getByTestId('button-delete-confirmation'));

    await waitFor(() => {
      expect(
        apiMock.history.delete.some(
          ({ url }) => url === '/shortened-links/test',
        ),
      ).toBeTruthy();
    });

    await waitFor(() => {
      expect(screen.getByTestId('toast-deletion-error')).toBeInTheDocument();
    });

    expect(screen.getByTestId('toast-deletion-error')).toHaveTextContent(
      'Erro ao deletar',
    );

    expect(
      screen.getByTestId('container-delete-confirmation'),
    ).toBeInTheDocument();
  });
});
