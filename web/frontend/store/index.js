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
      modelName: 'pool',
      idField: 'id',
      instanceDefaults: {
        id: null,
        api: '',
        name: '',
        type: '',
        url: '',
      }
    }),
    service('pool-data', {
      debug: true,
      idField: 'time',
      instanceDefaults: {
        pool_id: null,
        time: null,
      }
    }),
    service('node', {
      idField: 'id',
      instanceDefaults: {
        id: null,
        name: '',
        port: '',
        url: '',
      }
    }),
    service('node-data', {
      idField: 'time',
      instanceDefaults: {
        data: '',
        node_id: null,
      }
    }),
  ],
  actions: {
    nuxtServerInit ({ commit, dispatch }, { req }) {
      return dispatch('pool/find').then(() => {
        return dispatch('node/find')
      })
    }
  }
})

export default store
