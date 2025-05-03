import React, { useState } from 'react';

import { useForm } from 'react-hook-form';
import * as Toast from '@radix-ui/react-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { api } from '@/service/api';
import { WarningCircle, X } from '@phosphor-icons/react';
import { AxiosError } from 'axios';
import { queryClient } from '@/service/queryClient';

const originalLinkErrorMessage = 'Informe uma url válida.';
const shortenedLinkErrorMessage =
  'Informe uma url minúscula e sem espaço/caracter especial.';

const newLinkSchema = z
  .object({
    originalLink: z
      .string()
      .min(1, originalLinkErrorMessage)
      .refine((value) => {
        try {
          new URL(value);

          return true;
        } catch {
          return /^(www\.)[\w-]+\.[a-z]{2,}(\.[a-z]{2,})?(\/[^\s]*)?$/i.test(
            value,
          );
        }
      }, originalLinkErrorMessage),
    shortenedLink: z
      .string()
      .min(1, shortenedLinkErrorMessage)
      .regex(/^[a-z0-9-]+$/, shortenedLinkErrorMessage),
  })
  .required();

type NewLinkData = z.infer<typeof newLinkSchema>;

type ErrorData = {
  message?: string;
};

export const NewLink: React.FC = () => {
  const [openToastError, setOpenToastError] = useState(false);
  const [errorCreatingNewLink, setErrorCreatingNewLink] = useState({
    title: '',
    description: '',
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(newLinkSchema),
  });

  const handleSaveLink = async (data: NewLinkData): Promise<void> => {
    try {
      await api.post('/shortened-links', data);

      queryClient.refetchQueries({ queryKey: ['links list'], exact: true });

      reset();
    } catch (error) {
      const err = error as AxiosError;

      let description = 'Por favor, tente novamente mais tarde.';

      const errorData = err.response?.data as ErrorData;

      if (
        err.status === 400 &&
        errorData?.message === 'Shortened link already exists'
      ) {
        description = 'Esse link encurtado já existe.';
      }

      setErrorCreatingNewLink({
        title: 'Erro no cadastro',
        description,
      });

      setOpenToastError(true);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleSaveLink)}
        className="max-w-190 w-full md:min-w-145 flex flex-col flex-1 gap-10 md:gap-12 bg-gray-100 rounded-lg p-12 md:p-16"
      >
        <h2 className="text-lg text-gray-600">Novo link</h2>

        <div className="flex flex-col gap-8">
          <Input
            id="input-original-link"
            label="Link Original"
            placeholder="www.exemplo.com.br"
            error={errors.originalLink?.message}
            data-testid="input-original-link"
            {...register('originalLink')}
          />

          <Input
            id="input-shortened-link"
            label="Link Encurtado"
            fixedPlaceholder="brev.ly/"
            error={errors.shortenedLink?.message}
            data-testid="input-shortened-link"
            {...register('shortenedLink')}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          data-testid="button-save-link"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar link'}
        </Button>
      </form>

      <Toast.Provider swipeDirection="right">
        <Toast.Root
          open={openToastError}
          onOpenChange={setOpenToastError}
          duration={5000}
          className="w-150 flex flex-row gap-6 items-start justify-start bg-[#f1d4da] p-8 rounded-lg shadow-lg shadow-gray-300"
          data-testid="toast-creation-error"
        >
          <WarningCircle
            color="var(--color-danger)"
            size="1.25rem"
            weight="fill"
          />

          <div className="flex-1">
            <Toast.Title className="text-md text-danger">
              {errorCreatingNewLink.title}
            </Toast.Title>

            <Toast.Description className="text-sm text-danger mt-2">
              {errorCreatingNewLink.description}
            </Toast.Description>
          </div>

          <Toast.Action
            altText="Botão para fechar a caixa de erro"
            className="cursor-pointer text-danger"
          >
            <X />
          </Toast.Action>
        </Toast.Root>

        <Toast.Viewport className="fixed bottom-6 left-1/2 transform -translate-x-1/2 md:bottom-12 md:right-12 md:left-auto md:transform-none md:translate-x-0" />
      </Toast.Provider>
    </>
  );
};
