import NoMatch from '@/pages/404';
import NoAuthority from '@/pages/403';
import { initData } from './index';

export default ({ path, component }: { path: string; component: any }) => {
  if (path === '/404') {
    return {
      path: '*',
      element: <NoMatch />,
    };
  }
  return {
    path,
    element:
      initData.auth.includes(component.type.auth) ||
      component.type.auth === undefined ? (
        component
      ) : (
        <NoAuthority />
      ),
  };
};
