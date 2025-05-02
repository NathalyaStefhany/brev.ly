import { env } from '@/env';
import axios from 'axios';

const baseURL = env.VITE_API_URL;

export const api = axios.create({
  baseURL,
});
