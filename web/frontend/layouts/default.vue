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

export default {
  components: {
    Particles,
    Navigation,
    FooterSection
  }
}
</script>