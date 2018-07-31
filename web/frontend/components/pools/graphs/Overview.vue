<template>
    <div class="columns is-centered">
        <div class="column">
            <p>
                Total Miners: {{ totals.totalMiners }}
            </p>
            <p>
                Avg Fee: {{ totals.avgFee }}
            </p>
            <p>
                Total Payments: {{ totals.totalPayments }}
            </p>
            <p>
                Total Hashrate: {{ humanReadableHashrate(totals.totalHashrate) }}
            </p>
            <p>
                Total Miners Paid: {{ totals.totalMinersPaid }}
            </p>
            <p>
                Total Blocks: {{ totals.totalBlocks }}
            </p>
        </div>
    </div>
</template>

<script>
import vueMixin from '~/mixins/vueMixin.js'

export default {
  name: 'Overview',
  mixins: [vueMixin],
  props: {
    pools: {
      type: Array,
      required: true,
      default: () => { return [] }
    }
  },
  computed: {
        totals () {
            let pools = Object.values(this.pools).map(value => value.data.pool)
            let configs = Object.values(this.pools).map(value => value.data.config)
            return {
                totalMiners: pools.map(pool => pool.miners).reduce((acc, curr) => acc + curr),
                avgFee: configs.map(config => config.fee).reduce((acc, curr) => acc + curr) / configs.length,
                totalPayments: pools.map(pool => pool.totalPayments).reduce((acc, curr) => acc + curr),
                totalHashrate: pools.map(pool => pool.hashrate).reduce((acc, curr) => acc + curr),
                totalMinersPaid: pools.map(pool => pool.totalMinersPaid).reduce((acc, curr) => acc + curr),
                totalBlocks: pools.map(pool => pool.totalBlocks).reduce((acc, curr) => acc + curr)
            }
        }
    }
}

</script>
