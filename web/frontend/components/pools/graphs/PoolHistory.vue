<template>
    <section>
        <div class="columns">
            <b-select
                expanded
                v-model="selectedAttribute"
                class="column is-2 is-offset-5"
            >
                <option disabled value="0">Please an attribute</option>
                <option
                    v-for="(attribute, index) in attributes"
                    :value="attribute.id"
                    :key="index"
                >
                    {{ attribute.label }}
                </option>
            </b-select>
            <b-select
                expanded
                v-model="selectedCompareAttribute"
                class="column is-2"
            >
                <option value="0">{{ compareOptionText }}</option>
                <option
                    v-for="(attribute, index) in compareAgainstAttributes"
                    :value="attribute.id"
                    :key="index"
                >
                    {{ attribute.label }}
                </option>
            </b-select>
            <v-date-picker
                mode='range'
                v-model='selectedDates'
                class="column is-3"
                id="datepicker"
            >
                <b-field
                    :type='inputState.type'
                    slot-scope='props'
                >
                    <b-input
                        type='text'
                        icon='calendar'
                        :value='props.inputValue'
                        :placeholder='inputState.message'
                        @change.native='props.updateValue($event.target.value)'
                        expanded
                    />
                    <p class='control' v-if='selectedDates'>
                        <a
                            :class='["button", inputState.type]'
                            @click='selectedDates = null'
                        >
                            Clear
                        </a>
                    </p>
                </b-field>
            </v-date-picker>
        </div>
        <div class="columns">
            <vue-highcharts
                class="column"
                :highcharts="highstock"
                :options="options"
                ref="historical"
            />
        </div>
    </section>
</template>

<script>
import vueMixin from '~/mixins/vueMixin.js'
import Highstock from "highcharts/highstock"
import { mapGetters } from 'vuex'

