import React, { useState } from 'react';

import { Copy, Trash } from '@phosphor-icons/react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { IconButton } from '@/components/IconButton';
import { Button } from '@/components/Button';
import { api } from '@/service/api';
import { queryClient } from '@/service/queryClient';
import { Toast } from '@/components/Toast';

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
  const [deletionError, setDeletionError] = useState(false);

  const { id, originalLink, shortenedLink, quantityAccesses } = info ?? {};

  const handleCopyShortenedLink = (): void => {
    const link = `${window.location.origin}/${shortenedLink}`;

    navigator.clipboard.writeText(link);

    setLinkCopied(true);
  };

  const handleDeleteLink = async (): Promise<void> => {
    setIsDeleting(true);

    try {
      await api.delete(`/shortened-links/${shortenedLink}`);

      queryClient.refetchQueries({ queryKey: ['links list'], exact: true });

      setOpenDeleteDialog(false);
    } catch {
      setDeletionError(true);
    }

    setIsDeleting(false);
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
              target="_blank"
              rel="noreferrer"
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

      <Toast
        id="toast-shortened-link-copied"
        type="information"
        title="Link copiado com sucesso"
        description={`O link ${shortenedLink} foi copiado para a área de transferência`}
        duration={3000}
        open={linkCopied}
        onOpenChange={setLinkCopied}
      />

      <Toast
        id="toast-deletion-error"
        type="error"
        title="Erro ao deletar"
        description="Por favor, tente novamente mais tarde."
        open={deletionError}
        onOpenChange={setDeletionError}
      />
    </>
  );
};
