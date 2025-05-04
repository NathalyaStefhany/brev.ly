import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Trash } from '@phosphor-icons/react';

import { Button } from '.';

describe('Button tests', () => {
  it('should render correctly', () => {
    expect(render(<Button>Label</Button>));
  });

  it('should display the label text correctly', () => {
    render(<Button data-testid="button">Label</Button>);

    expect(screen.getByTestId('button')).toBeInTheDocument();
    expect(screen.getByTestId('button')).toHaveTextContent('Label');
  });

  it('should display the icon when provided', () => {
    render(
      <Button icon={Trash} data-testid="button">
        Label
      </Button>,
    );

    expect(screen.getByTestId('button-icon')).toBeInTheDocument();
  });

  it('should not display the icon', () => {
    render(<Button data-testid="button">Label</Button>);

    expect(screen.queryByTestId('button-icon')).not.toBeInTheDocument();
  });

  it('should not display the icon when is loading', () => {
    render(
      <Button icon={Trash} isLoading data-testid="button">
        Label
      </Button>,
    );

    expect(screen.queryByTestId('button-icon')).not.toBeInTheDocument();
    expect(screen.getByTestId('button-loading')).toBeInTheDocument();
  });

  it('should display primary button correctly', () => {
    const { container } = render(
      <Button variant="primary" data-testid="button">
        Label
      </Button>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should display secondary button correctly', () => {
    const { container } = render(
      <Button variant="secondary" data-testid="button">
        Label
      </Button>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should display loading button correctly', () => {
    const { container } = render(
      <Button isLoading data-testid="button">
        Label
      </Button>,
    );

    expect(container).toMatchSnapshot();
  });
});
