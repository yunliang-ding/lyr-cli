const net = require('net');
const os = require('os');

// 获取空闲端口
exports.getAvailablePort = async function (port) {
  const portUsed = (port) => {
    const server = net.createServer().listen(port);
    return new Promise((resolve) => {
      server.on('listening', () => {
        server.close();
        resolve(false);
      });
      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          resolve(true);
        }
      });
    });
  };
  const tryUsePort = async function (port, resolve) {
    const res = await portUsed(port);
    if (res) {
      port++;
      tryUsePort(port, resolve);
    } else {
      resolve(port);
      return port;
    }
  };
  return new Promise((resolve) => {
    tryUsePort(port, resolve);
  });
};

// 获取本地ip
exports.getIPAddress = async function () {
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (
        alias.family === 'IPv4' &&
        alias.address !== '127.0.0.1' &&
        !alias.internal
      ) {
        return alias.address;
      }
    }
  }
};
