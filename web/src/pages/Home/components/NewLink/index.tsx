import React from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

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

export const NewLink: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(newLinkSchema),
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSaveLink = (_data: NewLinkData): void => {
    return;
  };

  return (
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

      <Button type="submit" data-testid="button-save-link">
        Salvar link
      </Button>
    </form>
  );
};
