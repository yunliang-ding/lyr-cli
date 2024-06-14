import React from 'react';
import { useEffect } from 'react';
import Layout from './layout';
import Loading from './loading';
import uiStore from '@/store/ui';
import userStore from '@/store/user';
import { generate, getRgbStr } from '@arco-design/color';

export default ({ routerInterceptors }) => {
  const { fetchUserInfo } = userStore.useSnapshot();
  const { dark, status } = uiStore.useSnapshot();
  useEffect(() => {
    fetchUserInfo(uiStore);
  }, []);
  useEffect(() => {
    if (dark) {
      // 设置为暗黑主题
      document.body.setAttribute('arco-theme', 'dark');
    } else {
      // 恢复亮色主题
      document.body.removeAttribute('arco-theme');
    }
  }, [dark]);
  // 更新主题
  const setTheme = (newColor: string | undefined) => {
    const newList = generate(newColor, {
      list: true,
      dark,
    });
    newList.forEach((l, index) => {
      const rgbStr = getRgbStr(l);
      document.body.style.setProperty(`--arcoblue-${index + 1}`, rgbStr);
    });
    uiStore.primaryColor = newColor;
  };
  useEffect(() => {
    setTheme(uiStore.primaryColor);
  }, [uiStore.primaryColor]);
  let Vnode: any = null;
  if (status === 'loading') {
    Vnode = <Loading />;
  } else if (status === 'error') {
    Vnode = (
      <h1
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        系统异常，请稍后重试!
      </h1>
    );
  } else {
    Vnode = <Layout routerInterceptors={routerInterceptors} />;
  }
  return Vnode;
};
