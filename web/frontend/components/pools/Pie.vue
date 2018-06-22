<template>
    <section>
        <highcharts :options="options" ref="highcharts"></highcharts>
    </section>
</template>

<script>
export default {
    name: 'Pie',
    props: {
        pools: {
            type: Array,
            required: true,
            default: () => { return [] }
        }
    },
    created () {
        this.options.series[0].data = this.series
    },
    data: function () {
        return {
            options: {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: 'Pool Hashrates'
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
            return this.pools.map(pool => {
                if (!pool.data) { return }

                return {
                    name: pool.name,
                    y: pool.data.pool.hashrate
                }
            })
        }
    }
}
</script>
