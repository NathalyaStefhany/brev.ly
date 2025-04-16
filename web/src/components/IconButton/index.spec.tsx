import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Trash } from '@phosphor-icons/react';

import { IconButton } from '.';

describe('IconButton tests', () => {
  it('should render correctly', () => {
    const { container } = render(<IconButton icon={Trash} />);

    expect(container).toMatchSnapshot();
  });
});
