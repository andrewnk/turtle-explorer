const assert = require('assert');
const app = require('../../src/app');

describe('\'poolData\' service', () => {
  it('registered the service', () => {
    const service = app.service('pool-data');

    assert.ok(service, 'Registered the service');
  });
});
