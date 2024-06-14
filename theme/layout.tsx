/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { AppLayout } from 'lyr-component';
import { Menu } from '@arco-design/web-react';
import uiStore from '@/store/ui';
import userStore from '@/store/user';
import breadcrumbStore from '@/store/breadcrumb';
import Footer from './footer';
import { outLogin } from '@/services';
import { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { logo } from 'lyr';

export default () => {
  const layoutRef: any = useRef({});
  const breadcrumb = breadcrumbStore.useSnapshot();
  const { dark, title, collapsed, primaryColor, layout } = uiStore.useSnapshot();
  const { name, avatarUrl, menus } = userStore.useSnapshot();
  const setCollapsed = (v: boolean) => {
    uiStore.collapsed = v;
  };
  // 使用 AppLayout 内置的 监听 hash 方法
  useEffect(() => {
    const removeListener = layoutRef.current.listenHashChange(
      ({ currentBreadcrumb }) => {
        /** 设置当前路由的默认面包屑 */
        breadcrumbStore.title = currentBreadcrumb.title;
        breadcrumbStore.breadcrumb = currentBreadcrumb.breadcrumb;
      },
    );
    return removeListener;
  }, []);
  return (
    <AppLayout
      layoutRef={layoutRef}
      layout={layout}
      waterMarkProps={{
        gap: [200, 200],
        content: `welcome-${name}`,
        zIndex: 10,
        fontStyle: {
          color: dark ? 'rgba(255, 255, 255, .15)' : 'rgba(0, 0, 0, .15)',
          fontSize: 12,
        },
      }}
      logo={logo}
      collapsed={collapsed}
      onCollapse={setCollapsed}
      title={title}
      dark={dark}
      menu={{
        items: menus,
        onClick: ({ path }: any) => {
          location.hash = path;
        },
      }}
      rightContentProps={{
        userName: name,
        droplist: (
          <Menu>
            <Menu.Item key="logout" onClick={outLogin}>
              切换用户
            </Menu.Item>
          </Menu>
        ),
        avatarUrl,
        themeColor: primaryColor,
        onThemeColorChange: (newColor) => {
          uiStore.primaryColor = newColor;
        },
        onDarkChange: (dark) => {
          uiStore.dark = dark;
        },
      }}
      pageHeaderProps={breadcrumb}
      footerRender={() => <Footer />}
      siderFooterRender={() => null}
    >
      <Outlet />
    </AppLayout>
  );
};
