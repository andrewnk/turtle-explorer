<template>
    <div id="app">
        <!--<particles/>-->
        <navigation/>
        <nuxt class="main"/>
        <footer-section/>
    </div>
</template>

<script>
import Particles from '~/components/Particles'
import Navigation from '~/layouts/sections/Navigation'
import FooterSection from '~/layouts/sections/Footer'
import socket from '../socket'
import { mapActions } from 'vuex'

export default {
    components: {
        Particles,
        Navigation,
        FooterSection
    },
    mounted() {
        socket.on('notifyNode', data => {
            // console.log('node', data)
            // this.$store.state.node.keyedById[data.node_id].data = data
        })
        socket.on('notifyNodeData', data => {
        // this.$store.state.node.keyedById[data.node_id].data = data
        })
        socket.on('notifyPool', data => {
            // console.log('pool', data)
            if(this.$store.state.pool.keyedById[data.pool_id].hasOwnProperty('data')) {
                this.$store.state.pool.keyedById[data.pool_id].data = data
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
