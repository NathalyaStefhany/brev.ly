import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NotFound } from '@/pages/NotFound';

describe('Not found page tests', () => {
  it('should render correctly', () => {
    const { container } = render(<NotFound />);

    expect(container).toMatchSnapshot();
  });

  it('should go to home page when click on brev.ly link', () => {
    render(<NotFound />);

    expect(screen.getByTestId('link-brev-ly')).toHaveAttribute('href', '/');
  });
});
