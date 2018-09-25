<template>
    <section>
        <div class="columns">
            <div class="column is-12">
                <div class="field has-addons">
                    <div class="control width-100" :class="isLoading ? 'is-loading' : ''">
                        <input class="input" :class="!validateWalletAddress(this.wallet) ? 'is-danger' : ''" v-model="wallet" type="text" minlength="99" maxlength="99" placeholder="Your Wallet Address">
                    </div>
                    <div class="control">
                        <button class="button is-primary" :disabled="!validateWalletAddress(this.wallet)" @click="pollOnce">
                            Poll Once
                        </button>
                    </div>
                    <div class="control">
                        <button class="button is-info" :disabled="!validateWalletAddress(this.wallet)" @click="pollInterval">
                            Poll Every Minute
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="columns has-text-centered" v-if="failed">
            <div class="column is-12">
                Sorry we were not able to find any results
            </div>
        </div>
        <div class="columns">
            <div class="column is-12">
                <div class="field" v-show="selectedPools.length > 0">
                    <div class="buttons has-addons is-right">
                        <download-excel
                            class="button"
                            :data="formattedDataForExport"
                            :fields="exportFields"
                            name="poolstats.xls"
                        >
                            Download
                        </download-excel>
                    </div>
                </div>
            </div>
        </div>
        <div class="columns">
            <div class="column is-12">
                <b-table
                    :data="poolStats"
                    :is-row-checkable="(row) => true"
                    :loading="isLoading"
                    :checked-rows.sync="selectedPools"
                    :class="poolStats.length < 1 ? 'transparent' : ''"
                    detailed
                    checkable
                    v-show="poolStats.length > 0 || isLoading"
                >
                    <template slot-scope="props">
                        <b-table-column field="name" label="Name" sortable>
                            <a
                                :href="props.row.pool.url"
                                target="_blank"
                            >
                                {{ props.row.pool.name }}
                            </a>
                        </b-table-column>
                        <b-table-column field="hashrate" label="Current Hashrate" sortable>
                            {{ props.row.data.stats.hasOwnProperty('hashrate') ? formatHashrate(props.row.data.stats.hashrate) : '' }}
                        </b-table-column>
                        <b-table-column field="hashrate6h" label="6 Hour Hashrate" sortable>
                            {{ props.row.data.stats.hasOwnProperty('hashrate_6h') ? formatHashrate(props.row.data.stats.hashrate_6h) : '' }}
                        </b-table-column>
                        <b-table-column field="hashrate24h" label="24 Hour Hashrate" sortable>
                            {{ props.row.data.stats.hasOwnProperty('hashrate_24h') ? formatHashrate(props.row.data.stats.hashrate_24h) : '' }}
                        </b-table-column>
                        <b-table-column field="payments" label="Recent Payments" sortable>
                            {{ props.row.data.payments.length }}
                        </b-table-column>
                        <b-table-column field="totalPaid" label="Total Paid" sortable>
                            {{ (props.row.data.stats.paid / 100).toLocaleString() }}
                        </b-table-column>
                        <b-table-column field="totalHashes" label="Total Hashes" sortable>
                            {{ parseInt(props.row.data.stats.hashes).toLocaleString() }}
                        </b-table-column>
                        <b-table-column field="balance" label="Balance" sortable>
                            {{ (props.row.data.stats.balance / 100).toLocaleString() }}
                        </b-table-column>
                    </template>
                    <template slot="detail" slot-scope="props">
                        <b-table
                            :data="props.row.data.payments"
                        >
                            <template slot-scope="props">
                                <b-table-column field="time" label="Time" sortable>
                                    {{ getFromattedDate(props.row.split(':')[4] * 1000) }}
                                </b-table-column>
                                <b-table-column field="hash" label="Hash" sortable>
                                    {{ props.row.split(':')[0] }}
                                </b-table-column>
                                <b-table-column field="amount" label="Amount" sortable>
                                    {{ (props.row.split(':')[1] / 100).toLocaleString() }}
                                </b-table-column>
                            </template>
                        </b-table>
                    </template>
                </b-table>
            </div>
        </div>
    </section>
</template>

<script>
import vueMixin from '~/mixins/vueMixin'
import fetchTimeout from 'fetch-timeout'

export default {
    name: 'List',
    mixins: [vueMixin],
    props: {
        pools: {
            type: Array,
            required: true,
            default: () => []
        }
    },
    data () {
        return {
            exportFields: {
                'Pool': 'name',
                'Total Paid': {
                    field: 'stats.paid',
                    callback: (value) => {
                        return (value / 100)
                    }
                },
                'Total Hashes': 'stats.hashes',
                'Balance' : {
                    field: 'stats.balance',
                    callback: (value) => {
                        return (value / 100)
                    }
                },
                'Payments': {
                    field: 'payments',
                }
            },
            failed: false,
            isLoading: false,
            interval: null,
            poolStats: [],
            selectedPools: [],
            wallet: this.$cookie.get('wallet') ? this.$cookie.get('wallet') : null
        }
    },
    beforeDestroy () {
        clearInterval(this.interval)
    },
    computed: {
        formattedDataForExport () {
            return this.selectedPools.map(pool => {
                return Object.assign({}, pool.pool, pool.data)
            })
        }
    },
    methods: {
        formatHashrate (hashrate) {
            if(/[a-z]/i.test(hashrate)) {
                return hashrate
            }

            return this.humanReadableHashrate(hashrate)
        },
        pollOnce () {
            clearInterval(this.interval)
            this.pollPools()
        },
        pollInterval () {
            this.pollPools()
            this.interval = setInterval(() => this.pollPools(), 60000)
        },
        pollPools () {
            if (!this.validateWalletAddress(this.wallet))  return
            this.isLoading = true
            this.failed = false

            let promises = []
            this.pools.forEach(pool => {
                this.isLoading = true
                promises.push(fetchTimeout(pool.api + 'stats_address?longpoll=true&address=' + this.wallet, {
                    method: 'get',
                    headers: { 'Content-Type': 'application/json' },
                }, 15000)
                .then(result => {
                    if (result.status === 200) {
                        return result.json()
                    }
                })
                .then(json => {
                    if (!json.hasOwnProperty('error') && json.hasOwnProperty('payments') && json.payments.length > 0) {
                        let mergedPayments = []
                        let payment = ''

                        //because of goofy ass pool api array structure
                        for (let i = 0; i < json.payments.length; i++) {
                            if(i % 2 === 0) {
                                //add to payment string
                                payment = json.payments[i]
                            } else {
                                //add timestamp to payment string, push into array, and clear string
                                payment += ':' + json.payments[i]
                                mergedPayments.push(payment)
                                payment = ''
                            }
                        }
                        json.payments = mergedPayments
                        return {
                            pool: pool,
                            data: json
                        }
                    }
                })
                .catch(err => {}))
            })

            Promise.all(promises)
            .then(results => {
                this.poolStats = []
                this.poolStats = results.filter(result => typeof result === 'object')
                this.failed = this.poolStats.length < 1 ? true : false
                this.isLoading = false
            })
        }
    },
    watch: {
        wallet: function(newVal) {
            if (this.validateWalletAddress(newVal)) {
                this.$cookie.set('wallet', newVal, { expires: 365 })
            }
        }
    }
}
</script>

<style>
    .transparent table {
        background: transparent !important;
    }
</style>