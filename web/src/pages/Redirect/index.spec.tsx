import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Redirect } from '@/pages/Redirect';

describe('Redirect page tests', () => {
  it('should render correctly', () => {
    const { container } = render(<Redirect />);

    expect(container).toMatchSnapshot();
  });

  it('should go to home page when click on "Access here" link', () => {
    render(<Redirect />);

    expect(screen.getByTestId('link-access-here')).toHaveAttribute('href', '/');
  });
});
