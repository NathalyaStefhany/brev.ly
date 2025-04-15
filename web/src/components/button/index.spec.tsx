import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '.';
import { Trash } from '@phosphor-icons/react';

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
});
