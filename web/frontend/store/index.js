import Vue from 'vue'
import Vuex from 'vuex'
import feathersVuex from 'feathers-vuex'
import feathersClient from '../config/feathers'
import socket from '../config/socket'

const { service, FeathersVuex } = feathersVuex(feathersClient, { idField: 'id' })

Vue.use(Vuex)
Vue.use(FeathersVuex)

const store = () => new Vuex.Store({
  plugins: [
    service('pool', {
      debug: true,
      idField: 'id',
      instanceDefaults: {
        id: null,
        api: '',
        name: '',
        type: '',
        url: '',
        mining_address: '',
        trusted: ''
      }
    }),
    service('pool-data', {
      debug: true,
      idField: 'time',
      instanceDefaults: {
        pool_id: null,
        time: '',
        data: ''
      }
    }),
    service('pool-history', {
      debug: true,
      idField: 'pool_id',
      instanceDefaults: {
        pool_id: null,
        data: ''
      }
    }),
    service('node', {
      idField: 'id',
      instanceDefaults: {
        id: null,
        name: '',
        port: '',
        url: '',
        ssl: ''
      }
    }),
    service('node-data', {
      idField: 'time',
      instanceDefaults: {
        data: '',
        time: '',
        node_id: null
      }
    }),
    service('node-history', {
      debug: true,
      idField: 'node_id',
      instanceDefaults: {
        node_id: null,
        data: ''
      }
    }),
  ],
  actions: {
    async nuxtServerInit({ commit, dispatch }) {
      const pools = await dispatch('pool/find')
      const poolsData = await Promise.all(pools.map(async (pool) => {
        const poolData = await dispatch('pool-data/find', {
            query: {
              pool_id: {
                $eq: pool.id
              },
              $sort: {
                time: -1
              },
              $limit: 1
            }
          })

        if(typeof poolData[0] !== 'undefined') {
          this.state.pool.keyedById[pool.id].data = poolData[0].data
        }
      }))

      const nodes = await dispatch('node/find')
      const nodesData = await Promise.all(nodes.map(async (node) => {
        const nodeData = await dispatch('node-data/find', {
            query: {
              node_id: {
                $eq: node.id
              },
              $sort: {
                time: -1
              },
              $limit: 1
            }
          })

        if(typeof nodeData[0] !== 'undefined') {
          this.state.node.keyedById[node.id].data = nodeData[0].data
        }
      }))

      return [
        pools,
        poolsData,
        nodes,
        nodesData
      ]
    }
  }
})

export default store
