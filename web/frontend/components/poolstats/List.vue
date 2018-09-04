<template>
    <section>
        <div class="field">
            <div class="control" :class="isLoading ? is-loading : ''">
                <input class="input" v-model="wallet" type="text" minlength="99" maxlength="99" placeholder="Your Wallet Address">
            </div>
        </div>
        <b-table
            :data="poolStats"
            :is-row-checkable="(row) => true"
            :loading="isLoading"
            :checked-rows.sync="selectedPools"
            detailed
            checkable
            v-show="poolStats.length > 0"
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
                    {{ props.row.data.stats.hasOwnProperty('hashrate') ? humanReadableHashrate(props.row.data.stats.hashrate) : '' }}
                </b-table-column>
                <b-table-column field="hashrate_6h" label="6 Hour Hashrate" sortable>
                    {{ props.row.data.stats.hasOwnProperty('hashrate_6h') ? humanReadableHashrate(props.row.data.stats.hashrate_6h) : '' }}
                </b-table-column>
                <b-table-column field="hashrate_24h" label="24 Hour Hashrate" sortable>
                    {{ props.row.data.stats.hasOwnProperty('hashrate_24h') ? humanReadableHashrate(props.row.data.stats.hashrate_24h) : '' }}
                </b-table-column>
                <b-table-column field="payments" label="Total Payments" sortable>
                    {{ props.row.data.payments.length * 2 }}
                </b-table-column>
                <b-table-column field="total" label="Total Paid" sortable>
                    {{ (props.row.data.stats.paid / 100).toLocaleString() }}
                </b-table-column>
                <b-table-column field="total" label="Total Hashes" sortable>
                    {{ parseInt(props.row.data.stats.hashes).toLocaleString() }}
                </b-table-column>
                <b-table-column field="total" label="Balance" sortable>
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
    </section>
</template>

<script>
import vueMixin from '~/mixins/vueMixin.js'
import fetch from 'node-fetch'

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
            isLoading: false,
            poolStats: [],
            selectedPools: [],
            wallet: ''
        }
    },
    mounted () {
        this.selectedPools.push(this.pools[0])
        this.$emit('updated-pool-selection', this.selectedPools.map(val => val.id))
    },
    watch: {
        wallet: function (newVal) {
            if (newVal.length !== 99) {
                this.poolStats = []
            }
            this.poolStats = []
            this.pools.forEach(pool => {
                fetch(pool.api + 'stats_address?longpoll=true&address=' + newVal, {
                    method: 'get',
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(res => {
                    this.isLoading = true
                    return res.json()
                })
                .catch(err => {})
                .then(json => {
                    if (!json.hasOwnProperty('error') && json.hasOwnProperty('payments') && json.payments.length > 0) {
                        let mergedPayments = []
                        let payment = ''

                        //because of goofy ass pool api array structure
                        for (var i = json.payments.length - 1; i >= 0; i--) {
                            if(i % 2 === 0) {
                                //add to payment string
                                payment = json.payments[i]
                            } else {
                                if(payment.length > 0) {
                                    //add timestamp to payment string, push into array, and clear string
                                    payment += ':' + json.payments[i]
                                    mergedPayments.push(payment)
                                    payment = ''
                                }
                            }
                        }
                        json.payments = mergedPayments
                        this.poolStats.push({
                            pool: pool,
                            data: json
                        })
                        this.isLoading = false
                    }
                })
                .catch(err => {})
            })
        },
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