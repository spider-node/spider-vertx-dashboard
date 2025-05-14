import { inject } from 'vue';

export const usePageTag = () => {
  const hasPageTag = inject('hasPageTag');
  return { hasPageTag };
};
