const assert = require('assert');
const app = require('../../src/app');

describe('\'node\' service', () => {
  it('registered the service', () => {
    const service = app.service('node');

    assert.ok(service, 'Registered the service');
  });
});
