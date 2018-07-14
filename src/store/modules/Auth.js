// auth api
import AuthService from '@/api/AuthService'
// shop api
import ShopService from '@/api/ShopService'
// router
import router from './../../router'
// local storeage
const LocalStorage = require('store')

// initial state
const state = {
  auth: {}
}

function setAuth (opts) {
  var auth = LocalStorage.get('auth') || {}
  if(opts.access_token) auth['access_token'] = opts.access_token
  if(opts.user_info) auth['user_info'] = opts.user_info
  if(opts.shop_info) auth['shop_info'] = opts.shop_info
  return LocalStorage.set('auth', auth)
}

function getAuth () {
  return LocalStorage.get('auth')
}

function removeAuth (opts) {
  var auth = LocalStorage.get('auth')
  if(opts.access_token) delete auth.access_token
  if(opts.user_info) delete auth.user_info
  if(opts.shop_info) delete auth.shop_info
  return LocalStorage.set('auth', auth)
}

// getters
const getters = {
  getAuth: state => state.auth,
  getShopInfo: state => state.auth.shop_info,
  getCurrency: state => {
    if(state.auth.shop_info) {
      return state.auth.shop_info.settings.general.appearance.currency
    }
    return null
  },
  getDateFormat: state => {
    if(state.auth.shop_info) {
      return state.auth.shop_info.settings.general.appearance.format_date
    }
    return null
  }
}

// mutations
const mutations = {
  Login (state, data) {
    // store user token in the browser
    setAuth({
      access_token: data.access_token,
      user_info: data.user_info
    })

    state.auth = getAuth()
  },
  LoginShop (state, data) {
    // store user token in the browser
    setAuth({
      access_token: data.access_token,
      shop_info: data.shop_info,
      warehouses: data.warehouses
    })

    state.auth = getAuth()
  },
  Logout (state) {
    // remove user token in browser
    removeAuth({
      access_token: true,
      user_info: true,
      shop_info: true
    })

    // set auth
    state.auth = getAuth()
  },
  LogoutShop (state) {
    // state.isLoginShop = false
    removeAuth({
      shop_info: true
    })

    // set auth
    state.auth = getAuth()
  },
  LoggedIn (state) {
    state.auth = getAuth()
  },
  LoggedInShop (state) {
    state.auth = getAuth()
  },
  setLocalStorageShopInfo (state, shop_info) {
    // store user token in the browser
    setAuth({
      shop_info: shop_info
    })
    state.auth = getAuth()
  },
  setLocalStorageUserInfo (state, user_info) {
    // store user token in the browser
    setAuth({
      user_info: user_info
    })
    state.auth = getAuth()
  }
}

// actions
const actions = {
  async Login ({commit}, data) {
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      // call api
      const response = await AuthService.login(data)

      // stop loading
      this.dispatch('Loading', false)

      let result = response.data

      // success
      if(result.success) {
        // user is owner
        if(result.data.user_info.type == 'owner') {
          // set access_token
          commit('Login', {
            access_token: result.data.access_token,
            user_info: result.data.user_info
          })
          // go to choose store
          router.push({ name: "ChooseShop"})
        }
        else { // user is employee
          // set access_token
          commit('Login', {
            access_token: result.data.access_token,
            user_info: result.data.user_info
          })
          this.dispatch('LoginShop', {
            shop_id: result.data.shop_id
          })
          // go to homepage
          router.push({ name: "Home"})
        }
      } else {
        // fail
        this.dispatch('Error', result.status_message)
      }
    } catch (e) {
      console.log(e)
      // error
      this.dispatch('Error', 'เกิดข้อผิดพลาด')
      // stop loading
      this.dispatch('Loading', false)
    }
  },
  async LoginShop ({commit}, data) {
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      const response = await AuthService.loginShop({
        shop_id: data.shop_id
      })

      // stop loading
      this.dispatch('Loading', false)

      let result = response.data

      if(result.success) {
        // set access_token
        commit('LoginShop', {
          access_token: result.data.access_token,
          shop_info: result.data.shop_info
        })

        // set ui option
        this.dispatch('updateUIOptions', LocalStorage.get('uiOptions'))

        // go to homepage
        router.push({ name: "Home"})
      } else {
        // fail
        this.dispatch('Error', result.status_message)
      }
    } catch (e) {
      console.log(e)
      // error
      this.dispatch('Error', e)
      // stop loading
      this.dispatch('Loading', false)
    }
  },
  Logout ({commit}) {
    this.dispatch('setLastRouter', null)
    this.dispatch('clearWarehouses')
    commit('Logout')
  },
  LogoutShop ({commit}) {
    this.dispatch('setLastRouter', null)
    this.dispatch('clearWarehouses')
    commit('LogoutShop')
  },
  LoggedIn ({commit}) {
    // get user info
    commit('LoggedIn')
  },
  async LoggedInShop ({commit}, data) {
    commit('LoggedInShop')

    // set ui options
    this.dispatch('updateUIOptions', LocalStorage.get('uiOptions'))

    // update shop info
    await this.dispatch('setLocalStorageShopInfo')

    // update user info
    await this.dispatch('setLocalStorageUserInfo')
  },
  async Register ({commit}, data) {
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      let response = await AuthService.register({
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
        shop_name: data.shop_name,
        business_id: data.business_id
      })

      // stop loading
      this.dispatch('Loading', false)

      let result = response.data

      if(result.success) {
        // success
        console.log(result.data)
      } else {
        // fail
        if(typeof result.error === 'string') {
          this.dispatch('Error', result.error)
        } else {
          this.dispatch('Error', result.status_message)
        }
      }
    } catch (e) {
      console.log(e)
      // error
      this.dispatch('Error', e)
      // stop loading
      this.dispatch('Loading', false)
    }
  },
  getUserInfo ({commit}) {

  },
  async setLocalStorageShopInfo ({commit}) {
    try {
      const response = await ShopService.getSelf()

      let result = response.data

      if(result.success && result.data !== null) {
        commit('setLocalStorageShopInfo', result.data)
      } else {
        // error
        this.dispatch('Error', typeof result.error === 'string' ? result.error : result.status_message)
      }
    } catch (e) {
      // error
      this.dispatch('Error', e)
    }
  },
  async setLocalStorageUserInfo ({commit}) {
    try {
      const response = await AuthService.getMe()

      let result = response.data

      if(result.success && result.data !== null) {
        commit('setLocalStorageUserInfo', result.data)
      } else {
        // error
        this.dispatch('Error', typeof result.error === 'string' ? result.error : result.status_message)
      }
    } catch (e) {
      // error
      this.dispatch('Error', e)
    }
  },
  async checkCandidate ({commit}, data) {
    var result = null
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      let response = await AuthService.checkCandidate(data)

      // stop loading
      this.dispatch('Loading', false)

      result = response.data

      if(result.success) {

      } else {
        this.dispatch('Error', typeof result.error === 'string' ? result.error : result.status_message)
      }
    } catch (e) {
      // error
      this.dispatch('Error', e)
    }
    return result
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
