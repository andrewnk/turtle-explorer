<template>
    <section>
        <highcharts
            :options="options"
            ref="highcharts"
        />
    </section>
</template>

<script>
export default {
    name: 'Miners',
    props: {
        pools: {
            type: Array,
            required: true,
            default: () => { return [] }
        }
    },
    mounted () {
        this.options.series[0].data = this.series
    },
    data () {
        return {
            options: {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: 'Current Pool Miners'
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            style: {
                                color: 'black'
                            }
                        }
                    }
                },
                series: [{
                    name: 'Pools',
                    colorByPoint: true,
                    data: []
                }]
            }
        }
    },
    computed: {
        series () {
            return this.pools
                .filter(pool => pool.data !== null)
                .map(pool => {
                return {
                    name: pool.name,
                    y: pool.data.pool.miners
                }
            })
        }
    },
    watch: {
        series() {
            this.$refs.highcharts.chart.series[0].setData(this.series, true)
        }
    }
}
</script>
