const PROXY_CONFIG = [
  {
    context: [
      "/login",
      "/elder",
      "/staff"
    ],
    target: "http://192.168.10.110:8086",   //拦截 context配置路径，经过此地址
    secure: false
  },
  {
    context: [
      "/upload"
    ],
    target: "http://192.168.10.110:8083",   //拦截 context配置路径，经过此地址
    secure: false
  }
];

module.exports = PROXY_CONFIG;
