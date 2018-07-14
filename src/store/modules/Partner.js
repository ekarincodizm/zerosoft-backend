import VendorService from '@/api/VendorService'
import CustomerService from '@/api/CustomerService'
import PartnerService from '@/api/PartnerService'

// initial state
const state = {
  vendor: null,
  vendors: [],
  customer: null,
  customers: [],
  partners: []
}

// getters
const getters = {
  getVendor: state => state.vendor,
  getVendors: state => state.vendors,
  getCustomer: state => state.customer,
  getCustomers: state => state.customers,
  getPartners: state => state.partners
}

// mutations
const mutations = {
  setVendor (state, data) {
    state.vendor = data
  },
  setVendors (state, data) {
    state.vendors = data
  },
  setCustomer (state, data) {
    state.customer = data
  },
  setCustomers (state, data) {
    state.customers = data
  },
  setPartners (state, data) {
    state.partners = data
  }
}

// actions
const actions = {
  async getVendors ({commit}) {
    var result

    // check this api is still loading or not
    if(this.state.app.loadinglist.indexOf('getVendors') >= 0) return

    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)
      // add loadinglist
      this.dispatch('addLoadinglist', 'getVendors')

      let response = await VendorService.getAll()

      // stop loading
      this.dispatch('Loading', false)
      // remove loadinglist
      this.dispatch('removeLoadinglist', 'getVendors')

      result = response.data

      if(result.success) {
        commit('setVendors', result.data)
      } else {
        this.dispatch('Error', typeof result.error === 'string' ? result.error : result.status_message)
      }
    } catch (e) {
      // error
      this.dispatch('Error', e)
    }
    return result
  },
  async getVendor ({commit}, data) {
    var result

    // check this api is still loading or not
    if(this.state.app.loadinglist.indexOf('getVendor') >= 0) return

    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)
      // add loadinglist
      this.dispatch('addLoadinglist', 'getVendor')

      let response = await VendorService.getSingle(data)

      // stop loading
      this.dispatch('Loading', false)
      // remove loadinglist
      this.dispatch('removeLoadinglist', 'getVendor')

      result = response.data

      if(result.success && result.data.length > 0) {
        commit('setVendor', result.data[0])
      } else {
        this.dispatch('Error', typeof result.error === 'string' ? result.error : result.status_message)
      }
    } catch (e) {
      // error
      this.dispatch('Error', e)
    }
    return result
  },
  async getCustomers ({commit}) {
    var result

    // check this api is still loading or not
    if(this.state.app.loadinglist.indexOf('getCustomers') >= 0) return

    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)
      // add loadinglist
      this.dispatch('addLoadinglist', 'getCustomers')

      let response = await CustomerService.getAll()

      // stop loading
      this.dispatch('Loading', false)
      // remove loadinglist
      this.dispatch('removeLoadinglist', 'getCustomers')

      result = response.data

      if(result.success) {
        commit('setCustomers', result.data)
      } else {
        this.dispatch('Error', typeof result.error === 'string' ? result.error : result.status_message)
      }
    } catch (e) {
      // error
      this.dispatch('Error', e)
    }
    return result
  },
  async getCustomer ({commit}, data) {
    var result

    // check this api is still loading or not
    if(this.state.app.loadinglist.indexOf('getCustomer') >= 0) return

    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)
      // add loadinglist
      this.dispatch('addLoadinglist', 'getCustomer')

      let response = await CustomerService.getSingle(data)

      // stop loading
      this.dispatch('Loading', false)
      // remove loadinglist
      this.dispatch('removeLoadinglist', 'getCustomer')

      result = response.data

      if(result.success && result.data.length > 0) {
        commit('setCustomer', result.data[0])
      } else {
        this.dispatch('Error', typeof result.error === 'string' ? result.error : result.status_message)
      }
    } catch (e) {
      // error
      this.dispatch('Error', e)
    }
    return result
  },
  async getPartners ({commit}) {
    var result

    // check this api is still loading or not
    if(this.state.app.loadinglist.indexOf('getPartners') >= 0) return

    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)
      // add loadinglist
      this.dispatch('addLoadinglist', 'getPartners')

      let response = await PartnerService.getAll()

      // stop loading
      this.dispatch('Loading', false)
      // remove loadinglist
      this.dispatch('removeLoadinglist', 'getPartners')

      result = response.data

      if(result.success) {
        commit('setPartners', result.data)
      } else {
        this.dispatch('Error', typeof result.error === 'string' ? result.error : result.status_message)
      }
    } catch (e) {
      // error
      this.dispatch('Error', e)
    }
    return result
  },
  async insertVendor ({commit}, data) {
    var result = null
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      let response = await VendorService.insert(data)

      // stop loading
      this.dispatch('Loading', false)

      result = response.data

      if(result.success) {
        commit('setVendor', result.data)
      } else {
        this.dispatch('Error', typeof result.error === 'string' ? result.error : result.status_message)
      }
    } catch (e) {
      // error
      this.dispatch('Error', e)
    }
    return result
  },
  async insertCustomer ({commit}, data) {
    var result = null
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      let response = await CustomerService.insert(data)

      // stop loading
      this.dispatch('Loading', false)

      result = response.data

      if(result.success) {
        commit('setCustomer', result.data)
      } else {
        this.dispatch('Error', typeof result.error === 'string' ? result.error : result.status_message)
      }
    } catch (e) {
      // error
      this.dispatch('Error', e)
    }
    return result
  },
  async updateVendor ({commit}, data) {
    var result = null
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      let response = await VendorService.update(data)

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
  },
  async updateCustomer ({commit}, data) {
    var result = null
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      let response = await CustomerService.update(data)

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
  },
  async deleteVendor ({commit}, data) {
    var result = null
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      let response = await VendorService.delete(data)

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
  },
  async deleteCustomer ({commit}, data) {
    var result = null
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      let response = await CustomerService.delete(data)

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
  },
  clearVendor ({commit}) {
    commit('setVendor', null)
  },
  clearVendors ({commit}) {
    commit('setVendors', [])
  },
  clearCustomer ({commit}) {
    commit('setCustomer', null)
  },
  clearCustomers ({commit}) {
    commit('setCustomers', [])
  },
  clearPartners ({commit}) {
    commit('setPartners', [])
  },
}

export default {
  state,
  getters,
  mutations,
  actions
}
