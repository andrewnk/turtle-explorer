import Vue from 'vue';
import VueHighcharts from 'vue-highcharts';
import Highcharts from 'highcharts';
import loadExporting from 'highcharts/modules/exporting';
import loadExportData from 'highcharts/modules/export-data';
import loadStock from 'highcharts/modules/stock';

loadExporting(Highcharts);
loadExportData(Highcharts);
loadStock(Highcharts);

Vue.use(VueHighcharts, { Highcharts });
