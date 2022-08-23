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
  process.exit();
});
client.on('ready', () => {
  console.log(`Redis Connected ${process.env.REDIS}`);
});

client
  .connect()
  .then(async () => {
    try {
      const name = readlineSync.question('input your project name : ');
      const description = readlineSync.question('input your project description : ');
      const url = readlineSync.question('input your project site URL : ');
      const icon = readlineSync.question('input your project icon URL : ');
      const callback = readlineSync.question('input your project sign callback URL : ');
      const verifyRequest = readlineSync.question('input your project verify request URL : ');

      const projectId = uuid.v4();
      const projectSecretKey = encryptData(projectId);

      await client.hSet(projectId, 'name', name);
      await client.hSet(projectId, 'description', description);
      await client.hSet(projectId, 'url', url);
      await client.hSet(projectId, 'icon', icon);
      await client.hSet(projectId, 'callback', callback);
      await client.hSet(projectId, 'verifyRequest', verifyRequest);

      const projectData = {
        name,
        description,
        url,
        icon,
        callback,
        verifyRequest,
      };

      const getProjectData = await client.hGetAll(projectId);

      for (let key in getProjectData) {
        if (projectData[key] !== getProjectData[key]) {
          throw new Error('FAILED NEW PROJECT');
        }
      }

      console.log(projectData);
      console.log(
        '=========================================================================================================================='
      );
      console.log('PROJECT ID : ' + projectId);
      console.log('PROJECT SECRET KEY : ' + projectSecretKey);
      console.log(
        '=========================================================================================================================='
      );
    } catch (e) {
      console.log(e);
    }

    process.exit();
  })
  .catch((e) => console.log(e));