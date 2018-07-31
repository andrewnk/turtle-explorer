const sequelize = require('sequelize');

module.exports = {
  before: {
    all: [],
    find: [
      // context => {
      //   const nodeDataModel = context.app.services['node-data'].Model
      //   context.params.sequelize = {
      //     include: [{ model: nodeDataModel }],
      //     attributes: [
      //       sequelize.literal('DISTINCT ON("node_data"."node_id") "node_data"."node_id", "id", "url", "name", "port"')
      //     ]
      //   }
  
      //   return Promise.resolve(context)
      // }
    ],
    get: []
  },

  after: {
    all: [],
    find: [
      context => {
        if(context.result) {
          context.result.forEach(node => {
            node['data'] = node['node_data.data']
            node['timestamp'] = node['node_data.time']
            delete node['node_data.data']
            delete node['node_data.node_id']
            delete node['node_data.time']
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
