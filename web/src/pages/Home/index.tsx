import React from 'react';

import { NewLink } from '@/pages/Home/components/NewLink';
import logo from '@/assets/logo.svg';
import { MyLinks } from '@/pages/Home/components/MyLinks';

export const Home: React.FC = () => {
  return (
    <main
      className="min-h-screen flex flex-col items-center py-16 px-6 bg-gray-200"
      data-testid="container-home-page"
    >
      <div className="w-full md:max-w-490 md:w-[calc(100vw - 1.5rem)] md:mt-25 flex flex-col items-center md:items-start gap-16">
        <img
          src={logo}
          alt="Ícone de corrente azul representando um link ao lado do nome 'brev.ly' também em azul."
          className="h-12"
        />

        <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-center gap-6 md:gap-10">
          <NewLink />

          <MyLinks />
        </div>
      </div>
    </main>
  );
};
