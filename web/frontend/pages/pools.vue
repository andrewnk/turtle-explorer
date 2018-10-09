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
                    :pools="getPools.filter(pool => pool.hasOwnProperty('data') && pool.data.pool)"
                    :isLoading="!pools.length > 0"
                    @updated-pool-selection="updatePoolSelection($event)"
                />
            </div>
        </div>
    </section>
</template>

<script>
import List from '~/components/pools/List.vue'
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
    components: { Pie, PoolHistory, List },
    data () {
        return {
            selectedPools: [],
        }
    },
    computed: {
        ...mapGetters('pool', { getPools: 'list' }),
        hashrates () {
            return this.pools.map(pool => {
                return {
                    name: pool.name,
                    y: pool.data.pool.hashrate
                }
            })
        },
        miners () {
            return this.pools.map(pool => {
                return {
                    name: pool.name,
                    y: pool.data.pool.miners
                }
            })
        },
        pools () {
            return this.getPools.filter(pool => pool.hasOwnProperty('data') && pool.data.pool)
        },
        selectedPoolData () {
            return this.getPools.filter(pool => this.selectedPools.includes(pool.id))
        }
    },
    methods: {
        updatePoolSelection (event) {
            this.selectedPools = event
        }
    }
}
</script>
