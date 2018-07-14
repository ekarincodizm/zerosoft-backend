// store
import store from './store'

function isAllowPermission (opt) {
  let auth = getAuth()
  let permissions = auth.user_info.permissions
  for(let i in permissions) {
    if(permissions[i].app_id == opt.app_id) {
      return true
    }
  }
  return false
}

function getAuth () {
  return store.state.auth.auth
}

export default (to, from, next) => {

  let auth = getAuth()

  if(to.meta.requireLogin)
  {
    if(!auth.user_info) return next({path: '/signin'})
  }

  if(to.meta.requireLoginShop)
  {
    if(!auth.shop_info) return next({path: '/company'})
  }

  if(to.meta.requireOwner) {
    if(auth.user_info.type != 'owner') return next({path: '/dashboard'})
  }

  if(to.meta.requirePermissions)
  {
    let permissions = auth.user_info.permissions

    for(let i in to.meta.requirePermissions)
    {
      let name = to.meta.requirePermissions[i]

      switch (name) {
        case 'point_of_sales':
          if(!isAllowPermission({app_id: 1})) return next({path: '/dashboard'})
          break;
        case 'product':
          if(!isAllowPermission({app_id: 2})) return next({path: '/dashboard'})
          break;
        case 'inventory':
          if(!isAllowPermission({app_id: 3})) return next({path: '/dashboard'})
          break;
        case 'purchase':
          if(!isAllowPermission({app_id: 4})) return next({path: '/dashboard'})
          break;
        case 'sale':
          if(!isAllowPermission({app_id: 5})) return next({path: '/dashboard'})
          break;
        case 'expense':
          if(!isAllowPermission({app_id: 6})) return next({path: '/dashboard'})
          break;
        case 'customer':
          if(!isAllowPermission({app_id: 7})) return next({path: '/dashboard'})
          break;
        case 'report':
          if(!isAllowPermission({app_id: 8})) return next({path: '/dashboard'})
          break;
        case 'business_intelligence':
          if(!isAllowPermission({app_id: 9})) return next({path: '/dashboard'})
          break;
        case 'ecommerce':
          if(!isAllowPermission({app_id: 10})) return next({path: '/dashboard'})
          break;
        case 'contact':
          if(!isAllowPermission({app_id: 11})) return next({path: '/dashboard'})
          break;v
      }
    }
  }

  next()
}
