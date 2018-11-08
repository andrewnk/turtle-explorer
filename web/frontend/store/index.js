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
    }),
  ]
})

export default store
