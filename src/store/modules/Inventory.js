import WarehouseService from '@/api/WarehouseService'
import StockService from '@/api/StockService'
import GoodsReceiptService from '@/api/GoodsReceiptService'
import GoodsIssueService from '@/api/GoodsIssueService'

const LocalStorage = require('store')

// initial state
const state = {
  warehouses: [],

  stocks: [],
  refreshStocks: 0,

  activities: [],

  goodsreceipts: [],
  goodsreceipt: null,
  nextGrCode: null,

  goodsissues: [],
  goodsissue: null,
  nextGiCode: null,

  todo: [],
  currentstocks: []
}

// getters
const getters = {
  getWarehouses: state => state.warehouses,
  getStocks: state => state.stocks,
  getRefreshStocks: state => state.refreshStocks,
  getActivities: state => state.activities,
  getGoodsreceipts: state => state.goodsreceipts,
  getGoodsreceipt: state => state.goodsreceipt,
  getNextGrCode: state => state.nextGrCode,
  getGoodsissues: state => state.goodsissues,
  getGoodsissue: state => state.goodsissue,
  getNextGiCode: state => state.nextGiCode,
  getTodo: state => state.todo,
  getCurrentstocks: state => state.currentstocks
}

// mutations
const mutations = {
  setWarehouses (state, warehouses) {
    state.warehouses = warehouses
  },
  setStocks (state, stocks) {
    state.stocks = stocks
  },
  setActivities (state, activities) {
    state.activities = activities
  },
  trickRefreshStocks (state, activities) {
    state.refreshStocks++
  },
  setGoodsreceipts (state, data) {
    state.goodsreceipts = data
  },
  setGoodsreceipt (state, data) {
    state.goodsreceipt = data
  },
  setNextGrCode (state, data) {
    state.nextGrCode = data
  },
  setGoodsissues (state, data) {
    state.goodsissues = data
  },
  setGoodsissue (state, data) {
    state.goodsissue = data
  },
  setNextGiCode (state, data) {
    state.nextGiCode = data
  },
  setTodo (state, data) {
    state.todo = data
  },
  setCurrentstocks (state, data) {
    state.currentstocks = data
  }
}

