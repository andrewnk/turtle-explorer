<template>
    <div class="container">
        <section class="section">
            <div class="columns is-centered">
                <no-ssr>
                    <node-history
                        :nodes="nodes"
                        :selectedNodes="selectedNodes"
                        class="column"
                    />
                </no-ssr>
            </div>
            <div class="columns is-centered">
                <no-ssr>
                    <list
                        :nodes="nodes"
                        :isLoading="!nodes.length > 0"
                        @updated-node-selection="updateNodeSelection($event)"
                        class="column"
                    />
                </no-ssr>
            </div>
        </section>
    </div>
</template>

<script>
import List from '~/components/nodes/List.vue'
import NodeHistory from '~/components/nodes/graphs/NodeHistory.vue'
import { mapGetters } from 'vuex'

export default {
    components: { List, NodeHistory },
    data () {
        return {
            selectedNodes: []
        }
    },
    computed: {
        ...mapGetters('node', { getNodes: 'list' }),
        nodes () {
            return this.getNodes.filter(value => value.hasOwnProperty('data'))
        }
    },
    methods: {
        updateNodeSelection (event) {
            this.selectedNodes = event
        }
    }
}
</script>
