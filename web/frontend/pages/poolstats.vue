<template>
    <div class="container is-block">
        <section class="section">
            <div class="columns is-centered">
                <list
                    :pools="pools"
                    :isLoading="!pools.length > 0"
                    class="column"
                />
            </div>
        </section>
    </div>
</template>

<script>
import List from '~/components/poolstats/List.vue'
import { mapGetters } from 'vuex'

export default {
    head () {
        return {
            title: 'My Pool Stats',
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: 'View data from all the TurtleCoin pools you\'ve mined at'
                },
                {
                    charset: 'utf-8'
                },
                {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1'
                }
            ]
        }
    },
    components: { List },
    data () {
        return {
            selectedPools: []
        }
    },
    computed: {
        ...mapGetters('pool', { getPools: 'list' }),
        pools () {
            return this.getPools
        }
    }
}
</script>
