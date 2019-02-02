<template>
    <div id="app">
        <navigation/>
        <no-ssr>
            <stats-bar/>
        </no-ssr>
        <nuxt class="main"/>
        <footer-section/>
        <no-ssr>
            <b-switch v-model="enableTooltips" class="tooltipSwitch" type="primary">
                Tooltips
            </b-switch>
        </no-ssr>
    </div>
</template>

<script>
import FooterSection from '~/layouts/sections/Footer'
import Navigation from '~/layouts/sections/Navigation'
import StatsBar from '~/layouts/sections/StatsBar'
import socket from '~/config/socket'
import { mapMutations } from 'vuex'

export default {
    components: {
        Navigation,
        FooterSection,
        StatsBar
    },
    data () {
        return {
            enableTooltips: true
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
    },
    methods: {
        ...mapMutations({ toggleTooltips: 'toggleTooltips'})
    },
    watch: {
        enableTooltips: function(newVal, oldVal) {
            this.toggleTooltips()
        }
    }
}
</script>

<style>
    .tooltipSwitch {
        position:fixed;
        right: 10px;
        bottom: 10px;
    }
</style>