const PROXY_CONFIG = [
  {
    context: [
      "/login",
      "/staff"
    ],
    target: "http://192.168.10.119:8081",
    secure: false
  },
  {
    context: [
      "/upload"
    ],
    target: "http://192.168.10.119:8083",
    secure: false
  }
];

module.exports = PROXY_CONFIG;
