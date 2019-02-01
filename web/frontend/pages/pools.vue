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
                <historical
                    :elements="pools"
                    :selectedElements="selectedPools"
                    :attributes="graphAttributes"
                    :model="model"
                    :historyId="historyId"
                />
            </div>
        </div>
        <no-ssr>
            <div class="columns is-centered">
                <div class="column">
                    <list
                        :pools="pools"
                        :isLoading="!pools.length > 0"
                        @updated-pool-selection="updatePoolSelection($event)"
                    />
                </div>
            </div>
        </no-ssr>
    </section>
</template>

<script>
import List from '~/components/pools/List.vue'
import vueMixin from '~/mixins/vueMixin'
import Historical from '~/components/graphs/Historical.vue'
import Pie from '~/components/graphs/Pie.vue'
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
    components: { Pie, Historical, List },
    data () {
        return {
            graphAttributes: [
                {
                    id: 1,
                    label: 'Pool Difficulty',
                    name: 'difficulty'
                },
                {
                    id: 2,
                    label: 'Pool Hashrate',
                    name: 'hashrate'
                },
                {
                    id: 3,
                    label: 'Pool Height',
                    name: 'height'
                },
                {
                    id: 4,
                    label: 'Pool Miners',
                    name: 'miners'
                },
                {
                    id: 5,
                    label: 'Pool Total Blocks',
                    name: 'total_blocks'
                },
                {
                    id: 6,
                    label: 'Pool Total Miners Paid',
                    name: 'miners_paid'
                },
                {
                    id: 7,
                    label: 'Pool Total Payments',
                    name: 'total_payments'
                },
                {
                    id: 8,
                    label: 'Pool Time',
                    name: 'timestamp'
                }
            ],
            historyId: 'pool_id',
            model: 'pool-history',
            selectedPools: []
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
