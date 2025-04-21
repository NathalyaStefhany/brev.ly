import { createBrowserRouter } from 'react-router';
import { Home } from '@/pages/Home';
import { NotFound } from '@/pages/NotFound';

export const router = createBrowserRouter([
  { path: '/', Component: Home },
  { path: '*', Component: NotFound },
]);
