import { expect } from 'chai';
import { axios } from './axios';

describe('[00. Initialize Test]', () => {
  it('[GET] /health', (done) => {
    axios
      .get('/health')
      .then((response) => {
        expect(response.status).to.be.equal(200);
        expect(response.data.code).to.be.equal(0);
        expect(response.data.message).to.be.equal('success');
        expect(response.data.result).not.undefined;
        done();
      })
      .catch((error) => {
        done(error);
      });
  });
});
