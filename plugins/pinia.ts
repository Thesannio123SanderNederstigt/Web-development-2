//https://nuxt.com/docs/migration/configuration#vuex
import { useMainStore } from '~/store'

export default defineNuxtPlugin(({ $pinia }) => {
  return {
    provide: {
      store: useMainStore($pinia)
    }
  }
})