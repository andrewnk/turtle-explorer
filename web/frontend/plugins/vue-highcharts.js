import Vue from 'vue';
import VueHighcharts from 'vue-highcharts';
import Highcharts from 'highcharts';
import loadStock from 'highcharts/modules/stock';

loadStock(Highcharts);

Vue.use(VueHighcharts, { Highcharts });
