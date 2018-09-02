<template>
    <section>
        <b-collapse :open="true" class="is-centered">
            <table class="table">
                <thead>
                    <tr>
                        <th>Height</th>
                        <th>Difficulty</th>
                        <th>Node Hashrate</th>
                        <th>Pool Hashrate</th>
                        <th>Miners</th>
                        <th>Blocks</th>
                        <th>Payments</th>
                        <th>Miners Paid</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            {{ nodes.height.toLocaleString() }}
                        </td>
                        <td>
                            {{ nodes.difficulty.toLocaleString() }}
                        </td>
                        <td>
                            {{ humanReadableHashrate(nodes.hashrate) }}
                        </td>
                        <td>
                            {{ humanReadableHashrate(poolHashrate) }}
                        </td>
                        <td>
                            {{ poolMiners.toLocaleString() }}
                        </td>
                        <td>
                            {{ poolBlocks.toLocaleString() }}
                        </td>
                        <td>
                            {{ poolPayments.toLocaleString() }}
                        </td>
                        <td>
                            {{ poolMinersPaid.toLocaleString() }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </b-collapse>
    </section>
</template>

<script>
import vueMixin from '~/mixins/vueMixin.js'
import { mapGetters } from 'vuex'

export default {
    name: 'StatsBar',
    mixins: [vueMixin],
    computed: {
        ...mapGetters('node', { getNodes: 'list' }),
        ...mapGetters('pool', { getPools: 'list' }),
        pools () {
            return this.getPools.filter(value => value.hasOwnProperty('data'))
        },
        poolHashrate () {
            return this.pools.map(pool => pool.data.pool.hashrate).reduce((acc, val) => acc.length > 0 ? acc : acc + val)
        },
        poolMiners () {
            return this.pools.map(pool => pool.data.pool.miners).reduce((acc, val) => acc.length > 0 ? acc : acc + val)
        },
        poolBlocks () {
            return this.pools.map(pool => pool.data.pool.totalBlocks).reduce((acc, val) => acc.length > 0 ? acc : acc + val)
        },
        poolPayments () {
            return this.pools.map(pool => pool.data.pool.totalPayments).reduce((acc, val) => acc.length > 0 ? acc : acc + val)
        },
        poolMinersPaid () {
            return this.pools.map(pool => pool.data.pool.totalMinersPaid).reduce((acc, val) => acc.length > 0 ? acc : acc + val)
        },
        nodes () {
            return this.getNodes.filter(value => value.hasOwnProperty('data'))
                .reduce((acc, val) => {
                    return acc.hasOwnProperty('data') && acc.data.start_time > val.data.start_time ? acc.data : val.data
                })
        }
    },
}

</script>
