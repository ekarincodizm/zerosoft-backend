const LocalStorage = require('store')

// initial state
const state = {
  loading: false,
  loadinglist: [],
  error_message: null,
  section: 'login', // login, home, app
  lang: 'th',
  sidebar: [],
  header_title: null,
  last_router: null,
  uiOptions: { // default
    "sidebar": "expanded",
    "timeformat": "MM/DD/YYYY"
  }
}

// getters
const getters = {
  getSidebar: state => state.sidebar,
  getLoading: state => state.loading,
  getError: state => state.error_message,
  getUIOptions: state => state.uiOptions
}

// mutations
const mutations = {
  setLoading (state, status) {
    state.loading = status
  },
  addLoadinglist (state, name) {
    state.loadinglist.push(name)
  },
  removeLoadinglist (state, name) {
    for(let i in state.loadinglist) {
      let _name = state.loadinglist[i]
      if(name == _name) {
        state.loadinglist.splice(i, 1)
      }
    }
  },
  setError (state, message) {
    state.error_message = message
  },
  setSection (state, section) {
    state.section = section
    state.error_message = null
  },
  setLang (state, lang) {
    state.lang = lang
    localStorage.setItem('lang', lang)
  },
  setSidebar (state, lists) {
    state.sidebar = lists
  },
  activeSidebar (state, opts) {
    if(opts.submenuAtIdx === undefined) {
      state.sidebar[opts.sidebarAtIdx].activeClass = 'active'
    } else {
      for(let i in state.sidebar[opts.sidebarAtIdx].submenus) {
        state.sidebar[opts.sidebarAtIdx].submenus[i].activeClass = ''
      }
      state.sidebar[opts.sidebarAtIdx].activeClass = 'opened'
      state.sidebar[opts.sidebarAtIdx].submenus[opts.submenuAtIdx].activeClass = 'active'
    }
  },
  setHeader (state, title) {
    state.header_title = title
  },
  setLastRouter (state, router) {
    state.last_router = router
  },
  updateUIOptions (state, opts) {
    if(!opts) opts = {}
    var newOptions = {}
    let uiOptions = LocalStorage.get('uiOptions') || {}
    // if found new option
    if(opts.sidebar) {
      newOptions['sidebar'] = opts.sidebar
    } else {
      // if found old option
      if(uiOptions.sidebar) {
        newOptions['sidebar'] = uiOptions.sidebar
      } else {
        // if not found set to default
        newOptions['sidebar'] = state.uiOptions.sidebar
      }
    }
    if(opts.timeformat) {
      newOptions['timeformat'] = opts.timeformat
    } else {
      if(uiOptions.timeformat) {
        newOptions['timeformat'] = uiOptions.timeformat
      } else {
        newOptions['timeformat'] = state.uiOptions.timeformat
      }
    }
    LocalStorage.set('uiOptions', newOptions)

    state.uiOptions = newOptions
  }
}

// actions
const actions = {
  Loading: ({commit}, status) => commit('setLoading', status),
  addLoadinglist: ({commit}, name) => commit('addLoadinglist', name),
  removeLoadinglist: ({commit}, name) => commit('removeLoadinglist', name),
  Error: ({commit}, message) => commit('setError', message),
  setSection ({commit}, section) {
    document.querySelector('body').setAttribute("section", section)
    commit('setSection', section)
  },
  switchLang ({commit}, lang) {
    document.querySelector('html').setAttribute("lang", lang)
    commit('setLang', lang)
  },
  setSidebar ({commit}, lists) {
    commit('setSidebar', lists)
  },
  activeSidebar ({commit}, opts) {
    commit('activeSidebar', opts)
  },
  clearSidebar ({commit}) {
    commit('setSidebar', [])
  },
  setHeader ({commit}, title) {
    commit('setHeader', title)
  },
  setLastRouter ({commit}, router) {
    commit('setLastRouter', router)
  },
  updateUIOptions ({commit}, options) {
    commit('updateUIOptions', options)
  },
  /**
   ** @param module (String) can be null we use cus let dev know where api call to module
   ** @param action (String) required action name in module
   */
  api ({commit}, opts) {
    if(!opts.action.data) {
      return this.dispatch(opts.action.name)
    }
    return this.dispatch(opts.action.name, opts.action.data)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
