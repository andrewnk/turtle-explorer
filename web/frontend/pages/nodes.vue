<template>
    <section class="container is-block">
        <div class="columns is-centered">
            <div class="column">
                <node-history
                    :nodes="nodes"
                    :selectedNodes="selectedNodes"
                />
            </div>
        </div>
        <div class="columns is-centered">
            <div class="column">
                <list
                    :nodes="nodes"
                    :isLoading="!nodes.length > 0"
                    @updated-node-selection="updateNodeSelection($event)"
                />
            </div>
        </div>
    </section>
</template>

<script>
import List from '~/components/nodes/List.vue'
import NodeHistory from '~/components/nodes/graphs/NodeHistory.vue'
import { mapGetters } from 'vuex'

export default {
    head () {
        return {
            title: 'TurtleCoin Explorer - Node Explorer',
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: 'View live and historical information for public nodes on the TurtlCoin network'
                }
            ]
        }
    },
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
