import Vue from 'vue'
import Vuex from 'vuex'
import feathersVuex from 'feathers-vuex'
import feathersClient from '../feathers-client'
import socket from '../socket'

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
        mining_address: ''
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
        url: ''
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
          this.state.pool.keyedById[pool.id].data= poolData[0].data
        }
      }))

      const nodes = await dispatch('node/find')

      return [
        pools,
        poolsData,
        nodes
      ]
    }
  }
})

export default store
