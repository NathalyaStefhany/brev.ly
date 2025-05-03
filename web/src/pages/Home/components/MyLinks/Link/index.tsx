import React from 'react';

import { Copy, Trash } from '@phosphor-icons/react';
import { IconButton } from '@/components/IconButton';

type LinkProps = {
  isFirstLink: boolean;
  info: {
    id: string;
    originalLink: string;
    shortenedLink: string;
    quantityAccesses: number;
  };
};

export const Link: React.FC<LinkProps> = ({
  isFirstLink,
  info: { id, originalLink, shortenedLink, quantityAccesses },
}) => {
  return (
    <div
      className="flex flex-row gap-8 md:gap-10 items-center border-t border-gray-200 pt-3 md:pt-4"
      style={{
        borderTopWidth: isFirstLink ? '0px' : '1px',
      }}
      data-testid={`container-${id}-link`}
    >
      <div className="flex flex-col flex-1 gap-2 overflow-hidden">
        <a
          href={`/${shortenedLink}`}
          className="text-md text-blue-base truncate"
          data-testid="link-shortened-link"
        >
          brev.ly/{shortenedLink}
        </a>

        <p
          className="text-sm text-gray-500 truncate"
          data-testid="text-original-link"
        >
          {originalLink}
        </p>
      </div>

      <p
        className="text-sm text-gray-500 whitespace-nowrap"
        data-testid="text-quantity-accesses"
      >
        {quantityAccesses} acessos
      </p>

      <div className="flex flex-row gap-2 items-center">
        <IconButton icon={Copy} />

        <IconButton icon={Trash} />
      </div>
    </div>
  );
};
