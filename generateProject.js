require('dotenv').config();

const uuid = require('uuid');
const redis = require('redis');
const readlineSync = require('readline-sync');
const CryptoJS = require('crypto-js');

const client = redis.createClient({ url: process.env.REDIS });

const keySize = 256;
const iterations = 100;
const salt = CryptoJS.enc.Hex.parse(process.env.SALT);
const iv = CryptoJS.enc.Hex.parse(process.env.IV);
const pass = process.env.SECRET_KEY;

const encryptData = (originalMessage) => {
  try {
    const key = CryptoJS.PBKDF2(pass, salt, {
      keySize: keySize / 32,
      iterations: iterations,
    });

    const encrypted = CryptoJS.AES.encrypt(originalMessage, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    });

    return Buffer.from(encrypted.toString(), 'utf8').toString('base64');
  } catch (error) {
    throw new Error('ERROR ENCRYPT');
  }
};

client.on('error', (e) => {
  console.log(e);
});
client.on('ready', () => {
  console.log(`Redis Connected ${process.env.REDIS}`);
});

client
  .connect()
  .then(async () => {
    const name = readlineSync.question('input your project name : ');
    const description = readlineSync.question('input your project description : ');
    const url = readlineSync.question('input your project site URL : ');
    const icon = readlineSync.question('input your project icon URL : ');
    const callback = readlineSync.question('input your project sign callback URL : ');
    const verifyRequest = readlineSync.question('input your project verify request URL : ');

    const projectId = uuid.v4();
    const projectSecretKey = encryptData(projectId);

    client.hSet(projectId, 'name', name);
    client.hSet(projectId, 'description', description);
    client.hSet(projectId, 'url', url);
    client.hSet(projectId, 'icon', icon);
    client.hSet(projectId, 'callback', callback);
    client.hSet(projectId, 'verifyRequest', verifyRequest);

    console.log({
      name,
      description,
      url,
      icon,
      callback,
      verifyRequest,
    });
    console.log(
      '=========================================================================================================================='
    );
    console.log('PROJECT ID : ' + projectId);
    console.log('PROJECT SECRET KEY : ' + projectSecretKey);
    console.log(
      '=========================================================================================================================='
    );

    process.exit();
  })
  .catch((e) => console.log(e));
