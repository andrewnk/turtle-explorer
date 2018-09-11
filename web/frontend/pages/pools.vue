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
        <div class="columns is-centered">
            <div class="column">
                <no-ssr>
                    <pool-history
                        :pools="pools"
                        :selectedPools="selectedPools"
                    />
                </no-ssr>
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
import Pie from '~/components/graphs/Pie.vue'
import PoolHistory from '~/components/pools/graphs/PoolHistory.vue'
import { mapGetters } from 'vuex'

export default {
    components: { Pie, PoolHistory, List },
    data () {
        return {
            selectedPools: []
        }
    },
    computed: {
        ...mapGetters('pool', { getPools: 'list' }),
        pools () {
            return this.getPools.filter(value => value.hasOwnProperty('data'))
        },
        miners () {
            return this.pools
                .filter(pool => pool.data !== null && pool.data.pool !== null)
                .map(pool => {
                return {
                    name: pool.name,
                    y: pool.data.pool.miners
                }
            })
        },
        hashrates () {
            return this.pools
                .filter(pool => pool.data !== null && pool.data.pool !== null)
                .map(pool => {
                    return {
                        name: pool.name,
                        y: pool.data.pool.hashrate
                    }
                })
        }
    },
    methods: {
        updatePoolSelection (event) {
            this.selectedPools = event
        }
    }
}
</script>