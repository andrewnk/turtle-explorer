<template>
    <section>
        <b-field grouped class="is-pulled-right" >
            <b-input v-model="search" placeholder="Search"></b-input>
            <b-select v-model="perPage" class="is-pulled-right">
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="15">15 per page</option>
                <option value="20">20 per page</option>
                <option :value="this.searchResults.length">All</option>
            </b-select>
        </b-field>
        <b-taglist attached>
            <b-tag type="is-dark">Total Nodes</b-tag>
            <b-tag type="is-primary">{{ this.searchResults.length }}</b-tag>
        </b-taglist>
        <b-table
            :data="searchResults"
            :is-row-checkable="(row) => true"
            :loading="isLoading"
            :checked-rows.sync="selectedNodes"
            :row-class="(row, index) => selectedNodes.map(val => val.id).includes(row.id) ? 'has-background-grey-dark' : ''"
            :paginated="true"
            :per-page="perPage"
            focusable
            checkable
        >
            <template slot-scope="props">
                <b-table-column field="name" label="Name" sortable>
                    <div :key="props.row.name">
                        {{ props.row.name }}
                    </div>
                </b-table-column>
                <b-table-column field="url" label="Url" sortable>
                    <div :key="props.row.url">
                        {{ props.row.url }}
                    </div>
                </b-table-column>
                <b-table-column field="port" label="Port" sortable>
                    <div :key="props.row.port">
                        {{ props.row.port }}
                    </div>
                </b-table-column>
                <b-table-column field="data.height" label="Height" sortable numeric>
                    <div :key="props.row.data.height">
                        {{ props.row.data.status !== 'Unreachable' && props.row.data.height ? props.row.data.height.toLocaleString() : ''}}
                    </div>
                </b-table-column>
                <b-table-column field="data.difficulty" label="Difficulty" sortable numeric>
                    <div :key="props.row.data.difficulty">
                        {{ props.row.data.status !== 'Unreachable' && props.row.data.difficulty ? props.row.data.difficulty.toLocaleString() : '' }}
                    </div>
                </b-table-column>
                <b-table-column field="data.hashrate" label="Hashrate" sortable numeric>
                    <div :key="props.row.data.hashrate">
                        {{ props.row.data.status !== 'Unreachable' && props.row.data.hashrate ? humanReadableHashrate(props.row.data.hashrate) : ''}}
                    </div>
                </b-table-column>
                <b-table-column field="data.txcount" label="TX Count" sortable numeric>
                    <div :key="props.row.data.txcount">
                        {{ props.row.data.status !== 'Unreachable' && props.row.data.tx_count ? props.row.data.tx_count.toLocaleString() : ''}}
                    </div>
                </b-table-column>
                <b-table-column field="data.txpoolsize" label="TX Pool" sortable numeric>
                    <div :key="props.row.data.txpoolsize">
                        {{ props.row.data.status !== 'Unreachable' && props.row.data.tx_pool_size ? props.row.data.tx_pool_size.toLocaleString() : ''}}
                    </div>
                </b-table-column>
                <b-table-column field="data.incoming" label="Incoming Conn" sortable numeric>
                    <div :key="props.row.data.incoming">
                        {{ props.row.data.status !== 'Unreachable' && props.row.data.incoming_connections_count ? props.row.data.incoming_connections_count.toLocaleString() : '' }}
                    </div>
                </b-table-column>
                <b-table-column field="data.outgoing" label="Outgoing Conn" sortable numeric>
                    <div :key="props.row.data.outgoing">
                        {{ props.row.data.status !== 'Unreachable' && props.row.data.outgoing_connections_count ? props.row.data.outgoing_connections_count.toLocaleString() : '' }}
                    </div>
                </b-table-column>
                <b-table-column field="data.last_known_block_index" label="Block Index" sortable>
                    <div :key="props.row.data.last_known_block_index">
                        {{ props.row.data.status !== 'Unreachable' && props.row.data.last_known_block_index ? props.row.data.last_known_block_index.toLocaleString() : ''}}
                    </div>
                </b-table-column>
                <b-table-column field="data.fee" label="Fee" sortable>
                    <div :key="props.row.data.fee">
                        {{ props.row.data.status !== 'Unreachable' && props.row.data.fee ? (props.row.data.fee / 100).toLocaleString() : ''}}
                    </div>
                </b-table-column>
                <b-table-column field="data.time" label="Timestamp" class="has-text-right" sortable>
                    <div :key="props.row.data.time">
                        {{ props.row.data.status !== 'Unreachable' && props.row.data.start_time ? getFromattedDate(props.row.data.start_time) : ''}}
                    </div>
                </b-table-column>
                <b-table-column field="data.version" label="Version" sortable numeric>
                    <div :key="props.row.data.version">
                        {{ props.row.data.status !== 'Unreachable' && props.row.data.version ? props.row.data.version : '' }}
                    </div>
                </b-table-column>
                <b-table-column field="data.status" label="Status" sortable>
                    <div
                        class="has-text-right"
                        :key="props.row.data.status"
                    >
                        {{ props.row.data.status }}
                    </div>
                </b-table-column>
            </template>
        </b-table>
    </section>
</template>

<script>
import vueMixin from '~/mixins/vueMixin.js'
import fuse from 'fuse.js'

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
            fuseObject: {},
            perPage: 10,
            search: '',
            selectedNodes: [],
            searchResults: []
        }
    },
    mounted () {
        this.selectedNodes.push(this.nodes[0])
        this.$emit('updated-node-selection', this.selectedNodes.map(val => val.id))
        this.fuseObject = new fuse(this.nodes, {
                shouldSort: true,
                includeScore: true,
                threshold: 0.3,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 1,
                keys: [
                    "name",
                    "url"
                ]
            })
        this.searchResults = this.fuseObject.list
    },
    watch: {
        selectedNodes: {
            handler: function(newVal, oldVal) {
                if(newVal !== oldVal) {
                    this.$emit('updated-node-selection', newVal.map(val => val.id))
                }
            },
            deep: true
        },
        search: function(newVal) {
            if(newVal.length > 0) {
                this.searchResults = this.fuseObject.search(newVal).map(val => val.item)
            } else {
                this.searchResults = this.fuseObject.list
            }
        }
    }
}
</script>
