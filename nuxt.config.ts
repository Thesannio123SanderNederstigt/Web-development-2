import { defineNuxtConfig } from 'nuxt/config';
import svgLoader from "vite-svg-loader";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  app: { 
    // Global page headers
    head: {
      title: 'schaatsbingo.nl',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'author', content: 'Sander Nederstigt' },
        { hid: 'description', name: 'description', content: 'Bingokaarten zelf maken of genereren en invullen rondom schaatsen, sportclubs en andere (winter)sportactiviteiten binnen jouw sportieve leven' },
        { hid: 'keywords', name: 'keywords', content: 'bingo, bingokaarten, gebeurtenissen, Haarlem, Haarlem-Noord, Hogeschool, ijsverenigingen, Inholland Hogeschool, kaarten, Nederland, persoonlijke ervaringen, schaatsen, sport, sportclubs, winter, wintersport, woorden' },
        //{ name: 'format-detection', content: '' },
      ],
      link: [
        { 
          rel: 'icon', 
          href: '../assets/schaatsbingo-logo.svg?raw', //'../static/favicon.ico' //'../assets/schaatsbingo-logo.svg' //@/~ //?component/?url/?raw
          sizes: 'any',
          type: 'image/svg+xml' //'image/x-icon', //'image/svg'

        },
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
          integrity: 'sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH',
          crossorigin: 'anonymous'
        },
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css',
        }
      ],
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js',
          integrity: 'sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r',
          crossorigin: 'anonymous'
        },
        {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js',
          integrity: 'sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy',
          crossorigin: 'anonymous'
        },
        {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
          integrity: 'sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz',
          crossorigin: 'anonymous'
        }
      ],
    },
  },
  /*routeRules: {
    '/web/v1/**': {
        proxy: { to: "http://localhost:80/web/v1/**", },
    }
  },*/

  /*routeRules: {
    '/': { prerender: true },
    '/*': { cors: true }
  },*/
/*
  axios: {
    baseURL: 'http://localhost:80/api',
    proxyHeaders: false,
    credentials: 'same-origin',
    crossorigin: "http://localhost:80/api",
    headers: { 'Access-Control-Allow-Origin': 'true',
               'Content-Type': 'application/json',
               'credentials': 'same-origin' }
  },

  publicRuntimeConfig: {
    axios: {
      browserBaseURL: 'http://localhost:80/api'
    }
  },

  privateRuntimeConfig: {
    axios: {
      baseURL: "http://localhost:80/api"
    }
  },*/
  /*vite: {
    buildModules: ["@nuxtjs/svg"],
    plugins: [svgLoader({
      defaultImport: 'raw',
    })]
  },*/

  vite: {
    buildModules: ["@nuxtjs/svg"],
    plugins: [svgLoader({defaultImport: 'url'})],
  },
    // Plugins to run before rendering page
    plugins: [
      '~/plugins/pinia',
      //'~/plugins/axios'
    ],

    css: [
      '~/assets/style.scss',
    ],
  
    // Auto import components
    components: true,
  
    // Modules
    modules: [
      '@pinia/nuxt',
    ],

    //buildModules: ["@nuxtjs/svg"],

    /*modules: [
      //'@pinia/nuxt',
      ['@pinia/nuxt', { autoImports: ['defineStore'] }]
    ],
    alias: {
      pinia: process.env.NODE_ENV === 'production' ? '/node_modules/pinia/dist/pinia.mjs' : '/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs',
    },*/
  
    // Build Configuration
    build: {
    },
})

/*
export default {

  devtools: { enabled: true },

  // Disable server-side rendering
  ssr: false,

  // Target
  target: 'server',

  axios: {
    baseURL: 'http://localhost:80/api',
    proxyHeaders: false,
    credentials: 'same-origin',
    crossorigin: "http://localhost:80/api",
    headers: { 'Access-Control-Allow-Origin': 'true',
               'Content-Type': 'application/json',
               'credentials': 'same-origin' }
  },

  publicRuntimeConfig: {
    axios: {
      browserBaseURL: 'http://localhost:80/api'
    }
  },

  privateRuntimeConfig: {
    axios: {
      baseURL: "http://localhost:80/api"
    }
  },

  // Global page headers
  head: {
    title: 'schaatsbingo-nl',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'author', content: 'Sander Nederstigt' },
      { hid: 'description', name: 'description', content: 'Bingokaarten zelf maken of genereren en invullen rondom schaatsen, sportclubs en andere (winter)sportactiviteiten binnen jouw sportieve leven' },
      { hid: 'keywords', name: 'keywords', content: 'bingo, bingokaarten, gebeurtenissen, Haarlem, Haarlem-Noord, Hogeschool, ijsverenigingen, Inholland Hogeschool, kaarten, Nederland, persoonlijke ervaringen, schaatsen, sport, sportclubs, winter, wintersport, woorden' },
      //{ name: 'format-detection', content: '' },
    ],
    link: [
      { rel: 'icon', type: 'image/svg', sizes: 'any', href: './assets/schaatsbingo-logo.svg' },
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
        integrity: 'sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH',
        crossorigin: 'anonymous'
      },
      {
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css',
      },
      {
        href: 'https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js',
        integrity: 'sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r',
        crossorigin: 'anonymous'
      },
      {
        href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js',
        integrity: 'sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy',
        crossorigin: 'anonymous'
      },
      {
        href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
        integrity: 'sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz',
        crossorigin: 'anonymous'
      }
    ]
  },

  scss: [
    'static/style.scss',
  ],

  // Plugins to run before rendering page
  plugins: [
    '~/plugins/pinia',
  ],

  // Auto import components
  components: true,

  // Modules for dev and build
  buildModules: [
    '@nuxt/typescript-build',
  ],

  // Modules
  modules: [
    '@pinia/nuxt',
  ],

  // Build Configuration
  build: {
  }
}
  */