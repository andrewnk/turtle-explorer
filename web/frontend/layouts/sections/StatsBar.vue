<template>
    <section id="stats-container" v-if="isLoaded">
        <transition name="slide-fade">
            <table class="table" key="table" id="stats-bar-table" v-show="show">
                <tbody>
                    <tr>
                        <th>
                            Height
                        </th>
                    </tr>
                    <tr>
                        <td>
                            {{ nodes.height.toLocaleString() }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            Difficulty
                        </th>
                    </tr>
                    <tr>
                        <td>
                            {{ nodes.difficulty.toLocaleString() }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            Node Hashrate
                        </th>
                    </tr>
                    <tr>
                        <td>
                            {{ humanReadableHashrate(nodes.hashrate) }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            Pool Hashrate
                        </th>
                    </tr>
                    <tr>
                        <td>
                            {{ poolHashrate !== null ? humanReadableHashrate(poolHashrate) : ''}}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            Miners
                        </th>
                    </tr>
                    <tr>
                        <td>
                            {{ poolMiners.toLocaleString() }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            Blocks
                        </th>
                    </tr>
                    <tr>
                        <td>
                            {{ poolBlocks.toLocaleString() }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            Payments
                        </th>
                    </tr>
                    <tr>
                        <td>
                            {{ poolPayments.toLocaleString() }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            Miners Paid
                        </th>
                    </tr>
                    <tr>
                        <td>
                            {{ poolMinersPaid.toLocaleString() }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </transition>
        <div id="toggle" key="div" @click="show = !show">
            <i class="fas" :class="fontClass"></i>
        </div>
    </section>
</template>

<script>
import vueMixin from '~/mixins/vueMixin'
import { mapGetters } from 'vuex'

export default {
    name: 'StatsBar',
    mixins: [vueMixin],
    props: {
        isLoaded: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            show: true
        }
    },
    computed: {
        ...mapGetters('node', { getNodes: 'list' }),
        ...mapGetters('pool', { getPools: 'list' }),
        pools () {
            return this.getPools.filter(value => value.hasOwnProperty('data') && value.data.hasOwnProperty('pool'))
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
            return this.getNodes.filter(val => val.hasOwnProperty('data')).sort((a, b) => (b.data.start_time - a.data.start_time) || 0)[0].data
        },
        fontClass() {
            return this.show ? 'fa-angle-double-left' : 'fa-angle-double-right'
        }
    }
}

</script>