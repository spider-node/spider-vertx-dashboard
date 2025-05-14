import { removeToken } from '@/utils/auth';

export default () => {
  removeToken();
  window.location.href = '/#/login';
};
