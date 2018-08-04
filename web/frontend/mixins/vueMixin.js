import * as moment from 'moment'

export default {
    methods: {
        getFromattedDate (utctz) {
            //return moment().startOf('day').valueOf()
            return moment.utc(utctz).toDate()
        },
        twoDecimals (val) {
            return parseFloat(Math.round(val * 100) / 100).toFixed(2);
        },
        convertToUTCStart (date) {
            return Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate(),0,0,0,0)
        },
        convertToUTCEnd (date) {
            return Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate(),23,59,59,999)
        },
        humanReadableHashrate: (bytes, decimals) => {
            if (bytes === 0) return '0 H/sec'
            let k = 1024
            let dm = decimals || 2
            let sizes = ['H/sec', 'KH/sec', 'MH/sec', 'GH/sec', 'TH/sec', 'PH/sec', 'EH/sec', 'ZH/sec', 'YH/sec']
            let i = Math.floor(Math.log(bytes) / Math.log(k))
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
        },
        showCell (props, obj) {
            return props.reduce((xs, x) => (xs && xs[x]) ? xs[x] : false, obj)
        }
    }
}