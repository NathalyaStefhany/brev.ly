import React from 'react';

import { Copy, Trash } from '@phosphor-icons/react';
import { IconButton } from '@/components/IconButton';

type LinkProps = {
  isFirstLink?: boolean;
  isLoading?: boolean;
  info?: {
    id: string;
    originalLink: string;
    shortenedLink: string;
    quantityAccesses: number;
  };
};

export const Link: React.FC<LinkProps> = ({
  isFirstLink = false,
  isLoading = false,
  info,
}) => {
  const { id, originalLink, shortenedLink, quantityAccesses } = info ?? {};

  return (
    <div
      className="flex flex-row gap-8 md:gap-10 items-center border-t border-gray-200 pt-3 md:pt-4"
      style={{
        borderTopWidth: isFirstLink ? '0px' : '1px',
      }}
      data-testid={
        isLoading ? `container-loading-link` : `container-${id}-link`
      }
    >
      <div className="flex flex-col flex-1 gap-2 overflow-hidden">
        {isLoading ? (
          <div className="h-9 w-2/4 bg-gray-300 rounded animate-pulse" />
        ) : (
          <a
            href={`/${shortenedLink}`}
            className="text-md text-blue-base truncate"
            data-testid="link-shortened-link"
          >
            brev.ly/{shortenedLink}
          </a>
        )}

        {isLoading ? (
          <div className="h-8 w-3/4 bg-gray-300 rounded animate-pulse" />
        ) : (
          <p
            className="text-sm text-gray-500 truncate"
            data-testid="text-original-link"
          >
            {originalLink}
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="h-8 w-27 bg-gray-300 rounded animate-pulse" />
      ) : (
        <p
          className="text-sm text-gray-500 whitespace-nowrap"
          data-testid="text-quantity-accesses"
        >
          {quantityAccesses} acessos
        </p>
      )}

      <div className="flex flex-row gap-2 items-center">
        {isLoading ? (
          <>
            <div className="h-16 w-16 bg-gray-300 rounded animate-pulse" />{' '}
            <div className="h-16 w-16 bg-gray-300 rounded animate-pulse" />
          </>
        ) : (
          <>
            <IconButton icon={Copy} />

            <IconButton icon={Trash} />
          </>
        )}
      </div>
    </div>
  );
};
