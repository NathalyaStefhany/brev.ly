import React, { ComponentProps, ComponentType } from 'react';

import { IconProps } from '@phosphor-icons/react';

type IconButtonProps = ComponentProps<'button'> & {
  icon: ComponentType<IconProps>;
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  ...props
}) => {
  return (
    <button
      type="button"
      className="cursor-pointer transition-all duration-300 bg-gray-200 border border-gray-200 rounded-sm p-3.5 hover:not-disabled:border-blue-base disabled:opacity-50 disabled:cursor-not-allowed"
      {...props}
    >
      <Icon size="1rem" color="var(--color-gray-600)" />
    </button>
  );
};
