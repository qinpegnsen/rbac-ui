const PROXY_CONFIG = [
  {
    context: [
      "/dept",
      "/limit",
      "/limitFile",
      "/limitMenu",
      "/limitOpt",
      "/limitPage",
      "/login",
      "/orgManager",
      "/organ",
      "/role",
      "/roleGroup",
      "/staff",
      "/role",
      "/sys",
      "/res"
    ],
    target: "http://192.168.10.178:8082",   //拦截 context配置路径，经过此地址
    secure: false
  },
  {
    context: [
      "/upload"
    ],
    target: "http://192.168.10.178:8092",   //拦截 context配置路径，经过此地址
    secure: false
  }
];

module.exports = PROXY_CONFIG;
