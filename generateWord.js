const CryptoJS = require('crypto-js');

const salt = CryptoJS.lib.WordArray.random(16).toString();
const iv = CryptoJS.lib.WordArray.random(16).toString();

console.log({
  salt,
  iv,
});
