<template>
    <section>
        <generate-config
            :config="minerConfig"
            :is-active="isActive"
            v-on:update:isActive="isActive = $event"
        />
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
            <b-tag type="is-dark">Total Pools</b-tag>
            <b-tag type="is-primary">{{ this.searchResults.length }}</b-tag>
        </b-taglist>
        <b-table
            :data="searchResults"
            :is-row-checkable="(row) => true"
            :loading="isLoading"
            :checked-rows.sync="selectedPools"
            detailed
            :paginated="true"
            :per-page="perPage"
            focusable
            checkable
        >
            <template slot-scope="props">
                <b-table-column field="name" label="Name" sortable>
                    <div v-if="props.row.trusted">
                        <a
                            :href="props.row.url"
                            target="_trtl-mining-pool"
                        >
                            {{ props.row.name }}
                        </a>
                    </div>
                    <div v-else>
                        {{ props.row.name }}
                    </div>
                </b-table-column>
                <b-table-column field="data.miners" label="Miners" sortable numeric>
                    <div :key="props.row.data.miners">
                        {{ props.row.data.status !== 'Unreachable' && props.row.data.miners && props.row.data.miners !== "0" ? props.row.data.miners.toLocaleString() : '' }}
                    </div>
                </b-table-column>
                <b-table-column field="data.min_payout" label="Min. Payout" sortable numeric>
                    <div :key="props.row.data.min_payout">
                        {{ props.row.data.status !== 'Unreachable' && props.row.data.min_payout && props.row.data.min_payout !== "0" ? (props.row.data.min_payout / 100).toLocaleString() : '' }}
                    </div>
                </b-table-column>
                <b-table-column field="data.fee" label="Fee" sortable numeric>
                    <div :key="props.row.data.fee">
                        {{ props.row.data.status !== 'Unreachable' && props.row.data.fee ? twoDecimals(props.row.data.fee).toLocaleString() + '%' : '' }}
                    </div>
                </b-table-column>
                <b-table-column field="data.total_payments" label="Total Payments" sortable numeric>
                    <div :key="props.row.data.total_payments">
                        {{ props.row.data.status !== 'Unreachable' && props.row.data.total_payments && props.row.data.total_payments !== "0" ? props.row.data.total_payments.toLocaleString() : '' }}
                    </div>
                </b-table-column>
                <b-table-column field="data.miners_paid" label="Miners Paid" sortable numeric>
                    <div :key="props.row.data.miners_paid">
                        {{ props.row.data.status !== 'Unreachable' && props.row.data.miners_paid && props.row.data.miners_paid !== "0" ? props.row.data.miners_paid.toLocaleString() : '' }}
                    </div>
                </b-table-column>
                <b-table-column field="data.total_blocks" label="Total Blocks" sortable numeric>
                    <div :key="props.row.data.total_blocks">
                        {{ props.row.data.status !== 'Unreachable' && props.row.data.total_blocks && props.row.data.total_blocks !== "0" ? props.row.data.total_blocks.toLocaleString() : '' }}
                    </div>
                </b-table-column>
                <b-table-column field="data.hashrate" label="Hashrate" sortable numeric>
                    <div :key="props.row.data.hashrate">
                        {{ props.row.data.status !== 'Unreachable' && props.row.data.hashrate && props.row.data.hashrate !== "0" ? humanReadableHashrate(parseInt(props.row.data.hashrate), 2) : '' }}
                    </div>
                </b-table-column>
                <b-table-column field="data.height" label="Height" sortable numeric>
                    <div :key="props.row.data.height">
                        {{ props.row.data.status !== 'Unreachable' && props.row.data.height && props.row.data.height !== "0" ? props.row.data.height.toLocaleString() : '' }}
                    </div>
                </b-table-column>
                <b-table-column field="data.last_block_found" label="Last Block Found" sortable>
                    <div
                        class="has-text-right"
                        :key="props.row.data.last_block_found"
                    >
                        {{ props.row.data.status !== 'Unreachable' && props.row.data.last_block_found && props.row.data.last_block_found !== "0" && props.row.data.last_block_found !== "0" ? getFromattedDate(props.row.data.last_block_found) : '' }}
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
                <b-table-column field="trusted" label="Trusted" sortable class="has-text-centered">
                    <i class="fas" :class="props.row.trusted ? 'fa-check' : 'fa-ban'"></i>
                </b-table-column>
            </template>
            <template slot="detail" slot-scope="props">
                <div v-if="props.row.trusted">
                    <div
                        class="columns is-multiline"
                        v-if="showCell(['ports'], props.row)"
                    >
                        <div
                            class="column is-3 is-flex"
                            v-for="(port, index) in props.row.ports"
                            :key="index"
                        >
                            <div class="card">
                                <div class="card-header">
                                    <p class="card-header-title">
                                        {{ port.description }}
                                    </p>
                                </div>
                                <div class="card-content p-t-5">
                                    <p>Address: {{ props.row.mining_address }}</p>
                                    <p>Port: {{ port.port }}</p>
                                    <p>Difficulty: {{ port.difficulty }}</p>
                                    <div class="field p-t-15">
                                        <div class="control">
                                            <button class="button is-primary" @click="loadConfig(props.row, port)">Generate</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    This pool is untrusted; we will not supply mining configs for untrusted pools.
                </div>
            </template>
        </b-table>
    </section>
</template>

<script>
import GenerateConfig from '~/components/pools/GenerateConfig'
import vueMixin from '~/mixins/vueMixin'
import fuse from 'fuse.js'

export default {
    name: 'List',
    mixins: [vueMixin],
    components: { GenerateConfig },
    props: {
        pools: {
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
            searchResults: [],
            isActive: false,
            minerConfig: {
                pool: {},
                config: {},
            },
            selectedPools: [this.pools[0]]
        }
    },
    mounted () {
        this.$emit('updated-pool-selection', this.selectedPools.map(val => val.id))
        this.fuseObject = new fuse(this.pools, {
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
        loadConfig (pool, config) {
            this.isActive = true
            this.minerConfig.pool = pool
            this.minerConfig.config = config
        }
    },
    watch: {
        selectedPools: {
            handler: function(newVal, oldVal) {
                if(newVal !== oldVal) {
                    this.$emit('updated-pool-selection', newVal.map(val => val.id))
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

<style>
.modal-close {
    display: none;
}

.modal-background {
    background: #3c3c3c;
    opacity: 0.7;
}
</style>
