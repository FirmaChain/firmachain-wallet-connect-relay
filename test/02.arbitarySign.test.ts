import { expect } from 'chai';
import { axios, TEST_PROJECT_ID } from './axios';

import * as dotenv from 'dotenv';

dotenv.config();

import { encryptData, decryptData } from '../src/utils/crypto';
import { SUCCESS, UNAUTHORIZATION, UNDEFINED_KEY, INVALID_KEY } from '../src/constants/httpResult';

describe('[02. Arbitary Sign Test]', () => {
  const projectId = TEST_PROJECT_ID;
  let projectSecretKey = '';
  let projectKey = '';

  let connect1 = {
    address: 'firma1',
    userkey: '',
    data: '',
    requestKey: '',
    message: 'abcd-1234-efgh-5678',
    api: '',
  };

  let connect2 = {
    address: 'firma2',
    userkey: '',
    data: '',
    requestKey: '',
    message: '1234-abcd-efgh-5678',
    api: '',
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

  describe('[Dapp] Generate connect arbitary QR', () => {
    it('[POST] /v1/projects/sign (unauthorize - undefined)', (done) => {
      axios
        .post(`/v1/projects/sign`, {}, { headers: {} })
        .then((response) => {
          expect(response.status).to.be.equal(200);
          expect(response.data.code).to.be.equal(UNAUTHORIZATION.code);
          expect(response.data.message).to.be.equal(UNAUTHORIZATION.message);
          expect(response.data.result).to.not.be.undefined;

          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('[POST] /v1/projects/sign (unauthorize - invalid)', (done) => {
      axios
        .post(`/v1/projects/sign`, {}, { headers: { authorization: `Bearer 1234` } })
        .then((response) => {
          expect(response.status).to.be.equal(200);
          expect(response.data.code).to.be.equal(UNAUTHORIZATION.code);
          expect(response.data.message).to.be.equal(UNAUTHORIZATION.message);
          expect(response.data.result).to.not.be.undefined;

          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('[POST] /v1/projects/sign (undefined message)', (done) => {
      axios
        .post(`/v1/projects/sign`, {}, { headers: { authorization: `Bearer ${projectKey}` } })
        .then((response) => {
          expect(response.status).to.be.equal(200);
          expect(response.data.code).to.be.equal(UNDEFINED_KEY.code);
          expect(response.data.message).to.be.equal(UNDEFINED_KEY.message);
          expect(response.data.result).to.not.be.undefined;

          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('[POST] /v1/projects/sign (invalid message)', (done) => {
      axios
        .post(`/v1/projects/sign`, { message: 1234 }, { headers: { authorization: `Bearer ${projectKey}` } })
        .then((response) => {
          expect(response.status).to.be.equal(200);
          expect(response.data.code).to.be.equal(UNDEFINED_KEY.code);
          expect(response.data.message).to.be.equal(UNDEFINED_KEY.message);
          expect(response.data.result).to.not.be.undefined;

          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('[POST] /v1/projects/sign (undefined info)', (done) => {
      axios
        .post(`/v1/projects/sign`, { message: '' }, { headers: { authorization: `Bearer ${projectKey}` } })
        .then((response) => {
          expect(response.status).to.be.equal(200);
          expect(response.data.code).to.be.equal(UNDEFINED_KEY.code);
          expect(response.data.message).to.be.equal(UNDEFINED_KEY.message);
          expect(response.data.result).to.not.be.undefined;

          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('[POST] /v1/projects/sign (invalid info)', (done) => {
      axios
        .post(`/v1/projects/sign`, { message: '', info: 1234 }, { headers: { authorization: `Bearer ${projectKey}` } })
        .then((response) => {
          expect(response.status).to.be.equal(200);
          expect(response.data.code).to.be.equal(UNDEFINED_KEY.code);
          expect(response.data.message).to.be.equal(UNDEFINED_KEY.message);
          expect(response.data.result).to.not.be.undefined;

          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('[POST] /v1/projects/sign (success user1)', (done) => {
      axios
        .post(
          `/v1/projects/sign`,
          { message: connect1.message, info: 'Test1', qrType: 0, type: 0, signer: '' },
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
          { message: connect2.message, info: 'Test2', qrType: 0, type: 0, signer: '' },
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

      connect1.api = connect1.data.split('://')[0];
      connect1.requestKey = connect1.data.split('://')[1];
    });

    it('Parse QR (user2)', () => {
      expect(connect2.data.split('://').length).to.be.equal(2);
      expect(connect2.data.split('://')[0]).to.be.equal('sign');

      connect2.api = connect2.data.split('://')[0];
      connect2.requestKey = connect2.data.split('://')[1];
    });
  });

  describe('[Wallet] Get connect arbitary information', () => {
    it('[GET] /v1/wallets/sign/:requestKey (unauthorize - undefined)', (done) => {
      axios
        .get(`/v1/wallets/sign/1`, { headers: {} })
        .then((response) => {
          expect(response.status).to.be.equal(200);
          expect(response.data.code).to.be.equal(UNAUTHORIZATION.code);
          expect(response.data.message).to.be.equal(UNAUTHORIZATION.message);
          expect(response.data.result).to.not.be.undefined;

          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('[GET] /v1/wallets/sign/:requestKey (unauthorize - invalid)', (done) => {
      axios
        .get(`/v1/wallets/sign/1`, { headers: { userkey: '1234' } })
        .then((response) => {
          expect(response.status).to.be.equal(200);
          expect(response.data.code).to.be.equal(UNAUTHORIZATION.code);
          expect(response.data.message).to.be.equal(UNAUTHORIZATION.message);
          expect(response.data.result).to.not.be.undefined;

          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('[GET] /v1/wallets/sign/:requestKey (invalid requestKey)', (done) => {
      axios
        .get(`/v1/wallets/sign/1234`, { headers: { userkey: connect1.userkey } })
        .then((response) => {
          expect(response.status).to.be.equal(200);
          expect(response.data.code).to.be.equal(INVALID_KEY.code);
          expect(response.data.message).to.be.equal(INVALID_KEY.message);
          expect(response.data.result).to.not.be.undefined;

          done();
        })
        .catch((err) => {
          done(err);
        });
    });

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
          expect(response.data.result.signParams.signer).to.be.equal('');
          expect(response.data.result.signParams.type).to.be.equal(0);
          expect(response.data.result.projectMetaData.projectId).to.be.equal(projectId);

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
          expect(response.data.result.signParams.signer).to.be.equal('');
          expect(response.data.result.signParams.type).to.be.equal(0);
          expect(response.data.result.projectMetaData.projectId).to.be.equal(projectId);

          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('[Wallet] Connection approve', () => {
    it('[PUT] /v1/wallets/sign/:requestKey/approve (undefined rawData)', (done) => {
      axios
        .put(`/v1/wallets/sign/${connect1.requestKey}/approve`, {}, { headers: { userkey: connect1.userkey } })
        .then((response) => {
          expect(response.status).to.be.equal(200);
          expect(response.data.code).to.be.equal(UNDEFINED_KEY.code);
          expect(response.data.message).to.be.equal(UNDEFINED_KEY.message);
          expect(response.data.result).to.not.be.undefined;

          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('[PUT] /v1/wallets/sign/:requestKey/approve (undefined address)', (done) => {
      axios
        .put(
          `/v1/wallets/sign/${connect1.requestKey}/approve`,
          { rawData: '{}' },
          { headers: { userkey: connect1.userkey } }
        )
        .then((response) => {
          expect(response.status).to.be.equal(200);
          expect(response.data.code).to.be.equal(UNDEFINED_KEY.code);
          expect(response.data.message).to.be.equal(UNDEFINED_KEY.message);
          expect(response.data.result).to.not.be.undefined;

          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('[PUT] /v1/wallets/sign/:requestKey/approve (undefined chainId)', (done) => {
      axios
        .put(
          `/v1/wallets/sign/${connect1.requestKey}/approve`,
          { rawData: '{}', address: connect1.address },
          { headers: { userkey: connect1.userkey } }
        )
        .then((response) => {
          expect(response.status).to.be.equal(200);
          expect(response.data.code).to.be.equal(UNDEFINED_KEY.code);
          expect(response.data.message).to.be.equal(UNDEFINED_KEY.message);
          expect(response.data.result).to.not.be.undefined;

          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('[PUT] /v1/wallets/sign/:requestKey/approve (success apporve user1)', (done) => {
      axios
        .put(
          `/v1/wallets/sign/${connect1.requestKey}/approve`,
          { rawData: connect1.message, address: connect1.address, chainId: 'test-1' },
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

    it('[PUT] /v1/wallets/sign/:requestKey/approve (invalid - expire request user1)', (done) => {
      axios
        .put(
          `/v1/wallets/sign/${connect1.requestKey}/approve`,
          { rawData: connect1.message, address: connect1.address, chainId: 'test-1' },
          { headers: { userkey: connect1.userkey } }
        )
        .then((response) => {
          expect(response.status).to.be.equal(200);
          expect(response.data.code).to.be.equal(INVALID_KEY.code);
          expect(response.data.message).to.be.equal(INVALID_KEY.message);
          expect(response.data.result).to.not.be.undefined;

          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('[Wallet] Connect arbitary reject', () => {
    it('[PUT] /v1/wallets/sign/:requestKey/reject (success reject user2)', (done) => {
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

    it('[PUT] /v1/wallets/sign/:requestKey/reject (invalid - expire request user2)', (done) => {
      axios
        .put(`/v1/wallets/sign/${connect2.requestKey}/reject`, {}, { headers: { userkey: connect2.userkey } })
        .then((response) => {
          expect(response.status).to.be.equal(200);
          expect(response.data.code).to.be.equal(INVALID_KEY.code);
          expect(response.data.message).to.be.equal(INVALID_KEY.message);
          expect(response.data.result).to.not.be.undefined;

          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
