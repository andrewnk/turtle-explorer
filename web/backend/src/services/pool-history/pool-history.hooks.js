const sequelize = require('sequelize');

module.exports = {
  before: {
    all: [],
    find: [
      context => {
        let attribute = ''
        switch (context.params.query.attribute) {
          case 'difficulty':
            attribute = "(data->'network'->>'difficulty')::float"
            break;
          case 'hashrate':
            attribute = "(data->'pool'->>'hashrate')::float"
            break;
          case 'height':
            attribute = "(data->'network'->>'height')::float"
            break;
          case 'miners':
            attribute = "(data->'pool'->>'miners')::float"
            break;
          case 'totalBlocks':
            attribute = "(data->'pool'->>'totalBlocks')::float"
            break;
          case 'totalMinersPaid':
            attribute = "(data->'pool'->>'totalMinersPaid')::float"
            break;
          case 'totalPayments':
            attribute = "(data->'pool'->>'totalPayments')::float"
            break;
          case 'timestamp':
            attribute = "(data->'network'->>'timestamp')::float"
            break;
          default:
            return Promise.resolve(context)
        }

        let timeBucket = "1 hour"
        const timeDiff = context.params.query.time.$lte - context.params.query.time.$gte
        if(new Date(timeDiff).getHours() <= 24) {
          timeBucket = "1 minute"
        }

        context.params.sequelize = {
          attributes: [
            sequelize.literal("time_bucket('"+ timeBucket +"', time)::timestamp without time zone as \"timebucket\""),
            sequelize.literal(attribute + " as \"data\""),
            'pool_id'
          ],
          group: [
            [sequelize.literal('"timebucket"')],
            ['pool_id'],
            ['data']
          ],
          order: [
            [sequelize.literal('"timebucket" ASC')]
          ]
        }

        return Promise.resolve(context)
      }
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [
      context => {
        if(context.result) {
          const results = context.result
          const ids = [...new Set(results.map(value => value.pool_id))]
          let sortedResults = []

          ids.forEach(id => {
            sortedResults.push({
              pool_id: id,
              data: results.filter(val => val.pool_id === id).map(val => {
                return [
                  val.timebucket,
                  val.data
                ]
              })
            })
          })
          context.result = sortedResults
        }

        return context
      }
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
