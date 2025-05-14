import { localStorageSet, localStorageGet } from './localStorage';

const TokenKey = 'TokenKey';

export function getToken() {
  return localStorageGet(TokenKey);
}

export function setToken(token) {
  return localStorageSet(TokenKey, `Bearer ${token}`);
}

export function removeToken() {
  return localStorage.removeItem(TokenKey);
}
