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
  created() {
    socket.on('notifyPoolNetwork', data => { 
      // console.log(data)
    })
  }
}
</script>
