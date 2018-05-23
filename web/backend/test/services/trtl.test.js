const assert = require('assert');
const app = require('../../src/app');

describe('\'trtl\' service', () => {
  it('registered the service', () => {
    const service = app.service('trtl');

    assert.ok(service, 'Registered the service');
  });
});
