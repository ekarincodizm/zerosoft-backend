import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/App'
import auth from './modules/Auth'
import shop from './modules/Shop'
import product from './modules/Product'
import inventory from './modules/Inventory'
import partner from './modules/Partner'
import employee from './modules/Employee'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    auth,
    shop,
    product,
    inventory,
    partner,
    employee
  },
  strict: true
})
