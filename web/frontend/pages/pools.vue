<template>
    <section class="container is-block">
        <div class="columns is-centered">
            <div class="column is-6">
                <no-ssr>
                    <pie
                        :series="hashrates"
                        titleText="Current Pool Hashrates"
                        seriesName="Hashrate"
                    />
                </no-ssr>
            </div>
            <div class="column is-6">
                <no-ssr>
                    <pie
                        :series="miners"
                        titleText="Total Pool Miners"
                        seriesName="Miners"
                    />
                </no-ssr>
            </div>
        </div>
        <no-ssr>
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
        </no-ssr>
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
                    name: 'difficulty',
                    format: {
                        yAxis: (obj) => {
                            return this.formatNumber(parseInt(obj.value), 1)
                        },
                        tooltip: function (x, y, name, label) {
                            return name + '<br/>' + label + ': ' + y.toLocaleString()
                        }.bind(this)
                    }
                },
                {
                    id: 2,
                    label: 'Pool Hashrate',
                    name: 'hashrate',
                    format: {
                        yAxis: (obj) => {
                            return this.humanReadableHashrate(obj.value, 0)
                        },
                        tooltip: function (x, y, name, label) {
                            return name + '<br/>' + label + ': ' + this.humanReadableHashrate(y)
                        }.bind(this)
                    }
                },
                {
                    id: 3,
                    label: 'Pool Height',
                    name: 'height',
                    format: {
                        yAxis: (obj) => {
                            return this.formatNumber(parseInt(obj.value), 3)
                        },
                        tooltip: function (x, y, name, label) {
                            return name + '<br/>' + label + ': ' + y.toLocaleString()
                        }.bind(this)
                    }
                },
                {
                    id: 4,
                    label: 'Pool Miners',
                    name: 'miners',
                    format: {
                        yAxis: (obj) => {
                            return this.formatNumber(parseInt(obj.value), 1)
                        },
                        tooltip: function (x, y, name, label) {
                            return name + '<br/>' + label + ': ' + y.toLocaleString()
                        }.bind(this)
                    }
                },
                {
                    id: 5,
                    label: 'Pool Total Blocks',
                    name: 'total_blocks',
                    format: {
                        yAxis: (obj) => {
                            return this.formatNumber(parseInt(obj.value), 2)
                        },
                        tooltip: function (x, y, name, label) {
                            return name + '<br/>' + label + ': ' + y.toLocaleString()
                        }.bind(this)
                    }
                },
                {
                    id: 6,
                    label: 'Pool Total Miners Paid',
                    name: 'miners_paid',
                    format: {
                        yAxis: (obj) => {
                            return this.formatNumber(parseInt(obj.value), 1)
                        },
                        tooltip: function (x, y, name, label) {
                            return name + '<br/>' + label + ': ' + y.toLocaleString()
                        }.bind(this)
                    }
                },
                {
                    id: 7,
                    label: 'Pool Total Payments',
                    name: 'total_payments',
                    format: {
                        yAxis: (obj) => {
                            return this.formatNumber(parseInt(obj.value), 1)
                        },
                        tooltip: function (x, y, name, label) {
                            return name + '<br/>' + label + ': ' + y.toLocaleString()
                        }.bind(this)
                    }
                },
                {
                    id: 8,
                    label: 'Pool Time',
                    name: 'timestamp',
                    format: {
                        yAxis: (obj) => {
                            return this.getFormattedDate(obj.value)
                        },
                        tooltip: function (x, y, name, label) {
                            return name + '<br/>' + label + ': ' + this.getFormattedDate(y)
                        }.bind(this)
                    }
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
