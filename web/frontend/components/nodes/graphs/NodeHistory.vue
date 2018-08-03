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
                <option disabled value="0">Compare Against</option>
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
            <highstock
                class="column"
                style="height:800px"
                :options="options"
                ref="historical"
            />
        </div>
    </section>
</template>

<script>
import vueMixin from '~/mixins/vueMixin.js'
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
                    label: 'Incoming Connection',
                    name: 'incomingConnectionsCount'
                },
                {
                    id: 5,
                    label: 'Outgoing Connections',
                    name: 'outgoingConnectionsCount'
                },
                {
                    id: 6,
                    label: 'Last Known Block Index',
                    name: 'lastKnownBlockIndex'
                }
            ],
            options : {
                title: {
                    text: '',
                    x: -20 //center
                },
                credits: {
                    enabled: false
                },
                subtitle: {
                    text: '',
                    x: -20
                },
                xAxis: {
                    type: 'datetime'
                },
                yAxis: {
                    plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                    }]
                },
                rangeSelector: {
                    enabled: false,
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: []
            }
        }
    },
    mounted () {
        const today = new Date()
        const startDate = today.setHours(0,0,0,0)
        const endDate = today.setHours(23,59,59,999)
        this.selectedDates.start = new Date(startDate)
        this.selectedDates.end = new Date(endDate)

        this.chartParams.query.time.$gte = startDate
        this.chartParams.query.time.$lte = endDate
        this.chartParams.query.node_id.$in = this.selectedNodes
        this.chartParams.attribute = this.options.title.text = this.getAttributeLabel(this.selectedAttribute)
        this.updateChart('add', this.getAttributeLabel(this.selectedAttribute))
    },
    computed: {
        ...mapGetters('node-history', { getChartData: 'list' }),
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
        }
    },
    methods: {
        updateChart (action, label) {
            this.$refs.historical.chart.showLoading()
            this.$store.dispatch('node-history/find', this.chartParams).then(() => {
                if(action === 'update') {
                    this.clearChart()
                }

                this.getChartData.forEach((result, index) => {
                    const node = this.nodes.filter(node => node.id === result.node_id)
                    this.options.series.push({
                        name: node[0].name + ' - ' + label,
                        data: result.data.map(val => {
                            const catTime = new Date(val[0])
                            return [
                                catTime.getTime(),
                                Math.round(val[1])
                            ]
                        })
                    })
                })
                this.$refs.historical.chart.hideLoading()
            })
        },
        clearChart () {
            for(var i = this.options.series.length - 1; i >= 0; i--) {
                this.options.series.splice(i, 1)
            }
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
                this.chartParams.query.time.$gte = newVal.start
                this.chartParams.query.time.$lte = newVal.end
                this.updateChart('update', this.getAttributeLabel(this.selectedAttribute))
            },
            deep: true
        },
        selectedAttribute: function(newVal, oldVal) {
            if(newVal === oldVal) return
            this.chartParams.query.attribute = this.getAttributeName(newVal)
            this.options.title.text = 
                this.selectedCompareAttribute > 0 ? 
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
        selectedNodes: {
            handler: function(newVal, oldVal) {
                if(newVal === oldVal) return
                this.chartParams.query.node_id.$in = newVal
                this.updateChart('update', this.getAttributeLabel(this.selectedAttribute))
            },
            deep: true
        }
    }
}
</script>
