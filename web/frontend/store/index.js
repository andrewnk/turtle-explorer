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
  ]
})

export default store
