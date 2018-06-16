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
      modelName: 'pool',
      debug: true,
      idField: 'id',
      instanceDefaults: {
        id: null,
        api: '',
        name: '',
        type: '',
        url: '',
        PoolData: 'PoolDatum'
      },
      actions: {}
    }),
    service('pool-data', {
      debug: true,
      idField: 'time',
      instanceDefaults: {
        data: '',
        pool_id: null,
        time: null,
        pool: 'pool',
      }
    }),
    service('node', {
      debug: true,
      idField: 'id',
      instanceDefaults: {
        id: null,
        name: '',
        port: '',
        url: '',
        NodeData: 'NodeData'
      }
    }),
    service('node-data', {
      debug: true,
      modelName: 'NodeData',
      idField: 'time',
      instanceDefaults: {
        data: '',
        node_id: null,
      }
    }),
  ]
})

export default store
