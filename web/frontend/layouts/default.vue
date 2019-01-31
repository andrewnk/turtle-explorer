<template>
    <div id="app">
        <navigation/>
        <no-ssr>
            <b-notification :closable="false">
                <b-loading :is-full-page="true" :active="!isLoaded" :can-cancel="false"/>
            </b-notification>
        </no-ssr>
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
            isLoaded: true
        }
    },
    created () {
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
