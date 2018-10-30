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
        data: '',
        name: '',
        type: '',
        url: '',
        mining_address: '',
        trusted: ''
      }
    }),
    service('pool-data', {
      idField: 'time',
      instanceDefaults: {
        pool_id: null,
        time: '',
        data: ''
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
        port: '',
        url: '',
        ssl: ''
      }
    }),
    service('node-data', {
      idField: 'time',
      instanceDefaults: {
        time: '',
        node_id: null,
        alt_blocks_count: '',
        difficulty: '',
        gray_peerlist_size: '',
        hashrate: '',
        height: '',
        incoming_connections_count: '',
        last_known_block_index: '',
        major_version: '',
        minor_version: '',
        network_height: '',
        outgoing_connections_count: '',
        start_time: '',
        status: '',
        supported_height: '',
        synced: '',
        testnet: '',
        tx_count: '',
        tx_pool_size: '',
        version: '',
        white_peerlist_size: '',
        fee: ''
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
