export default {
    methods: {
        twoDecimals (val) {
            return parseFloat(Math.round(val * 100) / 100).toFixed(2);
        },
        getFromattedDate (UTCString) {
            if(typeof UTCString === 'undefined') return
            const utc = UTCString.length > 12 ? new Date(parseInt(UTCString)) : new Date(parseInt(UTCString * 1000))
            return utc.getUTCMonth() + 1 + '/' + utc.getUTCDate() + '/' + utc.getUTCFullYear() + ' ' + utc.getUTCHours() + ':' + utc.getUTCMinutes() + ':' + utc.getUTCSeconds() + ' UTC'
        },
        convertToUTCStart (date) {
            return Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate(),0,0,0,0)
        },
        convertToUTCEnd (date) {
            return Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate(),23,59,59,999)
        },
        humanReadableHashrate: (bytes, decimals) => {
            if (bytes === 0) return '0 H'
            let k = 1024
            let dm = decimals || 2
            let sizes = ['H', 'KH', 'MH', 'GH', 'TH', 'PH', 'EH', 'ZH', 'YH']
            let i = Math.floor(Math.log(bytes) / Math.log(k))
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
        },
        showCell (props, obj) {
            return props.reduce((a, b) => (a && a[b]) ? a[b] : false, obj)
        },
        validateWalletAddress (walletAddress) {

            const regex = /^[a-z0-9]+$/i
            return walletAddress && walletAddress.length === 99 && walletAddress.substring(0, 4) === 'TRTL' && regex.test(walletAddress)
        },
        getMostCommonElement (elements) {
            return elements.sort((a, b) => elements.filter(v => v === a).length - elements.filter(v => v === b).length).pop()
        }
    }
}