const assert = require('assert');
const app = require('../../src/app');

describe('\'pool-history\' service', () => {
  it('registered the service', () => {
    const service = app.service('pool-history');

    assert.ok(service, 'Registered the service');
  });
});
