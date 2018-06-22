<template>
    <div class="container">
        <section class="section">
            <div class="columns is-centered">
                <div class="column">
                    <list :nodes="nodes" :isLoading="!nodes.length > 0"></list>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import List from '~/components/nodes/List.vue'
import { mapGetters } from 'vuex'

export default {
    components: { List },
    computed: {
        ...mapGetters('node', { getNodes: 'list' }),
        nodes () {
            return this.getNodes
        }
    }
}
</script>
