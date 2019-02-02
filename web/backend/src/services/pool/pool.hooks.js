const { fastJoin } = require('feathers-hooks-common');

const today = new Date()
const endDate = today.getTime()
const startDate = today.setMinutes(today.getMinutes() - 10)

const poolResolver = {
  joins: {
    ports: {
      resolver: () => async (pool, context) => {
        pool.ports = await context.app.service('pool-config').find({ 
          query: {
            pool_id: pool.id,
            $sort: { difficulty: 1 }
          },
          paginate: false
        })
      }
    },
    data: {
      resolver: () => async (pool, context) => {
        let results = await context.app.service('pool-data').find({
          query: {
            pool_id: pool.id,
            status: 'OK',
            $limit: 1,
            $sort: { time: -1 },
            time: {
              $gte: startDate,
              $lte: endDate
            }
          },
          paginate: false
        })

        pool.data = results[0]
      }
    },
    fees: {
      resolver: () => async (pool, context) => {
        pool.fees = await context.app.service('pool-fee').find({ 
          query: {
            pool_id: pool.id
          },
          paginate: false
        })
      }
    },
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
      fastJoin(poolResolver),
      context => {
        //filter out where data doesn't exist
        if(context.result) {
          const cleanedResults = context.result.filter(pool => pool.data !== undefined)
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
