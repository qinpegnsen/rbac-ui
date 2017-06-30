const PROXY_CONFIG = [
  {
    context: [
      "/"
    ],
    target: "http://192.168.10.119:8081",
    secure: false
  }
];

module.exports = PROXY_CONFIG;
