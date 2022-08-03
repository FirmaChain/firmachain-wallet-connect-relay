# firmachain-wallet-connect-relay

## 1. Install

```javascript
npm install
```

## 2. Set up environment variables

### Generate salt & iv

```bash
npm run new-word
{
  salt: '905df7b2c4c78aea018e4fb1317c0d0c',
  iv: 'd3f0fc49370716802768954840f14501'
}
```

### Copy .env sample

```bash
cp .env.sample .env
vim .env
```

### Edit .env

```javascript
NODE_ENV=development
PORT=5050
ORIGIN=false
CREDENTIALS=false
SECRET_KEY=secretkeystring
SALT=905df7b2c4c78aea018e4fb1317c0d0c
IV=d3f0fc49370716802768954840f14501
REDIS=redis://127.0.0.1:6379
```

## 3. New test project

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

## 4. Config for test (/test/axios.ts)

### Copy .env sample

```bash
cp ./test/axios.sample.ts ./test/axios.ts
vim ./test/axios.ts
```

### Edit test project ID

```javascript
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
