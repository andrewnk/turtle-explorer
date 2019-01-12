const { fastJoin } = require('feathers-hooks-common');

const nodeResolver = {
  joins: {
    data: {
      resolver: () => async (node, context) => {
        let results = await context.app.service('node-data').find({
          query: {
            node_id: node.id,
            $limit: 1,
            $sort: { time: -1, status: 1 }
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
      fastJoin(nodeResolver),
      context => {
        if(context.result) {
            const sorted = Object.keys(context.result)
            .sort(function(a, b) {
              return context.result[a].data.status.localeCompare(context.result[b].data.status); // Organize the category array
            })
            .map(function(index) {
              return context.result[index]
            });
            context.result = sorted
        }
        return context
      }
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
