<template>
    <section>
        <b-modal
            :active.sync="isCardModalActive"
            :width="640"
            :canCancel="true"
        >
            <form-wizard
                @on-complete="onComplete" 
                shape="circle"
                title="Generate Mining Config"
                subtitle=""
                color="#00853D"
            >
                <tab-content title="Wallet Address" icon="ti-user">
                    <div class="field">
                        <div class="control">
                            <input class="input" type="text" minlength="99" maxlength="99" placeholder="Your Wallet Address">
                        </div>
                    </div>
                </tab-content>
                <tab-content title="Verify" icon="ti-settings">
                    Verify Pool
                </tab-content>
                <tab-content title="Generate" icon="ti-check">
                    Generated Config File
                </tab-content>
                <template slot="custom-buttons-left">
                    <wizard-button
                        @click.native="cancel"
                        class="has-background-danger has-text-white"
                    >
                        Cancel
                    </wizard-button>
                </template>
            </form-wizard>
        </b-modal>
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
                    <a
                        :href="props.row.url"
                        target="_blank"
                    >
                        {{ props.row.name }}
                    </a>
                </b-table-column>
                <b-table-column field="data.pool.miners" label="Miners" sortable numeric>
                    <transition name="slide-fade" mode="out-in">
                        <div
                            :key="props.row.data.pool.miners"
                        >
                            {{ props.row.data.pool.miners.toLocaleString() }}
                        </div>
                    </transition>
                </b-table-column>
                <b-table-column field="data.config.minPaymentThreshold" label="Min. Payout" sortable numeric>
                    <transition name="slide-fade" mode="out-in">
                        <div
                            :key="props.row.data.config.minPaymentThreshold"
                        >
                            {{ (props.row.data.config.minPaymentThreshold / props.row.data.config.denominationUnit).toLocaleString() }}
                        </div>
                    </transition>
                </b-table-column>
                <b-table-column field="data.config.fee" label="Fee" sortable numeric>
                    <transition name="slide-fade" mode="out-in">
                        <div
                            :key="props.row.data.config.fee"
                        >
                            {{ twoDecimals(props.row.data.config.fee).toLocaleString() + '%' }}
                        </div>
                    </transition>
                </b-table-column>
                <b-table-column field="data.pool.totalPayments" label="Total Payments" sortable numeric>
                    <transition name="slide-fade" mode="out-in">
                        <div
                            :key="props.row.data.pool.totalPayments"
                        >
                            {{ props.row.data.pool.totalPayments.toLocaleString() }}
                        </div>
                    </transition>
                </b-table-column>
                <b-table-column field="data.pool.totalMinersPaid" label="Miners Paid" sortable numeric>
                    <transition name="slide-fade" mode="out-in">
                        <div
                            :key="props.row.data.pool.totalBlocks"
                        >
                            {{ props.row.data.pool.totalMinersPaid.toLocaleString() }}
                        </div>
                    </transition>
                </b-table-column>
                <b-table-column field="data.pool.totalBlocks" label="Total Blocks" sortable numeric>
                    <transition name="slide-fade" mode="out-in">
                        <div
                            :key="props.row.data.pool.totalBlocks"
                        >
                            {{ props.row.data.pool.totalBlocks.toLocaleString() }}
                        </div>
                    </transition>
                </b-table-column>
                <b-table-column field="data.pool.hashrate" label="Hashrate" sortable numeric>
                    <transition name="slide-fade" mode="out-in">
                        <div
                            :key="props.row.data.pool.hashrate"
                        >
                            {{ humanReadableHashrate(props.row.data.pool.hashrate, 2) }}
                        </div>
                    </transition>
                </b-table-column>
                <b-table-column field="data.network.height" label="Height" sortable numeric>
                    <transition name="slide-fade" mode="out-in">
                        <div
                            :key="props.row.data.network.height"
                        >
                            {{ props.row.data.network.height.toLocaleString() }}
                        </div>
                    </transition>
                </b-table-column>
                <b-table-column field="data.pool.lastBlockFound" label="Last Block Found" sortable>
                    <transition name="slide-fade" mode="out-in">
                        <div
                            class="has-text-right"
                            :key="props.row.data.pool.lastBlockFound"
                        >
                            {{ getFromattedDate(props.row.data.pool.lastBlockFound) }}
                        </div>
                    </transition>
                </b-table-column>
            </template>
            <template slot="detail" slot-scope="props">
                <div
                    class="columns is-centered is-multiline"
                    v-if="showCell(['data', 'config', 'ports'], props.row)"
                >
                    <div
                        class="column is-flex"
                        v-for="(config, index) in props.row.data.config.ports"
                        :key="index"
                    >
                        <div class="card">
                            <div class="card-header">
                                <p class="card-header-title">
                                    {{ config.desc }}
                                </p>
                            </div>
                            <div class="card-content">
                                <p>Address: {{ props.row.mining_address }}</p>
                                <p>Port: {{ config.port }}</p>
                                <p>Difficulty: {{ config.difficulty }}</p>
                                <div class="field has-addons">
                                    <div class="control">
                                        <div class="select">
                                            <select class="select">
                                                <option>Xmr-Stak</option>
                                                <option>XMRig</option>
                                                <option>XMRigCC</option>
                                                <option>CPUMiner</option>
                                                <option>Claymore</option>
                                                <option>YAM Miner</option>
                                                <option>CCminer</option>
                                                <option>XMRMiner</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="control">
                                        <a class="button is-primary" @click="isCardModalActive=true">Generate</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
            isCardModalActive: false,
            selectedPools: []
        }
    },
    mounted () {
        this.selectedPools.push(this.pools[0])
        this.$emit('updated-pool-selection', this.selectedPools.map(val => val.id))
    },
    methods: {
        onComplete () {
            
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

