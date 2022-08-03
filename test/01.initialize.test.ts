import { expect } from 'chai';
import { axios, TEST_PROJECT_ID } from './axios';

import { encryptData, decryptData } from '../src/utils/crypto';
import { SUCCESS, UNDEFINED_KEY, INVALID_KEY } from '../src/constants/httpResult';

describe('[01. Initialize Auth Test]', () => {
  const projectId = TEST_PROJECT_ID;
  let projectSecretKey = '';
  let userkey = '';

  it('[Dapp] Generate Dapp Secret Key', (done) => {
    try {
      projectSecretKey = encryptData(projectId);

      const decoded: any = decryptData(projectSecretKey);

      expect(decoded).to.not.be.undefined;
      expect(decoded).to.be.equal(projectId);

      done();
    } catch (e) {
      done(e);
    }
  });

  describe('[Dapp] Authorize', () => {
    it('[POST] /v1/projects/auth (undefined projectSecretKey)', (done) => {
      axios
        .post(`/v1/projects/auth`, {})
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

    it('[POST] /v1/projects/auth (invalid projectSecretKey)', (done) => {
      axios
        .post(`/v1/projects/auth`, { projectSecretKey: '1234' })
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

    it('[POST] /v1/projects/auth (generate projectKey)', (done) => {
      axios
        .post(`/v1/projects/auth`, { projectSecretKey })
        .then((response) => {
          expect(response.status).to.be.equal(200);
          expect(response.data.code).to.be.equal(SUCCESS.code);
          expect(response.data.message).to.be.equal(SUCCESS.message);
          expect(response.data.result).to.not.be.undefined;
          expect(response.data.result.projectKey).to.not.be.undefined;

          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('[Wallet] Authorize', () => {
    it('[POST] /v1/wallets/auth (invalid userkey)', (done) => {
      axios
        .post(`/v1/wallets/auth`, { userkey: '1234' })
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

    it('[POST] /v1/wallets/auth (generate userkey)', (done) => {
      axios
        .post(`/v1/wallets/auth`, {})
        .then((response) => {
          expect(response.status).to.be.equal(200);
          expect(response.data.code).to.be.equal(SUCCESS.code);
          expect(response.data.message).to.be.equal(SUCCESS.message);
          expect(response.data.result).to.not.be.undefined;
          expect(response.data.result.userkey).to.not.be.undefined;

          userkey = response.data.result.userkey;

          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('[POST] /v1/wallets/auth (valid userkey)', (done) => {
      axios
        .post(`/v1/wallets/auth`, { userkey: userkey })
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
