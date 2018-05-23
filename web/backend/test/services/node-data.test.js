const assert = require('assert');
const app = require('../../src/app');

describe('\'nodeData\' service', () => {
  it('registered the service', () => {
    const service = app.service('node-data');

    assert.ok(service, 'Registered the service');
  });
});
