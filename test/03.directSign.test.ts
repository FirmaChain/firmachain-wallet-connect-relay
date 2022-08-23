import { expect } from 'chai';
import { axios, TEST_PROJECT_ID } from './axios';

import * as dotenv from 'dotenv';

dotenv.config();

import { SUCCESS } from '../src/constants/httpResult';
import { decryptData, encryptData } from '../src/utils/crypto';

describe('[03. Direct Sign Test]', () => {
  const projectId = TEST_PROJECT_ID;
  let projectSecretKey = '';
  let projectKey = '';

  let connect1 = {
    userkey: '',
    userAddress: 'firma1fywur8d0gd5342jw0mx29teudk5tgtyef57p3d',
    message: 'abcd-1234-efgh-5678',
    data: '',
    requestKey: '',
  };

  let connect2 = {
    userkey: '',
    userAddress: 'firma17uurdlmufwg0yluqsry9cr7fg7fslhqjpy8xnu',
    message: '1234-abcd-efgh-5678',
    data: '',
    requestKey: '',
  };

  it('[Dapp] Generate Dapp Secret Key', (done) => {
    try {
      projectSecretKey = encryptData(projectId);

      const decoded: string = decryptData(projectSecretKey);

      expect(decoded).to.not.be.undefined;
      expect(decoded).to.be.equal(projectId);

      done();
    } catch (error) {
      done(error);
    }
  });

  describe('[Wallet] Authorize', () => {
    it('[POST] /v1/wallets/auth (generate user1)', (done) => {
      axios
        .post(`/v1/wallets/auth`, {})
        .then((response) => {
          expect(response.status).to.be.equal(200);
          expect(response.data.code).to.be.equal(SUCCESS.code);
          expect(response.data.message).to.be.equal(SUCCESS.message);
          expect(response.data.result).to.not.be.undefined;
          expect(response.data.result.userkey).to.not.be.undefined;

          connect1.userkey = response.data.result.userkey;

          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('[POST] /v1/wallets/auth (generate user2)', (done) => {
      axios
        .post(`/v1/wallets/auth`, {})
        .then((response) => {
          expect(response.status).to.be.equal(200);
          expect(response.data.code).to.be.equal(SUCCESS.code);
          expect(response.data.message).to.be.equal(SUCCESS.message);
          expect(response.data.result).to.not.be.undefined;
          expect(response.data.result.userkey).to.not.be.undefined;

          connect2.userkey = response.data.result.userkey;

          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('[Dapp] Authorize', () => {
    it('[POST] /v1/projects/auth (generate projectKey)', (done) => {
      axios
        .post(`/v1/projects/auth`, { projectSecretKey })
        .then((response) => {
          expect(response.status).to.be.equal(200);
          expect(response.data.code).to.be.equal(SUCCESS.code);
          expect(response.data.message).to.be.equal(SUCCESS.message);
          expect(response.data.result).to.not.be.undefined;
          expect(response.data.result.projectKey).to.not.be.undefined;

          projectKey = response.data.result.projectKey;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('[Dapp] Generate direct sign QR', () => {
    it('[POST] /v1/projects/sign (success user1)', (done) => {
      axios
        .post(
          `/v1/projects/sign`,
          { type: 0, signer: connect1.userAddress, message: connect1.message, info: 'Test1', argument: { test: 1 } },
          { headers: { authorization: `Bearer ${projectKey}` } }
        )
        .then((response) => {
          expect(response.status).to.be.equal(200);
          expect(response.data.code).to.be.equal(SUCCESS.code);
          expect(response.data.message).to.be.equal(SUCCESS.message);
          expect(response.data.result).to.not.be.undefined;
          expect(response.data.result.data).to.not.be.undefined;

          connect1.data = response.data.result.data;

          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('[POST] /v1/projects/sign (success user2)', (done) => {
      axios
        .post(
          `/v1/projects/sign`,
          { type: 0, signer: connect2.userAddress, message: connect2.message, info: 'Test1', argument: { test: 2 } },
          { headers: { authorization: `Bearer ${projectKey}` } }
        )
        .then((response) => {
          expect(response.status).to.be.equal(200);
          expect(response.data.code).to.be.equal(SUCCESS.code);
          expect(response.data.message).to.be.equal(SUCCESS.message);
          expect(response.data.result).to.not.be.undefined;
          expect(response.data.result.data).to.not.be.undefined;

          connect2.data = response.data.result.data;

          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('[Wallet] Read QR', () => {
    it('Parse QR (user1)', () => {
      expect(connect1.data.split('://').length).to.be.equal(2);
      expect(connect1.data.split('://')[0]).to.be.equal('sign');

      connect1.requestKey = connect1.data.split('://')[1];
    });

    it('Parse QR (user2)', () => {
      expect(connect2.data.split('://').length).to.be.equal(2);
      expect(connect2.data.split('://')[0]).to.be.equal('sign');

      connect2.requestKey = connect2.data.split('://')[1];
    });
  });

  describe('[Wallet] Get sign information', () => {
    it('[GET] /v1/wallets/sign/:requestKey (success user1)', (done) => {
      axios
        .get(`/v1/wallets/sign/${connect1.requestKey}`, { headers: { userkey: connect1.userkey } })
        .then((response) => {
          expect(response.status).to.be.equal(200);
          expect(response.data.code).to.be.equal(SUCCESS.code);
          expect(response.data.message).to.be.equal(SUCCESS.message);
          expect(response.data.result).to.not.be.undefined;

          expect(response.data.result.signParams).to.not.be.undefined;
          expect(response.data.result.signParams.message).to.not.be.undefined;
          expect(response.data.result.signParams.signer).to.not.be.undefined;
          expect(response.data.result.signParams.type).to.not.be.undefined;
          expect(response.data.result.signParams.argument).to.not.be.undefined;
          expect(response.data.result.projectMetaData).to.not.be.undefined;
          expect(response.data.result.projectMetaData.projectId).to.not.be.undefined;
          expect(response.data.result.projectMetaData.name).to.not.be.undefined;
          expect(response.data.result.projectMetaData.description).to.not.be.undefined;
          expect(response.data.result.projectMetaData.icon).to.not.be.undefined;
          expect(response.data.result.projectMetaData.url).to.not.be.undefined;

          expect(response.data.result.signParams.message).to.be.equal(connect1.message);
          expect(response.data.result.signParams.signer).to.be.equal(connect1.userAddress);
          expect(response.data.result.signParams.type).to.be.equal(0);
          expect(response.data.result.projectMetaData.projectId).to.be.equal(projectId);
          expect(response.data.result.signParams.argument.test).to.be.equal(1);

          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('[GET] /v1/wallets/sign/:requestKey (success user2)', (done) => {
      axios
        .get(`/v1/wallets/sign/${connect2.requestKey}`, { headers: { userkey: connect2.userkey } })
        .then((response) => {
          expect(response.status).to.be.equal(200);
          expect(response.data.code).to.be.equal(SUCCESS.code);
          expect(response.data.message).to.be.equal(SUCCESS.message);
          expect(response.data.result).to.not.be.undefined;

          expect(response.data.result.signParams).to.not.be.undefined;
          expect(response.data.result.signParams.message).to.not.be.undefined;
          expect(response.data.result.signParams.signer).to.not.be.undefined;
          expect(response.data.result.signParams.type).to.not.be.undefined;
          expect(response.data.result.signParams.argument).to.not.be.undefined;
          expect(response.data.result.projectMetaData).to.not.be.undefined;
          expect(response.data.result.projectMetaData.projectId).to.not.be.undefined;
          expect(response.data.result.projectMetaData.name).to.not.be.undefined;
          expect(response.data.result.projectMetaData.description).to.not.be.undefined;
          expect(response.data.result.projectMetaData.icon).to.not.be.undefined;
          expect(response.data.result.projectMetaData.url).to.not.be.undefined;

          expect(response.data.result.signParams.message).to.be.equal(connect2.message);
          expect(response.data.result.signParams.signer).to.be.equal(connect2.userAddress);
          expect(response.data.result.signParams.type).to.be.equal(0);
          expect(response.data.result.projectMetaData.projectId).to.be.equal(projectId);
          expect(response.data.result.signParams.argument.test).to.be.equal(2);

          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('[Wallet] Sign approve', () => {
    it('[PUT] /v1/wallets/sign/:requestKey/approve (success user1)', (done) => {
      axios
        .put(
          `/v1/wallets/sign/${connect1.requestKey}/approve`,
          { rawData: connect1.message, address: connect1.userAddress, chainId: 'test-1' },
          { headers: { userkey: connect1.userkey } }
        )
        .then((response) => {
          expect(response.status).to.be.equal(200);
          expect(response.data.code).to.be.equal(SUCCESS.code);
          expect(response.data.message).to.be.equal(SUCCESS.message);
          expect(response.data.result).to.not.be.undefined;

          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('[Wallet] Sign reject', () => {
    it('[PUT] /v1/wallets/sign/:requestKey/reject (success)', (done) => {
      axios
        .put(`/v1/wallets/sign/${connect2.requestKey}/reject`, {}, { headers: { userkey: connect2.userkey } })
        .then((response) => {
          expect(response.status).to.be.equal(200);
          expect(response.data.code).to.be.equal(SUCCESS.code);
          expect(response.data.message).to.be.equal(SUCCESS.message);
          expect(response.data.result).to.not.be.undefined;

          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
