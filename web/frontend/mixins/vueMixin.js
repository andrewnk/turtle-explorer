export default {
  methods: {
    getUTC (epoch) {
        return new Date(parseInt(epoch)).toUTCString()
    },
    twoDecimals (val) {
        return parseFloat(Math.round(val * 100) / 100).toFixed(2);
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