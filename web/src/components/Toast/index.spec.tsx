import { Toast } from '@/components/Toast';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('Toast tests', () => {
  it('should render correctly when type is error', () => {
    const { container } = render(
      <Toast
        id="toast"
        type="error"
        title="Toast title"
        description="Toast description"
        open
        onOpenChange={vi.fn()}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render correctly when type is information', () => {
    const { container } = render(
      <Toast
        id="toast"
        type="information"
        title="Toast title"
        description="Toast description"
        open
        onOpenChange={vi.fn()}
      />,
    );

    expect(container).toMatchSnapshot();
  });
});
