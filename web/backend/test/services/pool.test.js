const assert = require('assert');
const app = require('../../src/app');

describe('\'pool\' service', () => {
  it('registered the service', () => {
    const service = app.service('pool');

    assert.ok(service, 'Registered the service');
  });
});
