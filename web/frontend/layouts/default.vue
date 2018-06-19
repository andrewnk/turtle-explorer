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
import { mapActions } from 'vuex'

export default {
  components: {
    Particles,
    Navigation,
    FooterSection
  },
  mounted() {
    socket.on('notifyPoolNetwork', data => {
      this.$store.state.pool.keyedById[data.poolId].data.network = data.poolNetwork
    })
    socket.on('notifyPoolConfig', data => {
      this.$store.state.pool.keyedById[data.poolId].data.config = data.poolConfig
    })
    socket.on('notifyPoolPool', data => {
      this.$store.state.pool.keyedById[data.poolId].data.pool = data.poolPool
    })
  }
}
</script>
