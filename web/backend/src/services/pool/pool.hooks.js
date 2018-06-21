const sequelize = require('sequelize');

module.exports = {
  before: {
    all: [],
    find: [
      context => {
        const poolDataModel = context.app.services['pool-data'].Model
        context.params.sequelize = {
          include: [{ model: poolDataModel }],
          attributes: [
            sequelize.literal('DISTINCT ON("pool_data"."pool_id") "pool_data"."pool_id", "id", "url", "name", "type", "api"')
          ]
        }
  
        return Promise.resolve(context)
      }
    ],
    get: []
  },

  after: {
    all: [],
    find: [ 
      context => {
        if(context.result) {
          context.result.forEach(pool => {
            pool['data'] = pool['pool_data.data']
            pool['timestamp'] = pool['pool_data.time']
            delete pool['pool_data.data']
            delete pool['pool_data.pool_id']
            delete pool['pool_data.time']
          })
        }

        return Promise.resolve(context)
      }
    ],
    get: []
  },

  error: {
    all: [],
    find: [],
    get: []
  }
};
