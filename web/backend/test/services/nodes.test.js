const assert = require('assert');
const app = require('../../src/app');

describe('\'nodes\' service', () => {
  it('registered the service', () => {
    const service = app.service('nodes');

    assert.ok(service, 'Registered the service');
  });
});
