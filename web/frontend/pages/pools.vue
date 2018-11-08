<template>
    <section class="container is-block">
        <div class="columns is-centered">
            <div class="column is-6">
                <pie
                    :series="hashrates"
                    titleText="Current Pool Hashrates"
                    seriesName="Hashrate"
                />
            </div>
            <div class="column is-6">
                <pie
                    :series="miners"
                    titleText="Total Pool Miners"
                    seriesName="Miners"
                />
            </div>
        </div>
        <div class="columns is-centered">
            <div class="column">
                <pool-history
                    :pools="pools"
                    :selectedPools="selectedPools"
                    :selectedPoolData="selectedPoolData"
                />
            </div>
        </div>
        <div class="columns is-centered">
            <div class="column">
                <list
                    :pools="pools"
                    :isLoading="!pools.length > 0"
                    @updated-pool-selection="updatePoolSelection($event)"
                />
            </div>
        </div>
    </section>
</template>

<script>
import List from '~/components/pools/List.vue'
import vueMixin from '~/mixins/vueMixin'
import Pie from '~/components/graphs/Pie.vue'
import PoolHistory from '~/components/pools/graphs/PoolHistory.vue'
import { mapGetters } from 'vuex'

export default {
    head () {
        return {
            title: 'TurtleCoin Explorer - Pool Explorer',
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: 'View live and historical information for TurtleCoin pools and generate mining configs'
                }
            ]
        }
    },
    mixins: [vueMixin],
    components: { Pie, PoolHistory, List },
    data () {
        return {
            selectedPools: [],
        }
    },
    computed: {
        ...mapGetters('pool', { getPools: 'list' }),
        ...mapGetters('node', { getNodes: 'list' }),
        hashrates () {
            let pools = this.pools.map(pool => {
                return {
                    name: pool.name,
                    y: parseInt(pool.data.hashrate)
                }
            })

            //get most common node hashrate, subtract it from the pool hashrate to get the unkown
            const hashrates = pools.map(val => val.y)
            const hashrateTotal = hashrates.reduce((a, b) => a + b)

            pools.push({
                name: 'Unknown',
                y: this.nodeHashrate - hashrateTotal
            })

            return pools
        },
        miners () {
            return this.pools.map(pool => {
                return {
                    name: pool.name,
                    y: parseInt(pool.data.miners)
                }
            })
        },
        pools () {
            return this.getPools
        },
        selectedPoolData () {
            return this.getPools.filter(pool => this.selectedPools.includes(pool.id))
        },
        nodeHashrate () {
            // get the most common hashrate among nodes
            let hashrates = this.getNodes.filter(val => parseInt(val.data.hashrate) !== 0).map(val => val.data.hashrate)
            return this.getMostCommonElement(hashrates)
        },
    },
    methods: {
        updatePoolSelection (event) {
            this.selectedPools = event
        }
    }
}
</script>
