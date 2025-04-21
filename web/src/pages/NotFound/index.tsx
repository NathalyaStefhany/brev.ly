import React from 'react';

import notFoundImage from '@/assets/404.svg';

export const NotFound: React.FC = () => {
  return (
    <main className="w-screen min-h-screen flex flex-row items-center justify-center p-6 bg-gray-200">
      <div className="max-w-290 w-fit h-fit flex flex-col gap-12 items-center text-center bg-gray-100 rounded-lg px-24 py-32">
        <img
          src={notFoundImage}
          alt="Número 404 representando o erro retornado ao acessar a página"
          className="h-42.5"
        />

        <h1 className="text-xl text-gray-600">Link não encontrado</h1>

        <p className="text-md text-gray-500">
          O link que você está tentando acessar não existe, foi removido ou é
          uma URL inválida. Saiba mais em{' '}
          <a href="/" className="text-blue-base underline">
            brev.ly
          </a>
          .
        </p>
      </div>
    </main>
  );
};
