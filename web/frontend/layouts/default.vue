<template>
    <div id="app">
        <navigation/>
        <b-notification :closable="false">
            <b-loading :is-full-page="true" :active="!isLoaded" :can-cancel="false"/>
        </b-notification>
        <stats-bar v-if="isLoaded"/>
        <nuxt class="main" v-if="isLoaded"/>
        <footer-section/>
    </div>
</template>

<script>
import FooterSection from '~/layouts/sections/Footer'
import Navigation from '~/layouts/sections/Navigation'
import StatsBar from '~/layouts/sections/StatsBar'
import socket from '../config/socket'
import { mapActions } from 'vuex'

export default {
    components: {
        Navigation,
        FooterSection,
        StatsBar
    },
    data () {
        return {
            isLoaded: false
        }
    },
    created () {
        let promises = []
        promises.push(this.$store.dispatch('pool/find').then(pools => {
            let poolPromise = []
            poolPromise = pools.map(pool => {
                return this.$store.dispatch('pool-data/find', {
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
            })

            return Promise.all(poolPromise).then(results => {
                results.forEach(result => {
                    if(result.length > 0 && result[0].data) {
                        this.$store.state.pool.keyedById[result[0].pool_id].data = result[0].data
                    }
                })
            })
        }))

        promises.push(this.$store.dispatch('node/find').then(nodes => {
            let nodePromise = []
            nodePromise = nodes.map(node => {
                return this.$store.dispatch('node-data/find', {
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
            })

            return Promise.all(nodePromise).then(results => {
                results.forEach(result => {
                    if(result.length > 0 && result[0].data) {
                        this.$store.state.node.keyedById[result[0].node_id].data = result[0].data
                    }
                })
            })
        }))

        Promise.all(promises).then(() => this.isLoaded = true)

        socket.on('notifyNode', data => {
            if(this.$store.state.node.keyedById[data.node_id]) {
                this.$store.state.node.keyedById[data.node_id] = data
            } else {
                this.$store.commit('node/addItem', data)
            }
        })
        socket.on('notifyNodeData', data => {
            if(this.$store.state.node.keyedById[data.node_id].hasOwnProperty('data')) {
                this.$store.state.node.keyedById[data.node_id].data = data.data
            }
        })
        socket.on('notifyPool', data => {
            if(this.$store.state.pool.keyedById[data.pool_id]) {
                this.$store.state.pool.keyedById[data.pool_id] = data
            } else {
                this.$store.commit('pool/addItem', data)
            }
        })
        socket.on('notifyPoolNetwork', data => {
            if(this.$store.state.pool.keyedById[data.pool_id].hasOwnProperty('data')) {
                this.$store.state.pool.keyedById[data.pool_id].data.network = data.poolNetwork
            }
        })
        socket.on('notifyPoolConfig', data => {
            if(this.$store.state.pool.keyedById[data.pool_id].hasOwnProperty('data')) {
                this.$store.state.pool.keyedById[data.pool_id].data.config = data.poolConfig
            }
        })
        socket.on('notifyPoolPool', data => {
            if(this.$store.state.pool.keyedById[data.pool_id].hasOwnProperty('data')) {
                this.$store.state.pool.keyedById[data.pool_id].data.pool = data.poolPool
            }
        })
    }
}
</script>
