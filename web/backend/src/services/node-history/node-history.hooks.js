const { iff } = require('feathers-hooks-common')
const redisBefore = require('feathers-hooks-rediscache').redisBeforeHook
const redisAfter = require('feathers-hooks-rediscache').redisAfterHook
const cache = require('feathers-hooks-rediscache').hookCache
const sequelize = require('sequelize')
const toCache = context => {
  let start = new Date().setHours(0,0,0,0)
  let end = new Date().setHours(23,59,59,999)
  return (context.params.query.time.$gte !== start && context.params.query.time.$lte !== end) || context.params.query.time.$lte !== end  || context.params.query.time.$lte > end
}

module.exports = {
  before: {
    all: [],
    find: [
      redisBefore(),
      context => {
        let acceptableAttributes = [
          'difficulty',
          'hashrate',
          'height',
          'incoming_connections_count',
          'outgoing_connections_count',
          'last_known_block_index',
          'tx_pool_size',
          'start_time'
        ]

        let attribute = ''
        if(acceptableAttributes.includes(context.params.query.attribute)) {
          attribute = context.params.query.attribute
        } else {
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
            sequelize.literal('"' + attribute + '"' + ' as "data"'),
            'node_id'
          ],
          group: [
            [sequelize.literal('"timebucket"')],
            [attribute],
            ['node_id']
          ],
          order: [
            [sequelize.literal('"timebucket" ASC')]
          ]
        }

        return Promise.resolve(context)
      }
    ],
    get: [redisBefore()],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [
      iff(toCache,
        cache({duration: 3600 * 24 * 7}),
        redisAfter()
      ),
      context => {
        if(context.result) {
          const results = context.result
          const ids = [...new Set(results.map(value => value.node_id))]
          let sortedResults = []

          ids.forEach(id => {
            sortedResults.push({
              node_id: id,
              data: results.filter(val => val.node_id === id).map(val => {
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
    get: [cache({duration: 3600 * 24 * 7}), redisAfter()],
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
