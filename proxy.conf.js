const PROXY_CONFIG = [
  {
    context: [
      "/login",
      "/staff"
    ],
    target: "http://192.168.10.119:8081",   //拦截 context配置路径，经过此地址
    secure: false
  },
  {
    context: [
      "/upload"
    ],
    target: "http://192.168.10.119:8083",   //拦截 context配置路径，经过此地址
    secure: false
  }
];

module.exports = PROXY_CONFIG;
