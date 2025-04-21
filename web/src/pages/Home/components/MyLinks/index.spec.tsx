import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { MyLinks } from '@/pages/Home/components/MyLinks';

describe('My Links testes', () => {
  it('should render correctly', () => {
    const { container } = render(<MyLinks />);

    expect(container).toMatchSnapshot();
  });
});
