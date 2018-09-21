<template>
    <section v-if="series">
        <vue-highcharts
            :options="options"
            :highcharts="highcharts"
            ref="pieChart"
        />
    </section>
</template>

<script>
import Highcharts from "highcharts/highcharts"
import Exporting from 'highcharts/modules/exporting.js'
import ExportData from 'highcharts/modules/export-data.js'

export default {
    name: 'Pie',
    props: {
        series: {
            type: Array,
            required: true,
            default: () => []
        },
        titleText: {
            type: String,
            required: true,
            default: 'Title'
        },
        seriesName: {
            type: String,
            required: true,
            default: 'Series'
        }
    },
    mounted () {
        Exporting(Highcharts)
        ExportData(Highcharts)
        this.$refs.pieChart.showLoading()
        this.$refs.pieChart.getChart().setTitle({ text: this.titleText })
        this.$refs.pieChart.addSeries({ data: this.series, name: this.seriesName })
        this.$refs.pieChart.hideLoading()
    },
    data () {
        return {
            highcharts: Highcharts,
            options: {
                chart: {
                    backgroundColor: '#3c3c3c',
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    style: {
                        fontFamily: 'Roboto,sans-serif'
                    },
                    type: 'pie',
                },
                contrastTextColor: '#3c3c3c',
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
                        color: '#707073',
                    }
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            color: '#E0E0E3'
                        },
                        marker: {
                            lineColor: '#333'
                        }
                    },
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            style: {
                                textOutline: false,
                                fontSize: '12px'
                            }
                        }
                    }
                },
                textColor: '#C0C0C0',
                title: {
                    style: {
                        color: '#E0E0E3',
                        textTransform: 'uppercase',
                        fontSize: '20px'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
                    style: {
                        color: '#F0F0F0'
                    }
                }
            }
        }
    },
    watch: {
        series: function (newVal) {
            this.$refs.pieChart.getChart().series[0].setData(newVal, true)
        }
    }
}
</script>