export default {
    name: 'Historical',
    props: {
        pools: {
            type: Array,
            required: true,
            default: () => []
        },
        selectedPools: {
            type: Array,
            required: true,
            default: () => []
        }
    },
    mixins: [vueMixin],
    data () {
        return {
            highstock: Highstock,
            selectedDates: {
                start: '',
                end: ''
            },
            selectedAttribute: 4,
            selectedCompareAttribute: 0,
            chartParams: {
                query: {
                    pool_id: {
                        $in: []
                    },
                    time: {
                        $gte: '',
                        $lte: ''
                    },
                    attribute: 'miners'
                }
            },
            attributes: [
                {
                    id: 1,
                    label: 'Difficulty',
                    name: 'difficulty'
                },
                {
                    id: 2,
                    label: 'Hashrate',
                    name: 'hashrate'
                },
                {
                    id: 3,
                    label: 'Height',
                    name: 'height'
                },
                {
                    id: 4,
                    label: 'Miners',
                    name: 'miners'
                },
                {
                    id: 5,
                    label: 'Total Blocks',
                    name: 'totalBlocks'
                },
                {
                    id: 6,
                    label: 'Total Miners Paid',
                    name: 'totalMinersPaid'
                },
                {
                    id: 7,
                    label: 'Total Payments',
                    name: 'totalPayments'
                },
                {
                    id: 8,
                    label: 'Time',
                    name: 'timestamp'
                }
            ],
            options : {
                chart: {
                    backgroundColor: '#3c3c3c',
                    plotBorderColor: '#606063'
                },
                colors: [
                    '#f5f1f2',
                    '#b1e033',
                    '#ce289f',
                    '#6ca890',
                    '#91fb27',
                    '#ab0bd1',
                    '#fd3453',
                    '#22b29a',
                    '#26bf2a',
                    '#1a53bc',
                    '#60b2b3',
                    '#1aa0d8',
                    '#158af7',
                    '#f6b90a',
                    '#54c088',
                    '#2dd2d0',
                    '#ba7afa',
                    '#3afa02',
                    '#45afd0',
                    '#b8fe38',
                    '#8213f2'
                ],
                credits: {
                    enabled: false
                },
                labels: {
                    style: {
                        color: '#707073'
                    }
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            color: '#B0B0B3'
                        },
                        marker: {
                            lineColor: '#333'
                        }
                    }
                },
                rangeSelector: {
                    enabled: false,
                },
                scrollbar: {
                    barBackgroundColor: '#808083',
                    barBorderColor: '#808083',
                    buttonArrowColor: '#CCC',
                    buttonBackgroundColor: '#606063',
                    buttonBorderColor: '#606063',
                    rifleColor: '#FFF',
                    trackBackgroundColor: '#404043',
                    trackBorderColor: '#404043'
                },
                subtitle: {
                    text: '',
                    x: -20
                },
                title: {
                    style: {
                        color: '#E0E0E3',
                        textTransform: 'uppercase',
                        fontSize: '20px'
                    },
                    text: '',
                    x: -20
                },
                time: {
                    useUTC: true
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    style: {
                        color: '#F0F0F0'
                    }
                },
                xAxis: {
                    gridLineColor: '#707073',
                    labels: {
                        style: {
                            color: '#E0E0E3'
                        }
                    },
                    lineColor: '#707073',
                    minorGridLineColor: '#505053',
                    tickColor: '#707073',
                    title: {
                        style: {
                            color: '#A0A0A3'

                        }
                    },
                    type: 'datetime'
                },
                yAxis: {
                    gridLineColor: '#707073',
                    labels: {
                        style: {
                            color: '#E0E0E3'
                        }
                    },
                    lineColor: '#707073',
                    minorGridLineColor: '#505053',
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }],
                    tickColor: '#707073',
                    tickWidth: 1,
                    title: {
                        style: {
                            color: '#A0A0A3'
                        }
                    }
                }
            }
        }
    },
    mounted () {
        const today = new Date()
        const startDate = this.convertToUTCStart(today)
        const endDate = this.convertToUTCEnd(today)
        this.selectedDates.start = new Date(startDate)
        this.selectedDates.end = new Date(endDate)

        this.chartParams.query.time.$gte = startDate
        this.chartParams.query.time.$lte = endDate
        this.chartParams.query.pool_id.$in = this.selectedPools
        this.chartParams.attribute = this.getAttributeName(this.selectedAttribute)
        this.options.title.text = this.getAttributeLabel(this.selectedAttribute)
        this.updateChart('add', this.getAttributeLabel(this.selectedAttribute))
    },
    computed: {
        ...mapGetters('pool-history', { getChartData: 'list' }),
        inputState() {
            if (!this.selectedDates) {
                return {
                    type: 'is-danger',
                    message: 'Date required.',
                };
            }
            return {
                type: 'is-primary',
                message: '',
            };
        },
        compareAgainstAttributes () {
            return this.attributes.filter(val => val.id !== this.selectedAttribute)
        },
        compareOptionText () {
            return this.selectedCompareAttribute === 0 ? 'Compare Against' : 'Remove Compare'
        }
    },
    methods: {
        updateChart (action, label) {
            this.$refs.historical.showLoading()
            if(action === 'update') {
                this.$store.commit('pool-history/clearAll')
                this.$refs.historical.removeSeries()
            }

            this.$store.dispatch('pool-history/find', this.chartParams).then(() => {
                this.getChartData.forEach((result, index) => {
                    const pool = this.pools.filter(pool => pool.id === result.pool_id)
                    this.$refs.historical.addSeries({
                        name: pool[0].name + ' - ' + label,
                        data: result.data.map(val => {
                            const catTime = new Date(val[0])
                            return [
                                catTime.getTime(),
                                val[1]
                            ]
                        })
                    })
                })

                this.$refs.historical.chart.hideLoading()
            })
        },
        getAttributeLabel (id) {
            return this.attributes.filter(val => val.id === id)[0].label
        },
        getAttributeName (id) {
            return this.attributes.filter(val => val.id === id)[0].name
        }
    },
    watch: {
        selectedDates: {
            handler: function(newVal, oldVal) {
                if(newVal === null || (oldVal !== null && newVal.start === oldVal.start && newVal.end === oldVal.end)) return
                this.chartParams.query.time.$gte = this.convertToUTCStart(newVal.start)
                this.chartParams.query.time.$lte = this.convertToUTCEnd(newVal.end)
                this.updateChart('update', this.getAttributeLabel(this.selectedAttribute))
            },
            deep: true
        },
        selectedAttribute: function(newVal, oldVal) {
            if(newVal === oldVal) return
            this.chartParams.query.attribute = this.getAttributeName(newVal)
            this.options.title.text = this.selectedCompareAttribute > 0 ? 
                this.getAttributeLabel(newVal) + ' compared to ' + this.getAttributeLabel(this.selectedCompareAttribute) :
                this.getAttributeLabel(newVal)
            this.updateChart('update', this.getAttributeLabel(this.selectedAttribute))
        },
        selectedCompareAttribute: function(newVal, oldVal) {
            if(newVal === oldVal) return
            this.chartParams.query.attribute = this.getAttributeName(newVal)
            this.options.title.text = newVal > 0 ? 
                this.getAttributeLabel(this.selectedAttribute) + ' compared to ' + this.getAttributeLabel(newVal) :
                this.getAttributeLabel(newVal)
            this.updateChart('add', this.getAttributeLabel(this.selectedCompareAttribute))
        },
        selectedPools: {
            handler: function(newVal, oldVal) {
                if(newVal === oldVal) return
                this.chartParams.query.pool_id.$in = newVal
                this.updateChart('update', this.getAttributeLabel(this.selectedAttribute))
            },
            deep: true
        }
    }
}
</script>

<style scoped>
    #datepicker >>> .input {
        padding-left: 1em;
    }
</style>