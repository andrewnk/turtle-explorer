<template>
    <section>
    </section>
</template>

<script>
export default {
  name: 'StatsBar',
  props: {
    pools: {
      type: Array,
      required: true,
      default: () => []
    },
    nodes: {
      type: Array,
      required: true,
      default: () => []
    }
  }
}

</script>
