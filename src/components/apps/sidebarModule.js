import store from './../../store'

function setup (sidebar) {
  store.dispatch('setSidebar', sidebar)
}
function active (opts) {
  store.dispatch('activeSidebar', opts)
}
function update (sidebar, sidebarAtIdx, submenus, opts) {
  let temp = JSON.stringify(sidebar)
  var newSidebar = JSON.parse(temp)
  for(let i in submenus) {
    newSidebar[sidebarAtIdx].submenus.push(submenus[i])
  }
  store.dispatch('setSidebar', newSidebar)
  if(opts) active(opts)
}
function init (sidebar, opts) {
  setup(sidebar)
  if(opts) active(opts)
}

export default {
  setup,
  active,
  update,
  init
}
