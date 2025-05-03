import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AxiosMock from 'axios-mock-adapter';
import { NewLink } from '@/pages/Home/components/NewLink';
import { api } from '@/service/api';
import { queryClient } from '@/service/queryClient';

const apiMock = new AxiosMock(api);

describe('New Link tests', () => {
  beforeEach(() => {
    apiMock.reset();
  });

  it('should render correctly', async () => {
    let container: HTMLElement = document.createElement('div');

    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
      container = render(<NewLink />).container;
    });

    expect(container).toMatchSnapshot();
  });

  it('should display input errors when try to save link but the fields are empty', async () => {
    render(<NewLink />);

    fireEvent.click(screen.getByTestId('button-save-link'));

    await waitFor(() => {
      expect(screen.getByTestId('input-original-link-error')).toHaveTextContent(
        'Informe uma url válida.',
      );
    });

    expect(screen.getByTestId('input-shortened-link-error')).toHaveTextContent(
      'Informe uma url minúscula e sem espaço/caracter especial.',
    );
  });

  it('should display original link input error when value is invalid (example.com)', async () => {
    render(<NewLink />);

    fireEvent.change(screen.getByTestId('input-original-link'), {
      target: { value: 'example.com' },
    });

    expect(screen.getByTestId('input-original-link')).toHaveValue(
      'example.com',
    );

    fireEvent.click(screen.getByTestId('button-save-link'));

    await waitFor(() => {
      expect(
        screen.getByTestId('input-original-link-error'),
      ).toBeInTheDocument();
    });
  });

  it('should display original link input error when value is invalid (https://)', async () => {
    render(<NewLink />);

    fireEvent.change(screen.getByTestId('input-original-link'), {
      target: { value: 'https://' },
    });

    expect(screen.getByTestId('input-original-link')).toHaveValue('https://');

    fireEvent.click(screen.getByTestId('button-save-link'));

    await waitFor(() => {
      expect(
        screen.getByTestId('input-original-link-error'),
      ).toBeInTheDocument();
    });
  });

  it('should display original link input error when value is invalid (https://example@)', async () => {
    render(<NewLink />);

    fireEvent.change(screen.getByTestId('input-original-link'), {
      target: { value: 'https://example@' },
    });

    expect(screen.getByTestId('input-original-link')).toHaveValue(
      'https://example@',
    );

    fireEvent.click(screen.getByTestId('button-save-link'));

    await waitFor(() => {
      expect(
        screen.getByTestId('input-original-link-error'),
      ).toBeInTheDocument();
    });
  });

  it('should display original link input error when value is invalid (www.example)', async () => {
    render(<NewLink />);

    fireEvent.change(screen.getByTestId('input-original-link'), {
      target: { value: 'www.example' },
    });

    expect(screen.getByTestId('input-original-link')).toHaveValue(
      'www.example',
    );

    fireEvent.click(screen.getByTestId('button-save-link'));

    await waitFor(() => {
      expect(
        screen.getByTestId('input-original-link-error'),
      ).toBeInTheDocument();
    });
  });

  it('should display original link input error when value is invalid (www.example.com.br.test)', async () => {
    render(<NewLink />);

    fireEvent.change(screen.getByTestId('input-original-link'), {
      target: { value: 'www.example.com.br.test' },
    });

    expect(screen.getByTestId('input-original-link')).toHaveValue(
      'www.example.com.br.test',
    );

    fireEvent.click(screen.getByTestId('button-save-link'));

    await waitFor(() => {
      expect(
        screen.getByTestId('input-original-link-error'),
      ).toBeInTheDocument();
    });
  });

  it('should display original link input error when value is invalid (www.example.)', async () => {
    render(<NewLink />);

    fireEvent.change(screen.getByTestId('input-original-link'), {
      target: { value: 'www.example.' },
    });

    expect(screen.getByTestId('input-original-link')).toHaveValue(
      'www.example.',
    );

    fireEvent.click(screen.getByTestId('button-save-link'));

    await waitFor(() => {
      expect(
        screen.getByTestId('input-original-link-error'),
      ).toBeInTheDocument();
    });
  });

  it('should not display original link input error when value is valid (https://example.com)', async () => {
    render(<NewLink />);

    fireEvent.change(screen.getByTestId('input-original-link'), {
      target: { value: 'https://example.com' },
    });

    expect(screen.getByTestId('input-original-link')).toHaveValue(
      'https://example.com',
    );

    fireEvent.click(screen.getByTestId('button-save-link'));

    await waitFor(() => {
      expect(
        screen.getByTestId('input-shortened-link-error'),
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByTestId('input-original-link-error'),
    ).not.toBeInTheDocument();
  });

  it('should not display original link input error when value is valid (http://example.com)', async () => {
    render(<NewLink />);

    fireEvent.change(screen.getByTestId('input-original-link'), {
      target: { value: 'http://example.com' },
    });

    expect(screen.getByTestId('input-original-link')).toHaveValue(
      'http://example.com',
    );

    fireEvent.click(screen.getByTestId('button-save-link'));

    await waitFor(() => {
      expect(
        screen.getByTestId('input-shortened-link-error'),
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByTestId('input-original-link-error'),
    ).not.toBeInTheDocument();
  });

  it('should not display original link input error when value is valid (https://www.example.com)', async () => {
    render(<NewLink />);

    fireEvent.change(screen.getByTestId('input-original-link'), {
      target: { value: 'https://www.example.com' },
    });

    expect(screen.getByTestId('input-original-link')).toHaveValue(
      'https://www.example.com',
    );

    fireEvent.click(screen.getByTestId('button-save-link'));

    await waitFor(() => {
      expect(
        screen.getByTestId('input-shortened-link-error'),
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByTestId('input-original-link-error'),
    ).not.toBeInTheDocument();
  });

  it('should not display original link input error when value is valid (https://example.com.br)', async () => {
    render(<NewLink />);

    fireEvent.change(screen.getByTestId('input-original-link'), {
      target: { value: 'https://example.com.br' },
    });

    expect(screen.getByTestId('input-original-link')).toHaveValue(
      'https://example.com.br',
    );

    fireEvent.click(screen.getByTestId('button-save-link'));

    await waitFor(() => {
      expect(
        screen.getByTestId('input-shortened-link-error'),
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByTestId('input-original-link-error'),
    ).not.toBeInTheDocument();
  });

  it('should not display original link input error when value is valid (www.example.com)', async () => {
    render(<NewLink />);

    fireEvent.change(screen.getByTestId('input-original-link'), {
      target: { value: 'www.example.com' },
    });

    expect(screen.getByTestId('input-original-link')).toHaveValue(
      'www.example.com',
    );

    fireEvent.click(screen.getByTestId('button-save-link'));

    await waitFor(() => {
      expect(
        screen.getByTestId('input-shortened-link-error'),
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByTestId('input-original-link-error'),
    ).not.toBeInTheDocument();
  });

  it('should not display original link input error when value is valid (www.example.com.br)', async () => {
    render(<NewLink />);

    fireEvent.change(screen.getByTestId('input-original-link'), {
      target: { value: 'www.example.com.br' },
    });

    expect(screen.getByTestId('input-original-link')).toHaveValue(
      'www.example.com.br',
    );

    fireEvent.click(screen.getByTestId('button-save-link'));

    await waitFor(() => {
      expect(
        screen.getByTestId('input-shortened-link-error'),
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByTestId('input-original-link-error'),
    ).not.toBeInTheDocument();
  });

  it('should display shortened link input error when value is invalid (EXAMPLE)', async () => {
    render(<NewLink />);

    fireEvent.change(screen.getByTestId('input-shortened-link'), {
      target: { value: 'EXAMPLE' },
    });

    expect(screen.getByTestId('input-shortened-link')).toHaveValue('EXAMPLE');

    fireEvent.click(screen.getByTestId('button-save-link'));

    await waitFor(() => {
      expect(
        screen.getByTestId('input-shortened-link-error'),
      ).toBeInTheDocument();
    });
  });

  it('should display shortened link input error when value is invalid (example.)', async () => {
    render(<NewLink />);

    fireEvent.change(screen.getByTestId('input-shortened-link'), {
      target: { value: 'example.' },
    });

    expect(screen.getByTestId('input-shortened-link')).toHaveValue('example.');

    fireEvent.click(screen.getByTestId('button-save-link'));

    await waitFor(() => {
      expect(
        screen.getByTestId('input-shortened-link-error'),
      ).toBeInTheDocument();
    });
  });

  it('should display shortened link input error when value is invalid (example )', async () => {
    render(<NewLink />);

    fireEvent.change(screen.getByTestId('input-shortened-link'), {
      target: { value: 'example ' },
    });

    expect(screen.getByTestId('input-shortened-link')).toHaveValue('example ');

    fireEvent.click(screen.getByTestId('button-save-link'));

    await waitFor(() => {
      expect(
        screen.getByTestId('input-shortened-link-error'),
      ).toBeInTheDocument();
    });
  });

  it('should not display shortened link input error when value is valid (example)', async () => {
    render(<NewLink />);

    fireEvent.change(screen.getByTestId('input-shortened-link'), {
      target: { value: 'example' },
    });

    expect(screen.getByTestId('input-shortened-link')).toHaveValue('example');

    fireEvent.click(screen.getByTestId('button-save-link'));

    await waitFor(() => {
      expect(
        screen.getByTestId('input-original-link-error'),
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByTestId('input-shortened-link-error'),
    ).not.toBeInTheDocument();
  });

  it('should not display shortened link input error when value is valid (example-1)', async () => {
    render(<NewLink />);

    fireEvent.change(screen.getByTestId('input-shortened-link'), {
      target: { value: 'example-1' },
    });

    expect(screen.getByTestId('input-shortened-link')).toHaveValue('example-1');

    fireEvent.click(screen.getByTestId('button-save-link'));

    await waitFor(() => {
      expect(
        screen.getByTestId('input-original-link-error'),
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByTestId('input-shortened-link-error'),
    ).not.toBeInTheDocument();
  });

  it('should disappear with the original input error when entering a valid value', async () => {
    render(<NewLink />);

    fireEvent.click(screen.getByTestId('button-save-link'));

    await waitFor(() => {
      expect(
        screen.getByTestId('input-original-link-error'),
      ).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('input-original-link'), {
      target: { value: 'www.example-1.com' },
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('input-original-link-error'),
      ).not.toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('input-original-link'), {
      target: { value: 'www' },
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('input-original-link-error'),
      ).toBeInTheDocument();
    });
  });

  it('should disappear with the shortened input error when entering a valid value', async () => {
    render(<NewLink />);

    fireEvent.click(screen.getByTestId('button-save-link'));

    await waitFor(() => {
      expect(
        screen.getByTestId('input-shortened-link-error'),
      ).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('input-shortened-link'), {
      target: { value: 'example' },
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('input-shortened-link-error'),
      ).not.toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('input-shortened-link'), {
      target: { value: 'exâmple' },
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('input-shortened-link-error'),
      ).toBeInTheDocument();
    });
  });

  it('should be able to create a new link', async () => {
    const newLink = {
      originalLink: 'www.test.com',
      shortenedLink: 'test',
    };

    apiMock.onPost('/shortened-links', newLink).reply(200);

    render(<NewLink />);

    fireEvent.change(screen.getByTestId('input-original-link'), {
      target: { value: 'www.test.com' },
    });

    fireEvent.change(screen.getByTestId('input-shortened-link'), {
      target: { value: 'test' },
    });

    expect(screen.getByTestId('button-save-link')).toHaveTextContent(
      'Salvar link',
    );

    fireEvent.click(screen.getByTestId('button-save-link'));

    expect(screen.getByTestId('button-save-link')).toBeDisabled();
    expect(screen.getByTestId('button-save-link')).toHaveTextContent(
      'Salvando...',
    );

    await waitFor(() => {
      expect(
        apiMock.history.post.some(
          ({ url, data }) =>
            url === '/shortened-links' && data === JSON.stringify(newLink),
        ),
      ).toBeTruthy();
    });

    expect(
      screen.queryByTestId('toast-creation-error'),
    ).not.toBeInTheDocument();
  });

  it('should display error when try to create a new link with a shortened link that already exists', async () => {
    const newLink = {
      originalLink: 'www.test.com',
      shortenedLink: 'test',
    };

    apiMock
      .onPost('/shortened-links', newLink)
      .reply(400, { message: 'Shortened link already exists' });

    render(<NewLink />);

    fireEvent.change(screen.getByTestId('input-original-link'), {
      target: { value: 'www.test.com' },
    });

    fireEvent.change(screen.getByTestId('input-shortened-link'), {
      target: { value: 'test' },
    });

    fireEvent.click(screen.getByTestId('button-save-link'));

    await waitFor(() => {
      expect(
        apiMock.history.post.some(
          ({ url, data }) =>
            url === '/shortened-links' && data === JSON.stringify(newLink),
        ),
      ).toBeTruthy();
    });

    expect(screen.getByTestId('toast-creation-error')).toBeInTheDocument();
    expect(screen.getByTestId('toast-creation-error')).toHaveTextContent(
      'Esse link encurtado já existe.',
    );
  });

  it('should display error when creation fails', async () => {
    const newLink = {
      originalLink: 'www.test.com',
      shortenedLink: 'test',
    };

    apiMock.onPost('/shortened-links', newLink).reply(400);

    render(<NewLink />);

    fireEvent.change(screen.getByTestId('input-original-link'), {
      target: { value: 'www.test.com' },
    });

    fireEvent.change(screen.getByTestId('input-shortened-link'), {
      target: { value: 'test' },
    });

    fireEvent.click(screen.getByTestId('button-save-link'));

    await waitFor(() => {
      expect(
        apiMock.history.post.some(
          ({ url, data }) =>
            url === '/shortened-links' && data === JSON.stringify(newLink),
        ),
      ).toBeTruthy();
    });

    expect(screen.getByTestId('toast-creation-error')).toBeInTheDocument();
    expect(screen.getByTestId('toast-creation-error')).toHaveTextContent(
      'Por favor, tente novamente mais tarde.',
    );
  });

  it('should reset input values when create a new link', async () => {
    const newLink = {
      originalLink: 'www.test.com',
      shortenedLink: 'test',
    };

    apiMock.onPost('/shortened-links', newLink).reply(200);

    render(<NewLink />);

    fireEvent.change(screen.getByTestId('input-original-link'), {
      target: { value: 'www.test.com' },
    });

    fireEvent.change(screen.getByTestId('input-shortened-link'), {
      target: { value: 'test' },
    });

    fireEvent.click(screen.getByTestId('button-save-link'));

    await waitFor(() => {
      expect(
        apiMock.history.post.some(
          ({ url, data }) =>
            url === '/shortened-links' && data === JSON.stringify(newLink),
        ),
      ).toBeTruthy();
    });

    expect(screen.getByTestId('input-original-link')).toHaveValue('');
    expect(screen.getByTestId('input-shortened-link')).toHaveValue('');
  });

  it('should not reset input values when creation fails', async () => {
    const newLink = {
      originalLink: 'www.test.com',
      shortenedLink: 'test',
    };

    apiMock.onPost('/shortened-links', newLink).reply(400);

    render(<NewLink />);

    fireEvent.change(screen.getByTestId('input-original-link'), {
      target: { value: 'www.test.com' },
    });

    fireEvent.change(screen.getByTestId('input-shortened-link'), {
      target: { value: 'test' },
    });

    fireEvent.click(screen.getByTestId('button-save-link'));

    await waitFor(() => {
      expect(
        apiMock.history.post.some(
          ({ url, data }) =>
            url === '/shortened-links' && data === JSON.stringify(newLink),
        ),
      ).toBeTruthy();
    });

    expect(screen.getByTestId('input-original-link')).toHaveValue(
      'www.test.com',
    );
    expect(screen.getByTestId('input-shortened-link')).toHaveValue('test');
  });

  it('should refetch links list query when create a new link', async () => {
    const newLink = {
      originalLink: 'www.test.com',
      shortenedLink: 'test',
    };

    apiMock.onPost('/shortened-links', newLink).reply(200);

    queryClient.refetchQueries = vi.fn();

    render(<NewLink />);

    fireEvent.change(screen.getByTestId('input-original-link'), {
      target: { value: 'www.test.com' },
    });

    fireEvent.change(screen.getByTestId('input-shortened-link'), {
      target: { value: 'test' },
    });

    fireEvent.click(screen.getByTestId('button-save-link'));

    await waitFor(() => {
      expect(
        apiMock.history.post.some(
          ({ url, data }) =>
            url === '/shortened-links' && data === JSON.stringify(newLink),
        ),
      ).toBeTruthy();
    });

    expect(queryClient.refetchQueries).toBeCalledWith({
      queryKey: ['links list'],
      exact: true,
    });
  });
});
