const assert = require('assert');
const app = require('../../src/app');

describe('\'notify-pool\' service', () => {
  it('registered the service', () => {
    const service = app.service('notify-pool');

    assert.ok(service, 'Registered the service');
  });
});
