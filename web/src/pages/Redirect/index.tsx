import React from 'react';

import logoIcon from '@/assets/logo-icon.svg';

export const Redirect: React.FC = () => {
  return (
    <main
      className="w-screen min-h-screen flex flex-row items-center justify-center p-6 bg-gray-200"
      data-testid="container-redirect-page"
    >
      <div className="max-w-290 w-full h-fit flex flex-col gap-12 items-center text-center bg-gray-100 rounded-lg px-10 py-24 md:px-24 md:py-32">
        <img
          src={logoIcon}
          alt="Logotipo do site com um ícone de corrente azul que representa um link."
          className="h-24"
        />

        <h1 className="text-xl text-gray-600">Redirecionando...</h1>

        <div className="flex flex-col gap-2">
          <p className="text-md text-gray-500">
            O link será aberto automaticamente em alguns instantes.
          </p>

          <p className="text-md text-gray-500">
            Não foi redirecionado?{' '}
            <a
              href="/"
              className="text-blue-base underline"
              data-testid="link-access-here"
            >
              Acesse aqui
            </a>
          </p>
        </div>
      </div>
    </main>
  );
};
