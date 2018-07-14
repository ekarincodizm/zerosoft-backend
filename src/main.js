// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// vue
import Vue from 'vue'
// vue i18n
import VueI18n from 'vue-i18n'
// app
import App from './App'
// router
import router from './router'
// store
import store from './store'
// languages
import messages from './lang'
// middleware
import middleware from './middleware'
// Global Mixin
import mixin from './mixin'

/**
 ** Vue use
 **/
Vue.use(VueI18n)

// vue config
Vue.config.productionTip = false

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: store.state.app.lang, // set locale
  messages // set locale messages
})

/**
 ** Vue middleware
 **/
router.beforeEach(middleware)

/**
 ** Vue mixin is global can use for all page
 **/
Vue.mixin(mixin)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
