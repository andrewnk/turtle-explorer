<template>
    <section>
        <generate-config
            :config="minerConfig"
            :is-active="isActive"
            v-on:update:isActive="isActive = $event"
        />
        <b-table
            :data="pools"
            :is-row-checkable="(row) => true"
            :loading="isLoading"
            :checked-rows.sync="selectedPools"
            detailed
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
                <b-table-column field="data.pool.miners" label="Miners" sortable numeric>
                    <div :key="props.row.data.pool.miners">
                        {{ props.row.data.pool.miners.toLocaleString() }}
                    </div>
                </b-table-column>
                <b-table-column field="data.config.minPaymentThreshold" label="Min. Payout" sortable numeric>
                    <div :key="props.row.data.config.minPaymentThreshold">
                        {{ (props.row.data.config.minPaymentThreshold / props.row.data.config.denominationUnit).toLocaleString() }}
                    </div>
                </b-table-column>
                <b-table-column field="data.config.fee" label="Fee" sortable numeric>
                    <div :key="props.row.data.config.fee">
                        {{ twoDecimals(props.row.data.config.fee).toLocaleString() + '%' }}
                    </div>
                </b-table-column>
                <b-table-column field="data.pool.totalPayments" label="Total Payments" sortable numeric>
                    <div :key="props.row.data.pool.totalPayments">
                        {{ props.row.data.pool.totalPayments.toLocaleString() }}
                    </div>
                </b-table-column>
                <b-table-column field="data.pool.totalMinersPaid" label="Miners Paid" sortable numeric>
                    <div :key="props.row.data.pool.totalBlocks">
                        {{ props.row.data.pool.totalMinersPaid.toLocaleString() }}
                    </div>
                </b-table-column>
                <b-table-column field="data.pool.totalBlocks" label="Total Blocks" sortable numeric>
                    <div :key="props.row.data.pool.totalBlocks">
                        {{ props.row.data.pool.totalBlocks.toLocaleString() }}
                    </div>
                </b-table-column>
                <b-table-column field="data.pool.hashrate" label="Hashrate" sortable numeric>
                    <div :key="props.row.data.pool.hashrate">
                        {{ humanReadableHashrate(props.row.data.pool.hashrate, 2) }}
                    </div>
                </b-table-column>
                <b-table-column field="data.network.height" label="Height" sortable numeric>
                    <div :key="props.row.data.network.height">
                        {{ props.row.data.network.height.toLocaleString() }}
                    </div>
                </b-table-column>
                <b-table-column field="data.pool.lastBlockFound" label="Last Block Found" sortable>
                    <div
                        class="has-text-right"
                        :key="props.row.data.pool.lastBlockFound"
                    >
                        {{ getFromattedDate(props.row.data.pool.lastBlockFound) }}
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
                        v-if="showCell(['data', 'config', 'ports'], props.row)"
                    >
                        <div
                            class="column is-3 is-flex"
                            v-for="(config, index) in props.row.data.config.ports"
                            :key="index"
                        >
                            <div class="card">
                                <div class="card-header">
                                    <p class="card-header-title">
                                        {{ config.desc }}
                                    </p>
                                </div>
                                <div class="card-content p-t-5">
                                    <p>Address: {{ props.row.mining_address }}</p>
                                    <p>Port: {{ config.port }}</p>
                                    <p>Difficulty: {{ config.difficulty }}</p>
                                    <div class="field p-t-15">
                                        <div class="control">
                                            <button class="button is-primary" @click="loadConfig(props.row, config)">Generate</button>
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
