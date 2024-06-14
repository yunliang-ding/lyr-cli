/* eslint-disable no-console */
import { Result, Button } from '@arco-design/web-react';
import { IconRobot } from '@arco-design/web-react/icon';
import { useRouteError } from 'react-router-dom';

export default () => {
  const error = useRouteError();
  return (
    <Result
      status="warning"
      icon={<IconRobot />}
      title={
        <div>
          <h1>很抱歉，页面出现了一些问题</h1>
          <span style={{ color: 'red' }}>{String(error)}</span>
        </div>
      }
      extra={
        <>
          <Button
            type="dashed"
            style={{ marginLeft: 20 }}
            onClick={() => {
              window.location.reload();
            }}
          >
            重新加载
          </Button>
        </>
      }
    />
  );
};
