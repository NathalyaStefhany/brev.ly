import { Warning } from '@phosphor-icons/react';
import React, { ComponentProps } from 'react';

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
  base: 'peer text-md text-gray-600 font-normal border border-gray-300 caret-blue-base rounded-lg px-8 py-7 placeholder:text-gray-400',
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
  error?: string;
};

export const Input: React.FC<InputProps> = ({ id, label, error, ...props }) => {
  const intent = error ? 'error' : 'default';

  return (
    <div className="max-w-176 w-full flex flex-col-reverse gap-4">
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
        {...props}
      />

      <label htmlFor={id} className={labelVariants({ intent })}>
        {label}
      </label>
    </div>
  );
};
