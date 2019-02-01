<template>
    <section>
        <no-ssr>
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
        </no-ssr>
        <no-ssr>
            <b-taglist attached>
                <b-tag type="is-dark">Total Nodes</b-tag>
                <b-tag type="is-primary">{{ this.searchResults.length }}</b-tag>
            </b-taglist>
        </no-ssr>
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
            <template slot-scope="props" slot="header">
                <b-tooltip :label="props.column.meta" v-if="toolTipActive && props.column.meta.length > 0">
                    <div @click="setSortValue(props.column.field)">
                        {{ props.column.label }}
                    </div>
                </b-tooltip>
                <div v-else @click="setSortValue(props.column.field)">
                    {{ props.column.label }}
                </div>
            </template>
            <template slot-scope="props">
                <b-table-column field="name" meta="" label="Name" sortable>
                    <div :key="props.row.name">
                        {{ props.row.name }}
                    </div>
                </b-table-column>
                <b-table-column field="url" meta="" label="Url" sortable>
                    <div :key="props.row.url">
                        {{ props.row.url }}
                    </div>
                </b-table-column>
                <b-table-column field="port" meta="" label="Port" sortable>
                    <div :key="props.row.port">
                        {{ props.row.port }}
                    </div>
                </b-table-column>
                <b-table-column field="height" meta="" :custom-sort="sorter" label="Height" sortable numeric>
                    <div :key="props.row.data.height">
                        {{ props.row.data.status !== 'Unreachable' && props.row.data.height ? props.row.data.height.toLocaleString() : ''}}
                    </div>
                </b-table-column>
                <b-table-column field="difficulty" :custom-sort="sorter" meta="" label="Difficulty" sortable numeric>
                    <div :key="props.row.data.difficulty">
                        {{ props.row.data.status !== 'Unreachable' && props.row.data.difficulty ? props.row.data.difficulty.toLocaleString() : '' }}
                    </div>
                </b-table-column>
                <b-table-column field="hashrate" :custom-sort="sorter" meta="" label="Hashrate" sortable numeric>
                    <div :key="props.row.data.hashrate">
                        {{ props.row.data.status !== 'Unreachable' && props.row.data.hashrate ? humanReadableHashrate(props.row.data.hashrate) : ''}}
                    </div>
                </b-table-column>
                <b-table-column field="tx_count" :custom-sort="sorter" meta="" label="TX Count" sortable numeric>
                    <div :key="props.row.data.txcount">
                        {{ props.row.data.status !== 'Unreachable' && props.row.data.tx_count ? props.row.data.tx_count.toLocaleString() : ''}}
                    </div>
                </b-table-column>
                <b-table-column field="tx_pool_size" :custom-sort="sorter" meta="" label="TX Pool" sortable numeric>
                    <div :key="props.row.data.txpoolsize">
                        {{ props.row.data.status !== 'Unreachable' && props.row.data.tx_pool_size ? props.row.data.tx_pool_size.toLocaleString() : ''}}
                    </div>
                </b-table-column>
                <b-table-column field="incoming_connections_count" meta="" :custom-sort="sorter" label="Incoming Conn" sortable numeric>
                    <div :key="props.row.data.incoming">
                        {{ props.row.data.status !== 'Unreachable' && props.row.data.incoming_connections_count ? props.row.data.incoming_connections_count.toLocaleString() : '' }}
                    </div>
                </b-table-column>
                <b-table-column field="outgoing_connections_count" meta="" :custom-sort="sorter" label="Outgoing Conn" sortable numeric>
                    <div :key="props.row.data.outgoing">
                        {{ props.row.data.status !== 'Unreachable' && props.row.data.outgoing_connections_count ? props.row.data.outgoing_connections_count.toLocaleString() : '' }}
                    </div>
                </b-table-column>
                <b-table-column field="last_known_block_index" :custom-sort="sorter" meta="" label="Block Index" sortable>
                    <div :key="props.row.data.last_known_block_index">
                        {{ props.row.data.status !== 'Unreachable' && props.row.data.last_known_block_index ? props.row.data.last_known_block_index.toLocaleString() : ''}}
                    </div>
                </b-table-column>
                <b-table-column field="fee" :custom-sort="sorter" meta="" label="Fee" sortable>
                    <div :key="props.row.data.fee">
                        {{ props.row.data.status !== 'Unreachable' && props.row.data.fee ? (props.row.data.fee / 100).toLocaleString() : ''}}
                    </div>
                </b-table-column>
                <b-table-column field="start_time" label="Timestamp" meta="" :custom-sort="sorter" class="has-text-right" sortable>
                    <div :key="props.row.data.time">
                        {{ props.row.data.status !== 'Unreachable' && props.row.data.start_time ? getFromattedDate(props.row.data.start_time) : ''}}
                    </div>
                </b-table-column>
                <b-table-column field="version" label="Version" :custom-sort="sorter" meta="" sortable numeric>
                    <div :key="props.row.data.version">
                        {{ props.row.data.status !== 'Unreachable' && props.row.data.version ? props.row.data.version : '' }}
                    </div>
                </b-table-column>
                <b-table-column field="data.status" label="Status" :custom-sort="sorter" meta="" sortable>
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
        },
        toolTipActive: {
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
            searchResults: [],
            sortValue: ''
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
    methods: {
        setSortValue (val) {
            this.sortValue = val
        },
        sorter (a, b, isAsc) {
            if(!this.sortValue || !a.data.hasOwnProperty(this.sortValue) || !b.data.hasOwnProperty(this.sortValue)) return

            const first = (typeof a.data[this.sortValue] === 'string') ? a.data[this.sortValue] : parseFloat(a.data[this.sortValue])
            const next = (typeof b.data[this.sortValue] === 'string') ? b.data[this.sortValue] : parseFloat(b.data[this.sortValue])

            return isAsc ? next - first : first - next
        }
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
            this.searchResults = newVal.length > 0 ? this.fuseObject.search(newVal).map(val => val.item) : this.fuseObject.list
        }
    }
}
</script>
