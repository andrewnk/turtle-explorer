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
                    v-for="(attribute, index) in compareAttributes"
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
import DragPanes from 'highcharts/modules/drag-panes.js'
import Exporting from 'highcharts/modules/exporting.js'
import ExportData from 'highcharts/modules/export-data.js'
import { mapGetters } from 'vuex'

export default {
    name: 'Historical',
    props: {
        nodes: {
            type: Array,
            required: true,
            default: () => []
        },
        selectedNodes: {
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
            selectedAttribute: 1,
            selectedCompareAttribute: 0,
            chartParams: {
                query: {
                    node_id: {
                        $in: []
                    },
                    time: {
                        $gte: '',
                        $lte: ''
                    },
                    attribute: 'difficulty'
                }
            },
            attributes: [
                {
                    id: 1,
                    label: 'Difficulty',
                    name: 'difficulty',
                    format: (val) => {
                        return val.toLocaleString()
                    }
                },
                {
                    id: 2,
                    label: 'Hashrate',
                    name: 'hashrate',
                    format: (val) => {
                        return this.humanReadableHashrate(val)
                    }
                },
                {
                    id: 3,
                    label: 'Height',
                    name: 'height',
                    format: (val) => {
                        return val.toLocaleString()
                    }
                },
                {
                    id: 4,
                    label: 'Incoming Connection',
                    name: 'incomingConnectionsCount',
                    format: (val) => {
                        return val.toLocaleString()
                    }
                },
                {
                    id: 5,
                    label: 'Outgoing Connections',
                    name: 'outgoingConnectionsCount',
                    format: (val) => {
                        return val.toLocaleString()
                    }
                },
                {
                    id: 6,
                    label: 'Last Known Block Index',
                    name: 'lastKnownBlockIndex',
                    format: (val) => {
                        return val.toLocaleString()
                    }
                },
                {
                    id: 7,
                    label: 'Transaction Pool',
                    name: 'transactionPool',
                    format: (val) => {
                        return val.toLocaleString()
                    }
                },
                {
                    id: 8,
                    label: 'Time',
                    name: 'startTime',
                    format: (val) => {
                        return (new Date(val * 1000)).toUTCString()
                    }
                }
            ],
            options : {
                chart: {
                    backgroundColor: '#3c3c3c',
                    plotBorderColor: '#606063',
                    style: {
                        fontFamily: 'Roboto,sans-serif'
                    }
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
                    formatter: function() {
                        const points = this.points.sort((a, b) => {
                            return b.y - a.y;
                        })

                        let tooltip = '<b>' + this.points[0].series.options.label + '</b>';

                        this.points.forEach(point => {
                            tooltip += '<br/><span style="color:' + point.series.color +';">' + point.series.name + ': ' + point.series.options.displayFormat(point.y) + '</span>'
                        })

                        return tooltip
                    },
                    shared: true,
                    split: true,
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
                    height: '100%',
                    id: 'primary',
                    labels: {
                        style: {
                            color: '#E0E0E3'
                        }
                    },
                    lineColor: '#707073',
                    minorGridLineColor: '#505053',
                    offset: 30,
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }],
                    resize: {
                        enabled: true
                    },
                    title: {
                        style: {
                            color: '#A0A0A3'
                        },
                        text: 'Miners'
                    }
                }
            }
        }
    },
    mounted () {
        DragPanes(Highstock)
        Exporting(Highstock)
        ExportData(Highstock)
        const today = new Date()
        const startDate = this.convertToUTCStart(today)
        const endDate = this.convertToUTCEnd(today)
        this.selectedDates.start = new Date(startDate)
        this.selectedDates.end = new Date(endDate)

        this.chartParams.query.time.$gte = startDate
        this.chartParams.query.time.$lte = endDate
        this.chartParams.query.node_id.$in = this.selectedNodes
        this.chartParams.attribute = this.getAttributeName(this.selectedAttribute)
    },
    computed: {
        ...mapGetters('node-history', { getChartData: 'list' }),
        inputState() {
            if (!this.selectedDates) {
                return {
                    type: 'is-danger',
                    message: 'Date required.',
                }
            }
            return {
                type: 'is-primary',
                message: '',
            }
        },
        compareAgainstAttributes () {
            return this.attributes.filter(val => val.id !== this.selectedAttribute)
        },
        compareAttributes () {
            return this.attributes.filter(val => val.id !== this.selectedCompareAttribute)
        },
        compareOptionText () {
            return this.selectedCompareAttribute === 0 ? 'Compare Against' : 'Remove Compare'
        }
    },
    methods: {
        addSecondaryYAxis () {
            this.clearSecondaryAxis()

            const newAxis = Object.assign({
                height: '40%',
                id: 'secondary',
                labels: {
                    style: {
                        color: '#E0E0E3'
                    }
                },
                lineColor: '#707073',
                minorGridLineColor: '#505053',
                offset: 30,
                opposite: true,
                title: {
                    style: {
                        color: '#A0A0A3'
                    },
                    text: this.getAttributeLabel(this.selectedCompareAttribute)
                },
                top: '60%'
            }, this.options.yAxis)
            this.$refs.historical.chart.addAxis(newAxis)
            this.resizePrimaryYAxis()
        },
        clearSecondaryAxis () {
            if(typeof this.$refs.historical.chart.get('secondary') !== 'undefined') {
                this.$refs.historical.chart.get('secondary').remove()
                this.resizePrimaryYAxis()
            }
        },
        resizePrimaryYAxis () {
            this.$refs.historical.chart.get('primary').update({
                height: parseInt(this.selectedCompareAttribute) === 0 ? '100%' : '60%',
                resize: {
                    enabled: typeof this.$refs.historical.chart.get('secondary') === 'undefined' ? false : true
                }
            })
        },
        addSeries (label, axisId) {
            this.$refs.historical.showLoading()
            this.$store.dispatch('node-history/find', this.chartParams).then(() => {
                this.$refs.historical.chart.get(axisId).setTitle({text: label})
                this.getChartData.forEach((result, index) => {
                    const node = this.nodes.filter(node => node.id === result.node_id)
                    this.$refs.historical.addSeries({
                        data: result.data.map(val => {
                            const catTime = new Date(val[0])
                            return [
                                catTime.getTime(),
                                val[1]
                            ]
                        }),
                        displayFormat: this.attributes.filter(attribute => attribute.label === label)[0].format,
                        id: node[0].id,
                        label: label,
                        name: node[0].name,
                        yAxis: axisId
                    })
                })

                this.$refs.historical.chart.hideLoading()
            })
        },
        clearData () {
            this.$store.commit('node-history/clearAll')
            this.$refs.historical.removeSeries()
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

                this.clearData()
                this.addSeries(this.getAttributeLabel(this.selectedAttribute), 'primary')
                if(parseInt(this.selectedCompareAttribute) !== 0) {
                    this.addSecondaryYAxis()
                    this.addSeries(this.getAttributeLabel(this.selectedCompareAttribute), 'secondary')
                }
            },
            deep: true
        },
        selectedAttribute: function(newVal, oldVal) {
            if(newVal === oldVal) return

            this.selectedCompareAttribute = 0
            this.chartParams.query.attribute = this.getAttributeName(newVal)
            this.clearData()
            this.clearSecondaryAxis()
            this.addSeries(this.getAttributeLabel(this.selectedAttribute), 'primary')
        },
        selectedCompareAttribute: function(newVal, oldVal) {
            if(newVal === oldVal) return

            //remove compare
            if(parseInt(newVal) === 0) {
                this.chartParams.query.attribute = this.getAttributeName(this.selectedAttribute)
                this.clearData()
                this.clearSecondaryAxis()
                return this.addSeries(this.getAttributeLabel(this.selectedAttribute), 'primary')
            }

            this.chartParams.query.attribute = this.getAttributeName(newVal)
            this.addSecondaryYAxis()
            this.addSeries(this.getAttributeLabel(this.selectedCompareAttribute), 'secondary')
        },
        selectedNodes: {
            handler: function(newVal, oldVal) {
                if(newVal === oldVal) return

                this.chartParams.query.node_id.$in = newVal
                this.clearData()
                this.addSeries(this.getAttributeLabel(this.selectedAttribute), 'primary')
            },
            deep: true
        }
    }
}
</script>