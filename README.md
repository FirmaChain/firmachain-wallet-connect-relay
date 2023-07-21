# **firmachain-wallet-connect-relay**

## **Overview**
The FirmaChain Wallet Connect Relay is a service that securely connects DApps supporting the FirmaChain network with the FirmaStation mobile wallet.

<br/>

## **Features**
FirmaChain Wallet Connect Relay allows users of the FirmaStation mobile wallet to connect to DApps that support the FirmaChain network. Users can establish a connection by scanning a QR code generated in the DApp with FirmaStation. Users can then approve or reject transactions on FirmaStation.

<br/>

## **Build Instructions**
```bash
# Clone the repository
$ git clone https://github.com/FirmaChain/walletconnect-relay.git

# Move to project directory
$ cd walletconnect-relay

# Install required packages
$ npm install

# Copy .env file
cp .env.sample .env
```

<br/>

## **Secret Key Generation**
To generate a secret key, run the following command. This command generates salt and iv values.

```bash
# Secret Key generation
$ npm run new-word

# The expected result of the command execution is as follows:
{
  salt: '905df7b2c4c78aea018e4fb1317c0d0c',
  iv: 'd3f0fc49370716802768954840f14501'
}
```

<br/>

## **Copy .env sample**
After copying env.sample to .env, assign appropriate values to the following variables.

- `NODE_ENV`: Specifies development or production mode (e.g., <U>**development** | **production**</U>).

- `PORT`: Specifies the port on which the server will run (eg., <U>**3000**</U>).

- `ORIGIN`: Decides whether to perform a check on the CORS policy. If ORIGIN is set to 'true', only requests coming from origins registered on the whitelist are allowed (e.g., <U>**true** | **false**</U>).

- `CREDENTIALS`: Decides whether to allow credentials in CORS settings. If set to 'true', the Access-Control-Allow-Credentials header is set to 'true', allowing cookies and other credentials for requests (e.g., <U>**true** | **false**</U>).

- `SECRET_KEY`: A random string that plays an important role in encryption and decryption. This key is used to encrypt plaintext data or to convert cipher text back to its original plaintext data (e.g., <U>**examplesecretkey**</U>).

- `SALT`: Use the result value that came out after executing the npm run new-word command (e.g., <U>**'905df7b2c4c78aea018e4fb1317c0d0c'**</U>).

- `IV`: Use the result value that came out after executing the npm run new-word command (e.g., <U>**'d3f0fc49370716802768954840f14501'**</U>).

- `REDIS`: Specifies the connection information necessary to connect to the Redis database (e.g., <U>**redis://127.0.0.1:6379**</U>).

- `REQUEST_EXPIRE_SECOND`: Specifies the time until a request expires, in seconds (e.g., <U>**120**</U>).

<br/>

## **New test project**
Run the npm run new-project command to create a new project and register the new project to communicate with Wallet Connect Relay.

```bash
npm run new-project

input your project name : test-project
input your project description : firmachain-wallet-connect-relay project
input your project site URL : https://domain.org
input your project icon URL : https://domain.org/white_logo.png
input your project sign callback URL : https://domain.org/callback
input your project verify request URL : https://domain.org/verify
{
  name: 'test-project',
  description: 'firmachain-wallet-connect-relay project',
  url: 'https://domain.org',
  icon: 'https://domain.org/white_logo.png',
  callback: 'https://domain.org/callback',
  verifyRequest: 'https://domain.org/verify'
}
==========================================================================================================================
PROJECT ID : 87f6def8-4a0a-4112-b02f-a12987b052ab
PROJECT SECRET KEY : MjdwTWxRWnk4VW9XSzBOdUE5QlRxVDFkVDlleWtLcFZ6WGJZUENNYktlU1lFMlhXS0VPMjNMWjlNLzRZcTh3Lw==
==========================================================================================================================
```

<br/>

## **Testing**
Here's how to check the connection with Wallet Connect Relay after creating a new project.

### Config for test (/test/axios.ts)
```bash
cp ./test/axios.sample.ts ./test/axios.ts
vim ./test/axios.ts
```

### Edit test project ID
```bash
import axios from 'axios';

// your axios config
axios.defaults.baseURL = 'http://localhost:5050';

// input your test project id
const TEST_PROJECT_ID = '87f6def8-4a0a-4112-b02f-a12987b052ab';

export { axios, TEST_PROJECT_ID };
```

### Run & test

```bash
npm run dev

npm run test
```
