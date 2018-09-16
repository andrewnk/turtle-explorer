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
                    {{ props.row.data.height ? props.row.data.height.toLocaleString() : ''}}
                </b-table-column>
                <b-table-column field="difficulty" label="Difficulty" sortable numeric>
                    {{ props.row.data.difficulty ? props.row.data.difficulty.toLocaleString() : '' }}
                </b-table-column>
                <b-table-column field="hashrate" label="Hashrate" sortable numeric>
                    {{ props.row.data.hashrate ? humanReadableHashrate(props.row.data.hashrate) : ''}}
                </b-table-column>
                <b-table-column field="txcount" label="TX Count" sortable numeric>
                    {{ props.row.data.tx_count ? props.row.data.tx_count.toLocaleString() : ''}}
                </b-table-column>
                <b-table-column field="txpoolsize" label="TX Pool" sortable numeric>
                    {{ props.row.data.tx_pool_size ? props.row.data.tx_pool_size.toLocaleString() : ''}}
                </b-table-column>
                <b-table-column field="incoming" label="Incoming Conn" sortable numeric>
                    {{ props.row.data.incoming_connections_count ? props.row.data.incoming_connections_count.toLocaleString() : '' }}
                </b-table-column>
                <b-table-column field="outgoing" label="Outgoing Conn" sortable numeric>
                    {{ props.row.data.outgoing_connections_count ? props.row.data.outgoing_connections_count.toLocaleString() : '' }}
                </b-table-column>
                <b-table-column field="last_known_block_index" label="Block Index" sortable>
                    {{ props.row.data.last_known_block_index ? props.row.data.last_known_block_index.toLocaleString() : ''}}
                </b-table-column>
                <b-table-column field="time" label="Timestamp" class="has-text-right" sortable>
                    {{ props.row.data.start_time ? getFromattedDate(props.row.data.start_time * 1000) : ''}}
                </b-table-column>
                <b-table-column field="version" label="Version" sortable numeric>
                    {{ props.row.data.version ? props.row.data.version : '' }}
                </b-table-column>
                <b-table-column field="status" label="Status" sortable>
                    {{ props.row.data.status ? props.row.data.status : 'Unkown' }}
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
