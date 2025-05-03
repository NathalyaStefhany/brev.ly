import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Link } from '@/pages/Home/components/MyLinks/Link';

const linkInfo = {
  id: '123',
  originalLink: 'https://test.com',
  shortenedLink: 'test',
  quantityAccesses: 0,
};

describe('Link tests', () => {
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
});
