const assert = require('assert');
const app = require('../../src/app');

describe('\'pools\' service', () => {
  it('registered the service', () => {
    const service = app.service('pools');

    assert.ok(service, 'Registered the service');
  });
});
