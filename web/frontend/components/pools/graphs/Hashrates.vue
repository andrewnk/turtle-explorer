<template>
    <section>
        <vue-highcharts
            :options="options"
            ref="pieChart"
        />
    </section>
</template>

<script>
export default {
    name: 'Hashrates',
    props: {
        pools: {
            type: Array,
            required: true,
            default: () => []
        }
    },
    mounted () {
        this.$refs.pieChart.showLoading()
        this.options.series.data = this.series
        this.$refs.pieChart.addSeries(this.options.series)
        this.$refs.pieChart.hideLoading()
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
                    text: 'Current Pool Hashrates'
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
                series: {
                    name: 'Hashrate',
                    colorByPoint: true,
                    data: []
                }
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
                        y: pool.data.pool.hashrate
                    }
                })
        }
    },
    watch: {
        series () {
            this.$refs.pieChart.getChart().series[0].setData(this.series, true)
        }
    }
}
</script>
