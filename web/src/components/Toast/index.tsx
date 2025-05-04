import React from 'react';

import * as ToastRadix from '@radix-ui/react-toast';
import { WarningCircle, X } from '@phosphor-icons/react';

type ToastProps = {
  id: string;
  type: 'error' | 'information';
  title: string;
  description: string;
  duration?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  description,
  duration = 5000,
  open,
  onOpenChange,
}) => {
  const color = type === 'error' ? 'danger' : 'blue-base';

  const textColor = `text-${color}`;
  const backgroundColor = type === 'error' ? '#f1d4da' : '#d6d8ef';

  return (
    <ToastRadix.Provider swipeDirection="right">
      <ToastRadix.Root
        open={open}
        onOpenChange={onOpenChange}
        duration={duration}
        className={`max-w-screen w-180 flex flex-row gap-6 items-start justify-start bg-[${backgroundColor}] p-8 rounded-lg shadow-lg shadow-gray-300`}
        data-testid={id}
      >
        <WarningCircle
          color={`var(--color-${color})`}
          size="1.25rem"
          weight="fill"
        />

        <div className="flex-1">
          <ToastRadix.Title className={`text-md ${textColor}`}>
            {title}
          </ToastRadix.Title>

          <ToastRadix.Description className={`text-sm ${textColor} mt-2`}>
            {description}
          </ToastRadix.Description>
        </div>

        <ToastRadix.Action
          altText="Botão para fechar a caixa de aviso"
          className={`cursor-pointer ${textColor}`}
        >
          <X />
        </ToastRadix.Action>
      </ToastRadix.Root>

      <ToastRadix.Viewport className="z-3 fixed bottom-6 left-1/2 transform -translate-x-1/2 md:bottom-12 md:right-12 md:left-auto md:transform-none md:translate-x-0" />
    </ToastRadix.Provider>
  );
};
