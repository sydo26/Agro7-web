import axios from 'axios';
import { getCookieFromBrowser } from '../helpers/cookies';
import { AUTH_COOKIE_TOKEN } from './constants';

export const api = axios.create({
  baseURL: 'https://agro7.herokuapp.com'
});

api.interceptors.request.use(config => {
  const token = getCookieFromBrowser(AUTH_COOKIE_TOKEN);
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});
