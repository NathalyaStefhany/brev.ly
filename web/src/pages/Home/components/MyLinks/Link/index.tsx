import React, { useState } from 'react';

import { Copy, Trash, WarningCircle, X } from '@phosphor-icons/react';
import * as Toast from '@radix-ui/react-toast';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { IconButton } from '@/components/IconButton';
import { Button } from '@/components/Button';
import { api } from '@/service/api';
import { queryClient } from '@/service/queryClient';

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
  const [linkCopied, setLinkCopied] = useState(false);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { id, originalLink, shortenedLink, quantityAccesses } = info ?? {};

  const handleCopyShortenedLink = (): void => {
    const link = `${window.location.origin}/${shortenedLink}`;

    navigator.clipboard.writeText(link);

    setLinkCopied(true);
  };

  const handleDeleteLink = async (): Promise<void> => {
    setIsDeleting(true);

    await api.delete(`/shortened-links/${id}`);

    queryClient.refetchQueries({ queryKey: ['links list'], exact: true });

    setIsDeleting(false);
    setOpenDeleteDialog(false);
  };

  return (
    <>
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
              <IconButton
                icon={Copy}
                onClick={handleCopyShortenedLink}
                data-testid="button-copy"
              />

              <AlertDialog.Root
                open={openDeleteDialog}
                onOpenChange={setOpenDeleteDialog}
              >
                <AlertDialog.Overlay className="fixed inset-0 bg-gray-600/30 z-2" />

                <AlertDialog.Trigger asChild>
                  <IconButton icon={Trash} data-testid="button-delete" />
                </AlertDialog.Trigger>

                <AlertDialog.Content
                  className="w-150 z-3 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg shadow-gray-400 p-8 rounded-lg"
                  data-testid="container-delete-confirmation"
                >
                  <AlertDialog.Title className="text-lg text-gray-600 mb-4">
                    Apagar link
                  </AlertDialog.Title>

                  <AlertDialog.Description className="text-sm text-gray-600 mb-12">
                    Você realmente quer apagar o link {shortenedLink}?
                  </AlertDialog.Description>

                  <div className="flex flex-row gap-4 justify-end">
                    <AlertDialog.Cancel asChild>
                      <Button
                        variant="secondary"
                        style={{ padding: '0.5rem 1.25rem' }}
                        data-testid="button-cancel-deletion"
                      >
                        Cancelar
                      </Button>
                    </AlertDialog.Cancel>

                    <Button
                      onClick={handleDeleteLink}
                      isLoading={isDeleting}
                      disabled={isDeleting}
                      style={{
                        width: 'fit-content',
                        padding: '0.5rem 1.25rem',
                        borderRadius: '4px',
                      }}
                      data-testid="button-delete-confirmation"
                    >
                      Apagar
                    </Button>
                  </div>
                </AlertDialog.Content>
              </AlertDialog.Root>
            </>
          )}
        </div>
      </div>

      <Toast.Provider swipeDirection="right">
        <Toast.Root
          open={linkCopied}
          onOpenChange={setLinkCopied}
          duration={3000}
          className="max-w-screen w-180 flex flex-row gap-6 items-start justify-start bg-[#d6d8ef] p-8 rounded-lg shadow-lg shadow-gray-300"
          data-testid="toast-shortened-link-copied"
        >
          <WarningCircle
            color="var(--color-blue-base)"
            size="1.25rem"
            weight="fill"
          />

          <div className="flex-1">
            <Toast.Title className="text-md text-blue-base">
              Link copiado com sucesso
            </Toast.Title>

            <Toast.Description className="text-sm text-blue-base mt-2">
              O link {shortenedLink} foi copiado para a área de transferência
            </Toast.Description>
          </div>

          <Toast.Action
            altText="Botão para fechar a caixa de aviso"
            className="cursor-pointer text-blue-base"
          >
            <X />
          </Toast.Action>
        </Toast.Root>

        <Toast.Viewport className="z-1 fixed bottom-6 left-1/2 transform -translate-x-1/2 md:bottom-12 md:right-12 md:left-auto md:transform-none md:translate-x-0" />
      </Toast.Provider>
    </>
  );
};
