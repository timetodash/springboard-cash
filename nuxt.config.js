export default {
  server: {
    // Enable to access on mobile via local network
    host: '0.0.0.0',
  },
  env: {
    SPRINGBOARD_CONTRACT_ID:
      process.env[`NUXT_SPRINGBOARD_CONTRACT_ID_${process.env.NUXT_ENV_RUN}`],
    DAPIADDRESSES: process.env.NUXT_DAPIADDRESSES
      ? JSON.parse(process.env.NUXT_DAPIADDRESSES)
      : undefined,
    DPNS: process.env.NUXT_DPNS_CONTRACT_ID
      ? { contractId: process.env.NUXT_DPNS_CONTRACT_ID }
      : undefined,
    LOCALNODE: !!process.env.NUXT_LOCALNODE,
    INSIGHTAPI:
      process.env.NUXT_INSIGHTAPI || 'https://testnet-insight.dashevo.org', // TODO use livenet URL
  },
  mode: 'spa',
  router: {
    mode: 'hash',
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'custom',
        path: '/',
        component: resolve(__dirname, 'pages/project/list.vue'),
      })
    },
  },
  pwa: {
    manifest: {
      name: 'Springboard',
      short_name: 'Springboard',
      description: 'jumpstart the world',
      lang: 'en',
      background_color: '#008de4',
      theme_color: '#787878',
      display: 'standalone',
      orientation: 'portrait-primary',
    },
  },

  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + 'Springboard',
    title: 'Springboard',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1,minimal-ui',
      },
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes',
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Montserrat&family=Open+Sans&family=Roboto&display=swap',
      },
    ],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/timeago.js' },
    '~/plugins/directives.js',
    { src: '~/plugins/utils.js' },
    { src: '~/plugins/persistedState.client.js' },
  ],

  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
    '@nuxtjs/dotenv',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    optionsPath: './vuetify.options.js',
    treeShake: true,
    //     theme: {
    // $primary- color - dark: #7B1FA2,
    // $primary-color:        #9C27B0,
    // $primary-color-light:  #E1BEE7,
    // $primary-color-text:   #FFFFFF,
    // $accent-color:         #00BCD4,
    // $primary-text-color:   #212121,
    // $secondary-text-color: #757575,
    // $divider-color:        #BDBDBD},
    //   }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
      }
      // if (ctx.isDev && ctx.isClient) {
      //   config.module.rules.push({
      //     enforce: 'pre',
      //     test: /\.(js|vue)$/,
      //     loader: 'eslint-loader',
      //     exclude: /(node_modules)/,
      //     options: { fix: true }
      //   })
      // }
      // config.module.rules.push({
      //   test: /\.(ogg|mp3|wav|mpe?g)$/i,
      //   loader: 'file-loader',
      //   options: {
      //     name: '[path][name].[ext]',
      //   },
      // })
      config.node = {
        fs: 'empty',
      }
    },
  },
}
