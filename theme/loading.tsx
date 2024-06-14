import { Spin } from '@arco-design/web-react';

export default () => {
  return (
    <Spin
      style={{
        background: '#eee',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  );
};
