<template>
    <section class="container is-block">
        <no-ssr>
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
        </no-ssr>
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
import vueMixin from '~/mixins/vueMixin.js'

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
    mixins: [vueMixin],
    data () {
        return {
            selectedNodes: [],
            graphAttributes: [
                {
                    id: 1,
                    label: 'Node Difficulty',
                    name: 'difficulty',
                    format: {
                        yAxis: (obj) => {
                            return this.formatNumber(parseInt(obj.value), 1)
                        },
                        tooltip: function (x, y, name, label) {
                            return name + '<br/>' + label + ': ' + y.toLocaleString()
                        }.bind(this)
                    }
                },
                {
                    id: 2,
                    label: 'Node Hashrate',
                    name: 'hashrate',
                    format: {
                        yAxis: (obj) => {
                            return this.humanReadableHashrate(obj.value, 0)
                        },
                        tooltip: function (x, y, name, label) {
                            return name + '<br/>' + label + ': ' + this.humanReadableHashrate(y)
                        }.bind(this)
                    }
                },
                {
                    id: 3,
                    label: 'Node Height',
                    name: 'height',
                    format: {
                        yAxis: (obj) => {
                            return this.formatNumber(parseInt(obj.value), 1)
                        },
                        tooltip: function (x, y, name, label) {
                            return name + '<br/>' + label + ': ' + y.toLocaleString()
                        }.bind(this)
                    }
                },
                {
                    id: 4,
                    label: 'Node Incoming Connection',
                    name: 'incoming_connections_count',
                    format: {
                        yAxis: (obj) => {
                            return this.formatNumber(parseInt(obj.value), 1)
                        },
                        tooltip: function (x, y, name, label) {
                            return name + '<br/>' + label + ': ' + y.toLocaleString()
                        }.bind(this)
                    }
                },
                {
                    id: 5,
                    label: 'Node Outgoing Connections',
                    name: 'outgoing_connections_count',
                    format: {
                        yAxis: (obj) => {
                            return this.formatNumber(parseInt(obj.value), 1)
                        },
                        tooltip: function (x, y, name, label) {
                            return name + '<br/>' + label + ': ' + y.toLocaleString()
                        }.bind(this)
                    }
                },
                {
                    id: 6,
                    label: 'Node Last Known Block Index',
                    name: 'last_known_block_index',
                    format: {
                        yAxis: (obj) => {
                            return this.formatNumber(parseInt(obj.value), 1)
                        },
                        tooltip: function (x, y, name, label) {
                            return name + '<br/>' + label + ': ' + y.toLocaleString()
                        }.bind(this)
                    }
                },
                {
                    id: 7,
                    label: 'Node Transaction Pool',
                    name: 'tx_pool_size',
                    format: {
                        yAxis: (obj) => {
                            return this.formatNumber(parseInt(obj.value), 1)
                        },
                        tooltip: function (x, y, name, label) {
                            return name + '<br/>' + label + ': ' + y.toLocaleString()
                        }.bind(this)
                    }
                },
                {
                    id: 8,
                    label: 'Node Time',
                    name: 'start_time',
                    format: {
                        yAxis: (obj) => {
                            return this.getFormattedDate(obj.value)
                        },
                        tooltip: function (x, y, name, label) {
                            return name + '<br/>' + label + ': ' + this.getFormattedDate(y)
                        }.bind(this)
                    }
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
