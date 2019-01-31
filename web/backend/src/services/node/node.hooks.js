const { fastJoin } = require('feathers-hooks-common');

const today = new Date()
const endDate = today.getTime()
const startDate = today.setMinutes(today.getMinutes() - 30)

const nodeResolver = {
  joins: {
    data: {
      resolver: () => async (node, context) => {
        let results = await context.app.service('node-data').find({
          query: {
            node_id: node.id,
            $limit: 1,
            $sort: { time: -1 },
            time: {
              $gte: startDate,
              $lte: endDate
            }
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
              if(context.result[a].hasOwnProperty('data') && context.result[a].data !== undefined) {
                return context.result[a].data.status.localeCompare(context.result[b].data.status); // Organize the category array
              }
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
