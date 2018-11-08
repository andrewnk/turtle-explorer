const { fastJoin } = require('feathers-hooks-common');

const nodeResolver = {
  joins: {
    data: {
      resolver: () => async (node, context) => {
        let results = await context.app.service('node-data').find({
          query: {
            node_id: node.id,
            $limit: 1,
            $sort: { time: -1 }
          },
          paginate: false
        })

        node.data = results[0]
      }
    }
  }
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: []
  },

  after: {
    all: [
      fastJoin(nodeResolver)
    ],
    find: [],
    get: []
  },

  error: {
    all: [],
    find: [],
    get: []
  }
};
