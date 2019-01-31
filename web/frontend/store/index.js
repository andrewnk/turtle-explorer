import Vue from 'vue'
import Vuex from 'vuex'
import feathersVuex from 'feathers-vuex'
import feathersClient from '../config/feathers'

const { service, FeathersVuex } = feathersVuex(feathersClient, { idField: 'id' })

Vue.use(Vuex)
Vue.use(FeathersVuex)

const store = () => new Vuex.Store({
  plugins: [
    service('pool', {
      idField: 'id',
      instanceDefaults: {
        id: null,
        api: '',
        data: {},
        ports: [],
        name: '',
        software: '',
        url: '',
        mining_address: '',
        trusted: ''
      }
    }),
    service('pool-history', {
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
        data: {},
        port: '',
        url: '',
        ssl: ''
      }
    }),
    service('node-history', {
      idField: 'node_id',
      instanceDefaults: {
        node_id: null,
        data: ''
      }
    })
  ],
  actions: {
    async nuxtServerInit({ commit, dispatch }) {
      const pools = await dispatch('pool/find', { query: { $sort: { name: 1 }}})
      const nodes = await dispatch('node/find', { query: { $sort: { name: 1 }}})

      return [
        pools,
        nodes
      ]
    }
  }
})

export default store
