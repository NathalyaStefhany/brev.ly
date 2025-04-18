import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Input } from '.';

describe('Input tests', () => {
  it('should render correctly', () => {
    expect(
      render(<Input id="input-test" label="Title" placeholder="Placeholder" />),
    );
  });

  it('should display error when provided', () => {
    render(
      <Input
        id="input-test"
        label="Title"
        placeholder="Placeholder"
        error="Error message"
      />,
    );

    expect(screen.getByTestId('input-test-error')).toBeInTheDocument();
    expect(screen.getByTestId('input-test-error')).toHaveTextContent(
      'Error message',
    );
  });

  it('should not display error', () => {
    render(<Input id="input-test" label="Title" placeholder="Placeholder" />);

    expect(screen.queryByTestId('input-test-error')).not.toBeInTheDocument();
  });

  it('should display input correctly', () => {
    const { container } = render(
      <Input id="input-test" label="Title" placeholder="Placeholder" />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should display input with error correctly', () => {
    const { container } = render(
      <Input
        id="input-test"
        label="Title"
        placeholder="Placeholder"
        error="Error message"
      />,
    );

    expect(container).toMatchSnapshot();
  });
});
