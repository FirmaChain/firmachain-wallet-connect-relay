require('dotenv').config();

const uuid = require('uuid');
const redis = require('redis');
const readlineSync = require('readline-sync');

const client = redis.createClient({ url: process.env.REDIS });

const SERVICE_PREFIX = process.env.SERVICE_PREFIX;

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
      const name = readlineSync.question('input your service name : ');
      const url = readlineSync.question('input your service site URL : ');
      const icon = readlineSync.question('input your service icon URL : ');

      const serviceId = uuid.v4();
      const serviceData = {
        name,
        url,
        icon,
      };

      await client.hSet(`${SERVICE_PREFIX}${projectId}`, serviceId, JSON.stringify(serviceData));

      const getServiceData = await client.hGet(`${SERVICE_PREFIX}${projectId}`, serviceId);
      const serviceDataJSON = JSON.parse(getServiceData);

      for (let key in serviceDataJSON) {
        if (serviceData[key] !== serviceDataJSON[key]) {
          throw new Error('FAILED NEW PROJECT');
        }
      }

      console.log(serviceData);
      console.log(
        '=========================================================================================================================='
      );
      console.log('SERVICE ID : ' + serviceId);
      console.log(
        '=========================================================================================================================='
      );
    } catch (e) {
      console.log(e);
    }

    process.exit();
  })
  .catch((e) => console.log(e));
