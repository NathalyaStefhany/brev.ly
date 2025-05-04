import React, { useEffect } from 'react';

import { createBrowserRouter, RouterProvider } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { routesConfig } from '@/routes';
import { queryClient } from '@/service/queryClient';
import { refetchChannel } from '@/service/broadcastChannel';

const router = createBrowserRouter(routesConfig);

export const App: React.FC = () => {
  useEffect(() => {
    const onMessage = (event: MessageEvent): void => {
      queryClient.refetchQueries(event.data);
    };

    refetchChannel.onmessage = onMessage;

    return (): void => {
      refetchChannel.onmessage = null;
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
