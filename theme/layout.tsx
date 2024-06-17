import React from 'react';
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

export default ({ routerInterceptors }) => {
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
  const VNode = routerInterceptors?.();
  return (
    <AppLayout
      layoutRef={layoutRef}
      layout={layout}
      themeColor={primaryColor}
      onSetting={(value: any) => {
        if (value.themeColor) {
          uiStore.primaryColor = value.themeColor;
        } else if (value.layout) {
          uiStore.layout = value.layout
        };
      }}
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
      onDarkChange={(dark) => {
        uiStore.dark = dark;
      }}
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
      }}
      pageHeaderProps={breadcrumb}
      footerRender={() => <Footer />}
      siderFooterRender={() => null}
    >
      {VNode ? VNode : <Outlet />}
    </AppLayout>
  );
};
