import { describe, expect, it } from 'vitest';
import { act, render } from '@testing-library/react';
import { Home } from '@/pages/Home';

describe('Home page tests', () => {
  it('should render correctly', async () => {
    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
      expect(render(<Home />));
    });
  });
});
