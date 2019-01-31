<template>
    <section class="container is-block">
        <div class="columns is-centered">
            <div class="column">
                <historical
                    :elements="nodes"
                    :selectedElements="selectedNodes"
                    :attributes="graphAttributes"
                    :model="model"
                    :historyId="historyId"
                />
            </div>
        </div>
        <no-ssr>
            <div class="columns is-centered">
                <div class="column">
                    <list
                        :nodes="nodes"
                        :isLoading="!nodes.length > 0"
                        @updated-node-selection="updateNodeSelection($event)"
                    />
                </div>
            </div>
        </no-ssr>
    </section>
</template>

<script>
import List from '~/components/nodes/List.vue'
import Historical from '~/components/graphs/Historical.vue'
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
    components: { List, Historical },
    data () {
        return {
            selectedNodes: [],
            graphAttributes: [
                {
                    id: 1,
                    label: 'Node Difficulty',
                    name: 'difficulty'
                },
                {
                    id: 2,
                    label: 'Node Hashrate',
                    name: 'hashrate'
                },
                {
                    id: 3,
                    label: 'Node Height',
                    name: 'height'
                },
                {
                    id: 4,
                    label: 'Node Incoming Connection',
                    name: 'incoming_connections_count'
                },
                {
                    id: 5,
                    label: 'Node Outgoing Connections',
                    name: 'outgoing_connections_count'
                },
                {
                    id: 6,
                    label: 'Node Last Known Block Index',
                    name: 'last_known_block_index'
                },
                {
                    id: 7,
                    label: 'Node Transaction Pool',
                    name: 'tx_pool_size'
                },
                {
                    id: 8,
                    label: 'Node Time',
                    name: 'start_time'
                }
            ],
            historyId: 'node_id',
            model: 'node-history'
        }
    },
    computed: {
        ...mapGetters('node', { getNodes: 'list' }),
        nodes () {
            return this.getNodes
        }
    },
    methods: {
        updateNodeSelection (event) {
            this.selectedNodes = event
        }
    }
}
</script>
