require('dotenv').config();

const uuid = require('uuid');
const redis = require('redis');
const readlineSync = require('readline-sync');

const client = redis.createClient({ url: process.env.REDIS });

const SERVICE_ADD_PREFIX = process.env.SERVICE_ADD_PREFIX;

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
      const projectId = readlineSync.question('input your project Id : ');
      const serviceId = readlineSync.question('input your service Id : ');

      const requestKey = uuid.v4();

      const addData = {
        projectId,
        serviceId,
      };

      await client.hSet(`${SERVICE_ADD_PREFIX}`, requestKey, JSON.stringify(addData));

      const getAddData = await client.hGet(`${SERVICE_ADD_PREFIX}`, requestKey);
      const addDataJSON = JSON.parse(getAddData);

      for (let key in addData) {
        if (addData[key] !== addDataJSON[key]) {
          throw new Error('FAILED NEW SERVICE ADD');
        }
      }

      console.log(addData);
      console.log(
        '=========================================================================================================================='
      );
      console.log('REQUEST ID : ' + requestKey);
      console.log(
        '=========================================================================================================================='
      );
    } catch (e) {
      console.log(e);
    }

    process.exit();
  })
  .catch((e) => console.log(e));
