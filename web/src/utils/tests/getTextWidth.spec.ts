import { describe, expect, it, vi } from 'vitest';
import { getTextWidth } from '@/utils/getTextWidth';

describe('getTextWidth tests', () => {
  it('should return width from measureText', () => {
    const mockMeasureText = vi.fn().mockReturnValue({ width: 123 });

    const mockContext = {
      font: '',
      measureText: mockMeasureText,
    };

    const mockCreateElement = vi
      .spyOn(document, 'createElement')
      .mockReturnValue({
        getContext: () => mockContext,
      } as unknown as HTMLCanvasElement);

    const width = getTextWidth('Test', '14px Open Sans');

    expect(mockMeasureText).toHaveBeenCalledWith('Test');
    expect(width).toBe(123);

    mockCreateElement.mockRestore();
  });

  it('should return 0 if context is null', () => {
    const mockCreateElement = vi
      .spyOn(document, 'createElement')
      .mockReturnValue({
        getContext: () => null,
      } as unknown as HTMLCanvasElement);

    const width = getTextWidth('Test', '14px Open Sans');

    expect(width).toBe(0);

    mockCreateElement.mockRestore();
  });
});
