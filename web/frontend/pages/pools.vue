<template>
    <div class="container">
        <section class="section">
            <div class="columns is-centered">
                <div class="column">
                    <h1 class="title">Pools</h1>
                </div>
            </div>
            <div class="columns is-centered">
                <div class="column">General Pool Stats</div>
            </div>
            <div class="columns is-centered">
                <div class="column">1</div>
                <div class="column">2</div>
                <div class="column">3</div>
                <div class="column">4</div>
            </div>
            <div class="columns is-centered">
                <div class="column">Pool Graph</div>
            </div>
            <div class="columns is-centered">
                <div class="column">I'm a Pool Graph</div>
            </div>

            <div class="columns is-centered">
                <div class="column">Pool Table</div>
            </div>
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
