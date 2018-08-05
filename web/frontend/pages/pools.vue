<template>
    <div class="container">
        <section class="section">
            <div class="columns is-centered">
                <no-ssr>
                    <hashrates
                        :pools="pools"
                        class="column is-6"
                    />
                </no-ssr>
                <no-ssr>
                    <miners
                        :pools="pools"
                        class="column is-6"
                    />
                </no-ssr>
            </div>
            <div class="columns is-centered">
                <no-ssr>
                    <pool-history
                        :pools="pools"
                        :selectedPools="selectedPools"
                        class="column"
                    />
                </no-ssr>
            </div>
            <div class="columns is-centered">
                <list
                    :pools="pools"
                    :isLoading="!pools.length > 0"
                    @updated-pool-selection="updatePoolSelection($event)"
                    class="column"
                />
            </div>
        </section>
    </div>
</template>

<script>
import Hashrates from '~/components/pools/graphs/Hashrates.vue'
import PoolHistory from '~/components/pools/graphs/PoolHistory.vue'
import List from '~/components/pools/List.vue'
import Miners from '~/components/pools/graphs/Miners.vue'
import { mapGetters } from 'vuex'

export default {
    components: { List, Hashrates, Miners, PoolHistory },
    data () {
        return {
            selectedPools: []
        }
    },
    computed: {
        ...mapGetters('pool', { getPools: 'list' }),
        pools () {
            return this.getPools.filter(value => value.hasOwnProperty('data'))
        }
    },
    methods: {
        updatePoolSelection (event) {
            this.selectedPools = event
        }
    }
}
</script>