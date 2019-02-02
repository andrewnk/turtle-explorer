const { fastJoin } = require('feathers-hooks-common');

const nodeResolver = {
  joins: {
    data: {
      resolver: () => async (node, context) => {
        let results = await context.app.service('node-data').find({
          query: {
            node_id: node.id,
            status: 'OK'
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
        //filter out where data doesn't exist
        if(context.result) {
          const cleanedResults = context.result.filter(node => node.data !== undefined)
          context.result = cleanedResults
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