// actions
const actions = {
  async getWarehouses ({commit}) {
    var result

    // check this api is still loading or not
    if(this.state.app.loadinglist.indexOf('getWarehouses') >= 0) return

    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)
      // add loadinglist
      this.dispatch('addLoadinglist', 'getWarehouses')

      let response = await WarehouseService.getAll()

      // start loading
      this.dispatch('Loading', false)
      // remove loadinglist
      this.dispatch('removeLoadinglist', 'getWarehouses')

      result = response.data

      if(result.success) {
        commit('setWarehouses', result.data)
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
  clearWarehouses ({commit}) {
    commit('setWarehouses', [])
  },
  async getStocks ({commit}, wh_id) {
    var result

    // check this api is still loading or not
    if(this.state.app.loadinglist.indexOf('setStocks') >= 0) return

    try {
      // clear stocks
      commit('setStocks', [])
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)
      // add loadinglist
      this.dispatch('addLoadinglist', 'setStocks')

      let response = await StockService.getStock({
        warehouse_id: wh_id
      })

      // stop loading
      this.dispatch('Loading', false)
      // remove loadinglist
      this.dispatch('removeLoadinglist', 'setStocks')

      result = response.data

      if(result.success) {
        commit('setStocks', result.data)
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
  clearStock ({commit}) {
    commit('setStocks', [])
  },
  async getActivities ({commit}) {
    var result

    // check this api is still loading or not
    if(this.state.app.loadinglist.indexOf('getActivities') >= 0) return

    try {
      // clear stocks
      commit('setStocks', [])
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)
      // add loadinglist
      this.dispatch('addLoadinglist', 'getActivities')

      let response = await StockService.getActivities()

      // stop loading
      this.dispatch('Loading', false)
      // remove loadinglist
      this.dispatch('removeLoadinglist', 'getActivities')

      result = response.data

      if(result.success) {
        commit('setActivities', result.data)
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
  clearActivities ({commit}) {
    commit('setActivities', [])
  },
  async getTodo ({commit}) {
    var result = null

    // check this api is still loading or not
    if(this.state.app.loadinglist.indexOf('getTodo') >= 0) return

    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)
      // add loadinglist
      this.dispatch('addLoadinglist', 'getTodo')

      let response = await StockService.getTodo()

      // stop loading
      this.dispatch('Loading', false)
      // remove loadinglist
      this.dispatch('removeLoadinglist', 'getTodo')

      result = response.data

      if(result.success) {
        commit('setTodo', result.data)
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
  clearTodo ({commit}) {
    commit('setTodo', [])
  },
  async getCurrentstocks({commit}) {
    var result = null

    // check this api is still loading or not
    if(this.state.app.loadinglist.indexOf('getCurrentstocks') >= 0) return

    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)
      // add loadinglist
      this.dispatch('addLoadinglist', 'getCurrentstocks')

      let response = await StockService.getCurrentstocks()

      // stop loading
      this.dispatch('Loading', false)
      // remove loadinglist
      this.dispatch('removeLoadinglist', 'getCurrentstocks')

      result = response.data

      if(result.success) {
        commit('setCurrentstocks', result.data)
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
  clearCurrentstocks({commit}) {
    commit('setCurrentstocks', [])
  },
  async updateStock ({commit}, data) {
    var result = null
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      for(let i in data) {
        let response = await StockService.updateStock(data[i])
        result = response.data
      }

      // stop loading
      this.dispatch('Loading', false)

      // refreshStocks
      this.dispatch('trickRefreshStocks')

    } catch (e) {
      // error
      this.dispatch('Error', e)
    }
    return result
  },
  async updateStockWarning ({commit}, data) {
    var result = null
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      let response = await StockService.updateStockWarning(data)

      result = response.data

      // stop loading
      this.dispatch('Loading', false)

      // refreshStocks
      this.dispatch('trickRefreshStocks')

    } catch (e) {
      // error
      this.dispatch('Error', e)
    }
    return result
  },
  trickRefreshStocks ({commit}) {
    commit('trickRefreshStocks')
  },
  async insertGoodsreceipt({commit}, data) {
    var result = null
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      let response = await GoodsReceiptService.insert(data)

      // stop loading
      this.dispatch('Loading', false)

      result = response.data

      if(result.success) {

      } else {
        // clear error
        this.dispatch('Error', typeof result.error === 'string' ? result.error : result.status_message)
      }
    } catch (e) {
      // clear error
      this.dispatch('Error', e)
    }
    return result
  },
  async getGoodsreceipts({commit}) {
    var result = null

    // check this api is still loading or not
    if(this.state.app.loadinglist.indexOf('getGoodsreceipts') >= 0) return

    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)
      // add loadinglist
      this.dispatch('addLoadinglist', 'getGoodsreceipts')

      let response = await GoodsReceiptService.getAll()

      // stop loading
      this.dispatch('Loading', false)
      // remove loadinglist
      this.dispatch('removeLoadinglist', 'getGoodsreceipts')

      result = response.data

      if(result.success) {
        commit('setGoodsreceipts', result.data)
      } else {
        // clear error
        this.dispatch('Error', typeof result.error === 'string' ? result.error : result.status_message)
      }
    } catch (e) {
      // clear error
      this.dispatch('Error', e)
    }
    return result
  },
  clearGoodsreceipts ({commit}) {
    commit('setGoodsreceipts', [])
  },
  async getGoodsreceipt({commit}, data) {
    var result = null

    // check this api is still loading or not
    if(this.state.app.loadinglist.indexOf('getGoodsreceipt') >= 0) return

    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)
      // add loadinglist
      this.dispatch('addLoadinglist', 'getGoodsreceipt')

      let response = await GoodsReceiptService.getSingle({
          gr_id: data.gr_id
      })

      // stop loading
      this.dispatch('Loading', false)
      // remove loadinglist
      this.dispatch('removeLoadinglist', 'getGoodsreceipt')

      result = response.data

      if(result.success) {
        if(result.data.length > 0) {
          commit('setGoodsreceipt', result.data[0])
        } else {
          // not found data
          this.dispatch('Error', 'Not found data')
        }
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
  clearGoodsreceipt ({commit}) {
    commit('setGoodsreceipt', null)
  },
  async updateGoodsreceipt ({commit}, data) {
    var result = null
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      let response = await GoodsReceiptService.update(data)

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
  },
  async doneGoodsreceipt ({commit}, data) {
    var result = null
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      let response = await GoodsReceiptService.done(data)

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
  },
  async deleteGoodsreceipt ({commit}, data) {
    var result = null
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      let response = await GoodsReceiptService.delete(data)

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
  },
  async getNextGrCode ({commit}, data) {
    var result = null

    // check this api is still loading or not
    if(this.state.app.loadinglist.indexOf('getNextGrCode') >= 0) return

    try {
      // clear error
      this.dispatch('Error', null)
      // add loadinglist
      this.dispatch('addLoadinglist', 'getNextGrCode')

      let response = await GoodsReceiptService.getLatestCode(data)

      // remove loadinglist
      this.dispatch('removeLoadinglist', 'getNextGrCode')

      result = response.data

      if(result.success) {
        commit('setNextGrCode', result.data.next)
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
  async insertGoodsissue({commit}, data) {
    var result = null
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      let response = await GoodsIssueService.insert(data)

      // stop loading
      this.dispatch('Loading', false)

      result = response.data

      if(result.success) {

      } else {
        // clear error
        this.dispatch('Error', typeof result.error === 'string' ? result.error : result.status_message)
      }
    } catch (e) {
      // clear error
      this.dispatch('Error', e)
    }
    return result
  },
  async getGoodsissues({commit}) {
    var result = null

    // check this api is still loading or not
    if(this.state.app.loadinglist.indexOf('getGoodsissues') >= 0) return

    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)
      // add loadinglist
      this.dispatch('addLoadinglist', 'getGoodsissues')

      let response = await GoodsIssueService.getAll()

      // stop loading
      this.dispatch('Loading', false)
      // remove loadinglist
      this.dispatch('removeLoadinglist', 'getGoodsissues')

      result = response.data

      if(result.success) {
        commit('setGoodsissues', result.data)
      } else {
        // clear error
        this.dispatch('Error', typeof result.error === 'string' ? result.error : result.status_message)
      }
    } catch (e) {
      // clear error
      this.dispatch('Error', e)
    }
    return result
  },
  clearGoodsissues ({commit}) {
    commit('setGoodsissues', [])
  },
  async getGoodsissue({commit}, data) {
    var result

    // check this api is still loading or not
    if(this.state.app.loadinglist.indexOf('getGoodsissue') >= 0) return

    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)
      // add loadinglist
      this.dispatch('addLoadinglist', 'getGoodsissue')

      let response = await GoodsIssueService.getSingle({
          gi_id: data.gi_id
      })

      // stop loading
      this.dispatch('Loading', false)
      // remove loadinglist
      this.dispatch('removeLoadinglist', 'getGoodsissue')

      result = response.data

      if(result.success) {
        if(result.data.length > 0) {
          commit('setGoodsissue', result.data[0])
        } else {
          // not found data
          this.dispatch('Error', 'Not found data')
        }
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
  clearGoodsissue ({commit}) {
    commit('setGoodsissue', null)
  },
  async updateGoodsissue ({commit}, data) {
    var result = null
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      let response = await GoodsIssueService.update(data)

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
  },
  async doneGoodsissue ({commit}, data) {
    var result = null
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      let response = await GoodsIssueService.done(data)

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
  },
  async deleteGoodsissue ({commit}, data) {
    var result = null
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      let response = await GoodsIssueService.delete(data)

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
  },
  async getNextGiCode ({commit}, data) {
    var result

    // check this api is still loading or not
    if(this.state.app.loadinglist.indexOf('getNextGiCode') >= 0) return

    try {
      // clear error
      this.dispatch('Error', null)
      // add loadinglist
      this.dispatch('addLoadinglist', 'getNextGiCode')

      let response = await GoodsIssueService.getLatestCode(data)

      // remove loadinglist
      this.dispatch('removeLoadinglist', 'getNextGiCode')

      result = response.data

      if(result.success) {
        commit('setNextGiCode', result.data.next)
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
  async insertWarehouse ({commit}, data) {
    var result = null
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      let response = await WarehouseService.insert(data)

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
  },
  async updateWarehouse ({commit}, data) {
    var result = null
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      let response = await WarehouseService.update(data)

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
  },
  async deleteWarehouse ({commit}, data) {
    var result = null
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      let response = await WarehouseService.delete(data)

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
