const redisBefore = require('feathers-hooks-rediscache').redisBeforeHook
const redisAfter = require('feathers-hooks-rediscache').redisAfterHook
const cache = require('feathers-hooks-rediscache').hookCache

module.exports = {
  before: {
    all: [],
    find: [redisBefore()],
    get: [redisBefore()]
  },

  after: {
    all: [],
    find: [cache({duration: 3600 * 24 * 7}), redisAfter()],
    get: [cache({duration: 3600 * 24 * 7}), redisAfter()]
  },

  error: {
    all: [],
    find: [],
    get: []
  }
};
