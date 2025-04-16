import React, { ComponentProps, ComponentType } from 'react';

import { tv, VariantProps } from 'tailwind-variants';
import { IconProps } from '@phosphor-icons/react';

const buttonVariants = tv({
  base: 'flex flex-row gap-3 items-center justify-center cursor-pointer transition-all duration-300 disabled:cursor-not-allowed',
  variants: {
    variant: {
      primary:
        'max-w-176 w-full bg-blue-base text-md text-white rounded-lg px-10 py-7.5 hover:not-disabled:bg-blue-dark disabled:opacity-50',
      secondary:
        'bg-gray-200 border border-gray-200 text-sm font-semibold text-gray-500 rounded-sm p-3.5 hover:not-disabled:border-blue-base disabled:opacity-50',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    icon?: ComponentType<IconProps>;
  };

export const Button: React.FC<ButtonProps> = ({
  variant,
  icon: Icon,
  children,
  ...props
}) => {
  return (
    <button type="button" className={buttonVariants({ variant })} {...props}>
      {Icon && (
        <Icon
          size="1rem"
          color="var(--color-gray-600)"
          data-testid="button-icon"
        />
      )}

      {children}
    </button>
  );
};
