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
                            {{ nodeHeight.toLocaleString() }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            Difficulty
                        </th>
                    </tr>
                    <tr>
                        <td>
                            {{ nodeDifficulty.toLocaleString() }}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            Node Hashrate
                        </th>
                    </tr>
                    <tr>
                        <td>
                            {{ humanReadableHashrate(nodeHashrate) }}
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
            return this.getPools.filter(value => value.hasOwnProperty('data') && value.data !== '')
        },
        poolHashrate () {
            return this.pools.map(pool => pool.data.hashrate).reduce((acc, val) => acc.length > 0 ? parseInt(acc) : parseInt(acc) + parseInt(val))
        },
        poolMiners () {
            return this.pools.map(pool => pool.data.miners).reduce((acc, val) => acc.length > 0 ? parseInt(acc) : parseInt(acc) + parseInt(val))
        },
        poolBlocks () {
            return this.pools.map(pool => pool.data.total_blocks).reduce((acc, val) => acc.length > 0 ? parseInt(acc) : parseInt(acc) + parseInt(val))
        },
        poolPayments () {
            return this.pools.map(pool => pool.data.total_payments).reduce((acc, val) => acc.length > 0 ? parseInt(acc) : parseInt(acc) + parseInt(val))
        },
        poolMinersPaid () {
            return this.pools.map(pool => pool.data.miners_paid).reduce((acc, val) => acc.length > 0 ? parseInt(acc) : parseInt(acc) + parseInt(val))
        },
        nodes () {
            return this.getNodes.filter(val => val.hasOwnProperty('data'))
        },
        nodeHashrate () {
            // get the most common hashrate among nodes
            let hashrates = this.nodes.filter(val => parseInt(val.data.hashrate) !== 0).map(val => val.data.hashrate)
            return this.getMostCommonElement(hashrates)
        },
        nodeHeight () {
            // get the most common height among nodes
            let heights = this.nodes.filter(val => parseInt(val.data.height) !== 0).map(val => val.data.height)
            return this.getMostCommonElement(heights)
        },
        nodeDifficulty () {
            // get the most common difficulty among nodes
            let difficulties = this.nodes.filter(val => parseInt(val.data.difficulty) !== 0).map(val => val.data.difficulty)
            return this.getMostCommonElement(difficulties)
        },
        fontClass() {
            return this.show ? 'fa-angle-double-left' : 'fa-angle-double-right'
        }
    }
}

</script>