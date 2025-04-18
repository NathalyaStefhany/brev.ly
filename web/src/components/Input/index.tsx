import { getTextWidth } from '@/utils/getTextWidth';
import { Warning } from '@phosphor-icons/react';
import React, { ComponentProps, useEffect, useState } from 'react';

import { tv } from 'tailwind-variants';

const labelVariants = tv({
  base: 'text-xs text-gray-500 uppercase focus:font-bold peer-focus:font-bold',
  variants: {
    intent: {
      default: 'peer-focus:text-blue-base',
      error: 'peer-focus:text-danger',
    },
  },
  defaultVariants: {
    intent: 'default',
  },
});

const inputVariants = tv({
  base: 'peer text-md text-gray-600 font-normal border border-gray-300 caret-blue-base rounded-lg py-7 placeholder:text-gray-400',
  variants: {
    intent: {
      default: 'focus:outline-blue-base',
      error: 'focus:outline-danger',
    },
  },
  defaultVariants: {
    intent: 'default',
  },
});

type InputProps = ComponentProps<'input'> & {
  id: string;
  label: string;
  fixedPlaceholder?: string;
  error?: string;
};

export const Input: React.FC<InputProps> = ({
  id,
  label,
  error,
  fixedPlaceholder,
  ...props
}) => {
  const [fixedPlaceholderWidth, setFixedPlaceholderWidth] = useState(0);

  useEffect(() => {
    document.fonts.ready.then(() => {
      const width = fixedPlaceholder
        ? getTextWidth(fixedPlaceholder, '14px Open Sans')
        : 0;

      setFixedPlaceholderWidth(width);
    });
  }, [fixedPlaceholder]);

  const intent = error ? 'error' : 'default';

  return (
    <div className="relative max-w-176 w-full flex flex-col-reverse gap-4">
      {error && (
        <div className="flex flex-row items-center gap-4">
          <Warning size="1rem" color="var(--color-danger)" />

          <span
            id={`${id}-error`}
            className="text-sm text-gray-500"
            data-testid={`${id}-error`}
          >
            {error}
          </span>
        </div>
      )}

      <input
        id={id}
        type="text"
        aria-invalid={!!error}
        aria-describedby={`${id}-error`}
        className={inputVariants({ intent })}
        style={{
          paddingLeft: `calc(${fixedPlaceholderWidth / 16}rem + 1rem)`,
          paddingRight: '1rem',
        }}
        {...props}
      />

      {fixedPlaceholder && (
        <span
          data-testid={`${id}-fixed-placeholder`}
          className="absolute top-18.5 left-8.5 text-md text-gray-400 font-normal"
        >
          {fixedPlaceholder}
        </span>
      )}

      <label htmlFor={id} className={labelVariants({ intent })}>
        {label}
      </label>
    </div>
  );
};
