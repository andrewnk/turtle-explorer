const assert = require('assert');
const app = require('../../src/app');

describe('\'miners\' service', () => {
  it('registered the service', () => {
    const service = app.service('miners');

    assert.ok(service, 'Registered the service');
  });
});
