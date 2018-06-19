<template>
    <div class="container">
        <section class="section">
            <div class="columns is-centered">
                <div class="column">
                    <h1 class="title">Nodes</h1>
                </div>
            </div>
            <div class="columns is-centered">
                <div class="column">General Node Stats</div>
            </div>
            <div class="columns is-centered">
                <div class="column">1</div>
                <div class="column">2</div>
                <div class="column">3</div>
                <div class="column">4</div>
            </div>
            <div class="columns is-centered">
                <div class="column">Node Graph</div>
            </div>
            <div class="columns is-centered">
                <div class="column">I'm a Node Graph</div>
            </div>
            <div class="columns is-centered">
                <div class="column">
                    <list :nodes="nodes" :isLoading="nodes.length > 0"></list>
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
