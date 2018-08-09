const assert = require('assert');
const app = require('../../src/app');

describe('\'node-history\' service', () => {
  it('registered the service', () => {
    const service = app.service('node-history');

    assert.ok(service, 'Registered the service');
  });
});
