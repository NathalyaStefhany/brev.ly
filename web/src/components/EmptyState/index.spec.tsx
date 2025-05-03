import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Trash } from '@phosphor-icons/react';
import { EmptyState } from '@/components/EmptyState';

describe('Empty state tests', () => {
  it('should render correclty', () => {
    const { container } = render(
      <EmptyState icon={<Trash />} description="Empty state description" />,
    );

    expect(container).toMatchSnapshot();
  });
});
