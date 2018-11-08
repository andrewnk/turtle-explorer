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
import socket from '~/config/socket'
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
        promises.push(this.$store.dispatch('pool/find', { query: { $sort: { name: 1 }}}))

        promises.push(this.$store.dispatch('node/find', { query: { $sort: { name: 1 }}}))

        Promise.all(promises).then(() => this.isLoaded = true)

        socket.on('notifyNode', data => {
            if(this.$store.state.node.keyedById[data.node_id]) {
                this.$store.state.node.keyedById[data.node_id] = data
            } else {
                this.$store.commit('node/addItem', data)
            }
        })
        socket.on('notifyNodeData', data => {
            if(this.$store.state.node.keyedById[data.node_id]) {
                this.$store.state.node.keyedById[data.node_id].data = data
            }
        })
        socket.on('notifyPool', data => {
            if(this.$store.state.pool.keyedById[data.pool_id]) {
                this.$store.state.pool.keyedById[data.pool_id] = data
            } else {
                this.$store.commit('pool/addItem', data)
            }
        })
        socket.on('notifyPoolData', data => {
            if(this.$store.state.pool.keyedById[data.pool_id]) {
                this.$store.state.pool.keyedById[data.pool_id].data = data
            }
        })
    }
}
</script>
