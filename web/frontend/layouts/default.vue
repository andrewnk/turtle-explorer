<template>
  <div id="app">
    <!--<particles/>-->
    <navigation/>
    <nuxt/>
    <footer-section/>
  </div>
</template>

<script>
import Particles from '~/components/Particles'
import Navigation from '~/layouts/sections/Navigation'
import FooterSection from '~/layouts/sections/Footer'
import socket from '../socket'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    Particles,
    Navigation,
    FooterSection
  },
  methods: {
        ...mapActions('node', { findNodes: 'find' }),
        ...mapActions('node-data', { findNodeData: 'find' }),
        ...mapActions('pool', { findPools: 'find' }),
        ...mapActions('pool-data', { findPoolData: 'find' })
    },
    created() {
        this.findNodes()
        this.findNodeData({
            query: {
                $limit: 5
            }
        })

        this.findPools()
        this.findPoolData({
            query: {
                $limit: 5
            }
        })

        socket.on('notifyPoolNetwork', data => { 
          console.log(data)
        })
    }
}
</script>