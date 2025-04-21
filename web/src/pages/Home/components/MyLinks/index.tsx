import { Button } from '@/components/Button';
import { DownloadSimple, Link } from '@phosphor-icons/react';
import React from 'react';

export const MyLinks: React.FC = () => {
  const listOfLinksIsEmpty = true;

  return (
    <div className="max-w-190 w-full md:max-w-290 md:min-w-190 h-fit flex flex-col flex-1 gap-8 md:gap-10 bg-gray-100 rounded-lg p-12 md:p-16">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-lg text-gray-600">Meus links</h2>

        <Button variant="secondary" icon={DownloadSimple} disabled>
          Baixar CSV
        </Button>
      </div>

      <div className="border-t border-gray-200">
        {listOfLinksIsEmpty && (
          <div className="flex flex-col items-center justify-center gap-6 mt-8 mb-12">
            <Link size="2rem" color="var(--color-gray-400)" />

            <p className="text-xs text-gray-500 uppercase text-center">
              Ainda não existem links cadastrados
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
