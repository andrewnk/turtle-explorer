<template>
    <div class="container">
        <section class="section">
            <div class="columns is-centered">
                <div class="column">
                    <list :pools="pools" :isLoading="!pools.length > 0"></list>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import List from '~/components/pools/List.vue'
import { mapGetters } from 'vuex'

export default {
    components: { List },
    computed: {
        ...mapGetters('pool', { getPools: 'list' }),
        pools () {
            return this.getPools
        }
    }
}
</script>
