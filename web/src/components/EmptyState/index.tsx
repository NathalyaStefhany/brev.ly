import React, { ComponentProps, ReactElement } from 'react';

type EmptyStateProps = {
  icon: ReactElement;
  description: string;
} & ComponentProps<'div'>;

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  description,
  ...props
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center gap-6 mt-16 mb-12"
      {...props}
    >
      {icon}

      <p className="text-xs text-gray-500 uppercase text-center">
        {description}
      </p>
    </div>
  );
};
