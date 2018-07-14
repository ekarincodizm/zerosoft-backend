import EmployeeService from '@/api/EmployeeService'

// initial state
const state = {
  employee: null,
  employees: []
}

// getters
const getters = {
  getEmployee: state => state.employee,
  getEmployees: state => state.employees
}

// mutations
const mutations = {
  setEmployee (state, data) {
    state.employee = data
  },
  setEmployees (state, data) {
    state.employees = data
  }
}

// actions
const actions = {
  async insertEmployee ({commit}, data) {
    var result = null
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      let response = await EmployeeService.insert(data)

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
  async getEmployee ({commit}, data) {
    var result = null

    // check this api is still loading or not
    if(this.state.app.loadinglist.indexOf('getEmployee') >= 0) return

    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)
      // add loadinglist
      this.dispatch('addLoadinglist', 'getEmployee')

      let response = await EmployeeService.getSingle(data)

      // stop loading
      this.dispatch('Loading', false)
      // remove loadinglist
      this.dispatch('removeLoadinglist', 'getEmployee')

      result = response.data

      if(result.success && result.data.length > 0) {
        commit('setEmployee', result.data[0])
      } else {
        this.dispatch('Error', typeof result.error === 'string' ? result.error : result.status_message)
      }
    } catch (e) {
      // error
      this.dispatch('Error', e)
    }
    return result
  },
  async getEmployees ({commit}) {
    var result = null

    // check this api is still loading or not
    if(this.state.app.loadinglist.indexOf('getEmployees') >= 0) return

    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)
      // add loadinglist
      this.dispatch('addLoadinglist', 'getEmployees')

      let response = await EmployeeService.getAll()

      // stop loading
      this.dispatch('Loading', false)
      // remove loadinglist
      this.dispatch('removeLoadinglist', 'getEmployees')

      result = response.data

      if(result.success) {
        commit('setEmployees', result.data)
      } else {
        this.dispatch('Error', typeof result.error === 'string' ? result.error : result.status_message)
      }
    } catch (e) {
      // error
      this.dispatch('Error', e)
    }
    return result
  },
  async updateEmployee ({commit}, data) {
    var result = null
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      let response = await EmployeeService.update(data)

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
  async deleteEmployee ({commit}, data) {
    var result = null
    try {
      // start loading
      this.dispatch('Loading', true)
      // clear error
      this.dispatch('Error', null)

      let response = await EmployeeService.delete(data)

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
  clearEmployee ({commit}) {
    commit('setEmployee', null)
  },
  clearEmployees ({commit}) {
    commit('setEmployees', [])
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
