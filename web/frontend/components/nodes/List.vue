<template>
    <section>
        <b-table
            :data="nodes"
            :is-row-checkable="(row) => true"
            :loading="isLoading"
            :checked-rows.sync="selectedNodes"
            detailed
            checkable
        >
            <template slot-scope="props">
                <b-table-column field="name" label="Name" sortable numeric>
                    {{ props.row.name }}
                </b-table-column>
                <b-table-column field="height" label="Height" sortable numeric>
                    {{ props.row.data.height }}
                </b-table-column>
                <b-table-column field="difficulty" label="Difficulty" sortable numeric>
                    {{ props.row.data.difficulty }}
                </b-table-column>
                <b-table-column field="hashrate" label="Hashrate" sortable numeric>
                    {{ humanReadableHashrate(props.row.data.hashrate) }}
                </b-table-column>
                <b-table-column field="txcount" label="Transaction Count" sortable numeric>
                    {{ props.row.data.tx_count }}
                </b-table-column>
                <b-table-column field="txpoolsize" label="Transaction Pool Size" sortable numeric>
                    {{ props.row.data.tx_pool_size }}
                </b-table-column>
                <b-table-column field="incoming" label="Incoming Connections" sortable numeric>
                    {{ props.row.data.incoming_connections_count }}
                </b-table-column>
                <b-table-column field="outgoing" label="Outgoing Connections" sortable numeric>
                    {{ props.row.data.outgoing_connections_count }}
                </b-table-column>
                <b-table-column field="last_known_block_index" label="Last Known Block Index" sortable>
                    {{ props.row.data.last_known_block_index }}
                </b-table-column>
                <b-table-column field="time" label="Timestamp" sortable>
                    {{ getFromattedDate(props.row.data.start_time * 1000) }}
                </b-table-column>
                <b-table-column field="version" label="Version" sortable numeric>
                    {{ props.row.data.version }}
                </b-table-column>
                <b-table-column field="status" label="Status" sortable>
                    {{ props.row.data.status }}
                </b-table-column>
            </template>
        </b-table>
    </section>
</template>

<script>
import vueMixin from '~/mixins/vueMixin.js'

export default {
    name: 'List',
    mixins: [vueMixin],
    props: {
        nodes: {
            type: Array,
            required: true,
            default: () => []
        },
        isLoading: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            selectedNodes: []
        }
    },
    mounted () {
        this.selectedNodes.push(this.nodes[0])
        this.$emit('updated-node-selection', this.selectedNodes.map(val => val.id))
    },
    watch: {
        selectedNodes: {
            handler: function(newVal, oldVal) {
                if(newVal !== oldVal) {
                    this.$emit('updated-node-selection', newVal.map(val => val.id))
                }
            },
            deep: true
        }
    }
}
</script>
