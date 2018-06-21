const sequelize = require('sequelize');

module.exports = {
  before: {
    all: [],
    find: [
      context => {
        context.params.sequelize = {
          logging: console.log,
          attributes: [sequelize.literal('DISTINCT ON("node_id") "node_id", "data", "time"')],
        }
  
        return Promise.resolve(context);
      }
    ],
    get: []
  },

  after: {
    all: [],
    find: [],
    get: []
  },

  error: {
    all: [],
    find: [],
    get: []
  }
};
