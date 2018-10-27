module.exports = {
  build: {
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      
      config.node = {
        fs: 'empty'
      }
    },
    vendor: ['buefy'],
    postcss: {
      plugins: {
        'postcss-custom-properties': false
      }
    }
  },
  css: [
    { src: '~/assets/scss/main.scss', lang: 'scss' },
    { src: '@fortawesome/fontawesome-free/scss/solid.scss', lang: 'scss' },
    { src: '@fortawesome/fontawesome-free/scss/fontawesome.scss', lang: 'scss' }
  ],
  modules: [
    'nuxt-fontawesome',
    '@nuxtjs/dotenv',
    '@nuxtjs/google-analytics'
  ],
  'google-analytics': {
    id: 'UA-125865065-1'
  },
  fontawesome: {
    imports: [
        {
          set: '@fortawesome/free-solid-svg-icons',
          icons: ['fas']
        },
    ],
  },
  head: {
    title: 'TurtleCoin Explorer',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: 'Explore historical and live block, node, pool, and transaction data for TurtleCoin' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  loading: { color: '#3B8070' },
  plugins: [
    { src: '~/plugins/buefy', ssr: false },
    { src: '~/plugins/vue2-highcharts', ssr: false },
    { src: '~/plugins/daterange-picker', ssr: false },
    { src: '~/plugins/vue-clipboard', ssr: false },
    { src: '~/plugins/vue-form-wizard', ssr: false },
    { src: '~/plugins/vue-json-excel', ssr: false },
    { src: '~/plugins/vue-cookie', ssr: false, injectAs: 'cookie' }
  ],
  render: {
    ssr: false
  }
}
