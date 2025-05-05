import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Spinner } from '@/components/Spinner';

describe('Spinner tests', () => {
  it('should render correctly', () => {
    const { container } = render(<Spinner />);

    expect(container).toMatchSnapshot();
  });
});
