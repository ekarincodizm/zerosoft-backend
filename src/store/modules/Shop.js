import ShopService from '@/api/ShopService'

// initial state
const state = {
  shops: []
}

// getters
const getters = {
  getShops: state => state.shops
}

// mutations
const mutations = {
  setShops (state, shops) {
    state.shops = shops
  },
  deleteShops (state) {
    state.shops = []
  }
}

// actions
const actions = {
  async getShops ({commit})
  {
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      let response = await ShopService.getAll()

      // stop loading
      this.dispatch('Loading', false)

      let result = response.data

      if(result.success) {
        commit('setShops', result.data)
      } else {
        console.log(result.status_message)
      }
    } catch (e) {
      console.log(e)
    }
  },
  clearShops ({commit}) {
    return commit('deleteShops')
  },
  async installApp ({commit}, data) {
    try {
      let response = await ShopService.installApp(data)
      let result = response.data
      if(result.success) {
        // update shop info
        this.dispatch('setLocalStorageShopInfo')
      } else {

      }
    } catch (e) {
      console.log(e)
    }
  },
  async uninstallApp ({commit}, data) {
    try {
      let response = await ShopService.uninstallApp(data)
      let result = response.data
      if(result.success) {
        // update shop info
        this.dispatch('setLocalStorageShopInfo')
      } else {

      }
    } catch (e) {
      console.log(e)
    }
  },
  async updateShop ({commit}, data)
  {
    var result
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      let response = await ShopService.update(data)

      // stop loading
      this.dispatch('Loading', false)

      result = response.data

      // update shop info
      await this.dispatch('setLocalStorageShopInfo')

      if(result.success) {

      } else {
        // error
        this.dispatch('Error', typeof result.error === 'string' ? result.error : result.status_message)
      }
    } catch (e) {
      // error
      this.dispatch('Error', e)
    }
    return result
  },
  async updateSettings ({commit}, data)
  {
    var result
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      let response = await ShopService.updateSettings(data)

      // update shop info
      await this.dispatch('setLocalStorageShopInfo')

      // stop loading
      this.dispatch('Loading', false)

      result = response.data

      if(result.success) {

      } else {
        // error
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
