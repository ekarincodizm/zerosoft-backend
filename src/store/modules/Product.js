import ProductService from '@/api/ProductService'
import CategoryService from '@/api/CategoryService'
import ModifierService from '@/api/ModifierService'

// initial state
const state = {
  products: [],
  product: null,
  tableopts: {},
  categories: [],
  category: null,
  modifiers: [],
  modifier: null,
}

// getters
const getters = {
  getProducts: state => state.products,
  getProduct: state => state.product,
  getTableopts: state => state.tableopts,
  getCategories: state => state.categories,
  getCategory: state => state.category,
  getModifiers: state => state.modifiers,
  getModifier: state => state.modifier
}

// mutations
const mutations = {
  setProduct (state, product) {
    state.product = product
  },
  clearProduct (state) {
    state.product = null
  },
  setProducts (state, products) {
    state.products = products
  },
  clearProducts (state) {
    state.products = []
  },
  setTableopts (state, data) {
    state.tableopts = data
  },
  setCategories (state, data) {
    state.categories = data
  },
  setCategory (state, data) {
    state.category = data
  },
  setModifiers (state, data) {
    state.modifiers = data
  },
  setModifier (state, data) {
    state.modifier = data
  }
}

// actions
const actions = {
  async insertProduct ({commit}, product) {
    var result = null
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      const response = await ProductService.insert(product)

      // stop loading
      this.dispatch('Loading', false)

      result = response.data

      if(result.success) {
        // success
        //console.log(result.data)
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
  async getProduct ({commit}, product_id) {
    var result

    // check this api is still loading or not
    if(this.state.app.loadinglist.indexOf('getProduct') >= 0) return

    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)
      // add loadinglist
      this.dispatch('addLoadinglist', 'getProduct')

      let response = await ProductService.getSingle({
        product_id: product_id
      })

      // stop loading
      this.dispatch('Loading', false)
      // remove loadinglist
      this.dispatch('removeLoadinglist', 'getProduct')

      result = response.data

      console.log(result)

      if(result.success && result.data.length > 0) {
        commit('setProduct', result.data[0])
      } else {
        this.dispatch('Error', result.status_message)
      }
    } catch (e) {
      this.dispatch('Error', e)
    }
    return result
  },
  clearProduct ({commit}) {
    commit('clearProduct')
  },
  async getProducts ({commit}) {
    var result

    // check this api is still loading or not
    if(this.state.app.loadinglist.indexOf('getProducts') >= 0) return

    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)
      // add loadinglist
      this.dispatch('addLoadinglist', 'getProducts')

      let response = await ProductService.getAll()

      // stop loading
      this.dispatch('Loading', false)
      // remove loadinglist
      this.dispatch('removeLoadinglist', 'getProducts')

      result = response.data

      if(result.success) {
        commit('setProducts', result.data)
        this.dispatch('setTableopts', result.data)
      } else {
        this.dispatch('Error', result.status_message)
      }
    } catch (e) {
      this.dispatch('Error', e)
    }
    return result
  },
  clearProducts ({commit}) {
    commit('clearProducts')
  },
  setTableopts ({commit}, products) {
    var _tableopts = {
      image: false,
      pcode: false,
      barcode: false,
      sku: false,
      brand: false,
      category: false,
      modifier: false,
      cost: false,
      stock: false,
    }
    let foundImage, // done
        foundPcode, // done
        foundBarcode, // done
        foundSku, // done
        foundBrand, // done
        foundCategory, // done
        foundModifiers,
        foundCost, // done
        foundStock // done

    for(let i in products) {
      let p = products[i]
      let prices = p.prices
      if(p.images.original && !foundImage) {
        _tableopts['image'] = true
        foundImage = true
      }
      if(p.brand_name && !foundBrand) {
        _tableopts['brand'] = true
        foundBrand = true
      }
      if(p.modifiers.length > 0 && !foundModifiers) {
        _tableopts['modifier'] = true
        foundModifiers = true
      }
      if(p.category_name && !foundCategory) {
        _tableopts['category'] = true
        foundCategory = true
      }
      for(let j in prices) {
        let price = prices[j]
        if(price.pcode && !foundPcode) {
          _tableopts['pcode'] = true
          foundPcode = true
        }
        if(price.barcode && !foundBarcode) {
          _tableopts['barcode'] = true
          foundBarcode = true
        }
        if(price.sku && !foundSku) {
          _tableopts['sku'] = true
          foundSku = true
        }
        if(price.cost && !foundCost) {
          _tableopts['cost'] = true
          foundCost = true
        }
        if(price.stocks.length > 0 && !foundStock) {
          _tableopts['stock'] = true
          foundStock = true
        }
      }
    }
    commit('setTableopts', _tableopts)
  },
  async getCategories ({commit}) {
    var result

    // check this api is still loading or not
    if(this.state.app.loadinglist.indexOf('getCategories') >= 0) return

    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)
      // add loadinglist
      this.dispatch('addLoadinglist', 'getCategories')

      let response = await CategoryService.getAll()

      // stop loading
      this.dispatch('Loading', false)
      // remove loadinglist
      this.dispatch('removeLoadinglist', 'getCategories')

      result = response.data

      if(result.success) {
        commit('setCategories', result.data)
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
  clearCategories ({commit}, data) {
    commit('setCategories', [])
  },
  async getCategory ({commit}, data) {
    var result

    // check this api is still loading or not
    if(this.state.app.loadinglist.indexOf('getCategory') >= 0) return

    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)
      // add loadinglist
      this.dispatch('addLoadinglist', 'getCategory')

      let response = await CategoryService.getSingle(data)

      // stop loading
      this.dispatch('Loading', false)
      // remove loadinglist
      this.dispatch('removeLoadinglist', 'getCategory')

      result = response.data

      if(result.success && result.data.length > 0) {
        commit('setCategory', result.data[0])
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
  clearCategory ({commit}, data) {
    commit('setCategory', null)
  },
  async insertCategory ({commit}, data) {
    var result
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      let response = await CategoryService.insert(data)

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
  async updateCategory ({commit}, data) {
    var result
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      let response = await CategoryService.update(data)

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
  async deleteCategory ({commit}, data) {
    var result
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      let response = await CategoryService.delete(data)

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
  async getModifiers ({commit}) {
    var result

    // check this api is still loading or not
    if(this.state.app.loadinglist.indexOf('getModifiers') >= 0) return

    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)
      // add loadinglist
      this.dispatch('addLoadinglist', 'getModifiers')

      let response = await ModifierService.getAll()

      // stop loading
      this.dispatch('Loading', false)
      // remove loadinglist
      this.dispatch('removeLoadinglist', 'getModifiers')

      result = response.data

      if(result.success) {
        commit('setModifiers', result.data)
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
  clearModifiers ({commit}, data) {
    commit('setModifiers', [])
  },
  async getModifier ({commit}, data) {
    var result

    // check this api is still loading or not
    if(this.state.app.loadinglist.indexOf('getModifier') >= 0) return

    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)
      // add loadinglist
      this.dispatch('addLoadinglist', 'getModifier')

      let response = await ModifierService.getSingle(data)

      // stop loading
      this.dispatch('Loading', false)
      // remove loadinglist
      this.dispatch('removeLoadinglist', 'getModifier')

      result = response.data

      if(result.success && result.data.length > 0) {
        commit('setModifier', result.data[0])
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
  clearModifier ({commit}, data) {
    commit('setModifier', null)
  },
  async insertModifier ({commit}, data) {
    var result
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      let response = await ModifierService.insert(data)

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
  async updateModifier ({commit}, data) {
    var result
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      let response = await ModifierService.update(data)

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
  async deleteModifier ({commit}, data) {
    var result
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      let response = await ModifierService.delete(data)

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
  async assignInventory ({commit}, data) {
    var result
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      let response = await ProductService.assignInventory(data)

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
