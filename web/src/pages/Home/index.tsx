import React from 'react';

import { NewLink } from '@/pages/Home/components/NewLink';
import logo from '@/assets/logo.svg';

export const Home: React.FC = () => {
  return (
    <main className="min-h-screen flex flex-col items-center py-16 px-6 bg-gray-200">
      <div className="flex flex-col items-start gap-16">
        <img
          src={logo}
          alt="Ícone de corrente azul representando um link ao lado do nome 'brev.ly' também em azul."
          className="h-12"
        />

        <div className="flex flex-row flex-wrap justify-center gap-10">
          <NewLink />
        </div>
      </div>
    </main>
  );
};
