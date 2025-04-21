import { RouteObject } from 'react-router';
import { Home } from '@/pages/Home';
import { NotFound } from '@/pages/NotFound';

export const routesConfig: RouteObject[] = [
  { path: '/', Component: Home },
  { path: '*', Component: NotFound },
];
