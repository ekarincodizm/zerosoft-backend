// vue
import Vue from 'vue'
// vuex
import Vuex from 'vuex'
// vuesex
import Vuesax from 'vuesax'
// vuerout
import Router from 'vue-router'
// store
import store from '@/store'
// vuesex
import 'vuesax/dist/vuesax.css'
// uuid
import UUID from 'vue-uuid'
// date picker
import VCalendar from 'v-calendar'
// date picker css
import 'v-calendar/lib/v-calendar.min.css'

// local storage
const LocalStorage = require('store')

/**
 ** import components
 **/
// account folder
import SignIn from '@/components/account/SignIn'
import SignUp from '@/components/account/SignUp'
import ChooseShop from '@/components/account/ChooseShop'
import CreateShop from '@/components/account/CreateShop'

// home folder
import Home from '@/components/home/Home'

// items folder
import ProductAll from '@/components/apps/items/product/All'
import ProductNew from '@/components/apps/items/product/New'
import ProductEdit from '@/components/apps/items/product/Edit'
import CategoryAll from '@/components/apps/items/category/All'
import CategoryNew from '@/components/apps/items/category/New'
import CategoryEdit from '@/components/apps/items/category/Edit'
import ModifierAll from '@/components/apps/items/modifier/All'
import ModifierNew from '@/components/apps/items/modifier/New'
import ModifierEdit from '@/components/apps/items/modifier/Edit'

// purchase folder
import PurchaseAll from '@/components/apps/purchases/All'

// inventory folder
import InventoryTodo from '@/components/apps/inventory/overview/Todo'
import CurrentStock from '@/components/apps/inventory/overview/CurrentStock'
import StockControl from '@/components/apps/inventory/stockcontrol/List'
import StockActivity from '@/components/apps/inventory/activity/List'
import GoodsReceiptAll from '@/components/apps/inventory/goodsreceipt/All'
import GoodsReceiptNew from '@/components/apps/inventory/goodsreceipt/New'
import GoodsReceiptEdit from '@/components/apps/inventory/goodsreceipt/Edit'
import GoodsIssueAll from '@/components/apps/inventory/goodsissue/All'
import GoodsIssueNew from '@/components/apps/inventory/goodsissue/New'
import GoodsIssueEdit from '@/components/apps/inventory/goodsissue/Edit'
import WarehouseManagement from '@/components/apps/inventory/configuration/Warehouse'
import InventoryAssignItem from '@/components/apps/inventory/configuration/AssignItem'

// contact folder
import ContactListAll from '@/components/apps/contact/list/All'
import ContactVendorAll from '@/components/apps/contact/vendor/All'
import ContactVendorNew from '@/components/apps/contact/vendor/New'
import ContactVendorEdit from '@/components/apps/contact/vendor/Edit'
import ContactCustomerAll from '@/components/apps/contact/customer/All'
import ContactCustomerNew from '@/components/apps/contact/customer/New'
import ContactCustomerEdit from '@/components/apps/contact/customer/Edit'

// applications folder
import AppsCategoryAll from '@/components/apps/applications/category/All'

// settings
import SettingsCompany from '@/components/apps/settings/general/Company'
import SettingsAppearance from '@/components/apps/settings/general/Appearance'
import SettingsUserPermissionAll from '@/components/apps/settings/userpermission/All'
import SettingsUserPermissionNew from '@/components/apps/settings/userpermission/New'
import SettingsUserPermissionEdit from '@/components/apps/settings/userpermission/Edit'

// custom components
import VueProgressBar from 'vue-progressbar'
import InputTags from '@/components/custom/InputTags'
import Selectize from '@/components/custom/Selectize'
import SectionHeader from '@/components/custom/SectionHeader'
import SectionTitle from '@/components/custom/SectionTitle'
import Modifier from '@/components/custom/Modifier'

/**
 ** Vue use
 **/
Vue.use(Vuex)
Vue.use(Vuesax)
Vue.use(Router)
Vue.use(UUID)
Vue.use(VCalendar)
Vue.use(VueProgressBar, {
  color: '#F5A723',
  failedColor: '#f00',
  thickness: '3px'
})
Vue.component('section-header', SectionHeader)
Vue.component('input-tags', InputTags)
Vue.component('selectize', Selectize)
Vue.component('section-title', SectionTitle)
Vue.component('modifier', Modifier)

/**
 ** check auth
 **/
var access_token = null,
    user_info    = null,
    shop_info    = null

if(LocalStorage.get('auth')) {
  access_token = LocalStorage.get('auth').access_token
  user_info = LocalStorage.get('auth').user_info
  shop_info = LocalStorage.get('auth').shop_info
}

if(user_info) {
  if(shop_info) {
    store.dispatch('LoggedInShop', {
      shop_id: shop_info.shop_id,
      user_id: user_info.user_id
    })
  } else {
    store.dispatch('LoggedIn')
  }
}

/**
 ** check language
 **/
var lang = LocalStorage.get('lang')
if(lang) {
  store.dispatch('switchLang', lang)
} else {
  store.dispatch('switchLang', store.state.app.lang)
}

/**
 ** router
 **/
export default new Router({
  routes: [
    {
      path: '/',
      beforeEnter: function(to, from, next) {
        next({
          path: '/signin',
        })
      }
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: SignIn,
      meta: {

      },
      beforeEnter: function(to, from, next) {
        if(store.state.auth.auth.shop_info) {
          return next({
            path: '/dashboard',
          })
        }
        if(store.state.auth.auth.user_info) {
          return next({
            path: '/company',
          })
        }
        next()
      }
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp,
      meta: {

      }
    },
    {
      path: '/company',
      name: 'ChooseShop',
      component: ChooseShop,
      meta: {
        requireLogin: true
      },
      beforeEnter: function(to, from, next) {
        if(store.state.auth.auth.shop_info) {
          return next({
            path: '/dashboard',
          })
        }
        next()
      }
    },
    {
      path: '/company/new',
      name: 'CreateShop',
      component: CreateShop,
      meta: {
        requireLogin: true
      },
      beforeEnter: function(to, from, next) {
        if(store.state.auth.auth.shop_info) {
          return next({
            path: '/dashboard',
          })
        }
        next()
      }
    },
    {
      path: '/logout',
      name: 'Logout',
      beforeEnter: function(to, from, next) {
        store.dispatch('Logout')
        next({
          path: '/signin'
        })
      }
    },
    {
      path: '/dashboard',
      name: 'Home',
      component: Home,
      meta: {
        requireLogin: true,
        requireLoginShop: true
      }
    },
    {
      path: '/dashboard/items/product/all',
      name: 'ProductAll',
      component: ProductAll,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requirePermissions: ['product']
      }
    },
    {
      path: '/dashboard/items/product/new',
      name: 'ProductNew',
      component: ProductNew,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requirePermissions: ['product']
      }
    },
    {
      path: '/dashboard/items/product/details',
      name: 'ProductEdit',
      component: ProductEdit,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requirePermissions: ['product']
      }
    },
    {
      path: '/dashboard/items/category/all',
      name: 'CategoryAll',
      component: CategoryAll,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requirePermissions: ['product']
      }
    },
    {
      path: '/dashboard/items/category/new',
      name: 'CategoryNew',
      component: CategoryNew,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requirePermissions: ['product']
      }
    },
    {
      path: '/dashboard/items/category/details',
      name: 'CategoryEdit',
      component: CategoryEdit,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requirePermissions: ['product']
      }
    },
    {
      path: '/dashboard/items/modifier/all',
      name: 'ModifierAll',
      component: ModifierAll,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requirePermissions: ['product']
      }
    },
    {
      path: '/dashboard/items/modifier/new',
      name: 'ModifierNew',
      component: ModifierNew,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requirePermissions: ['product']
      }
    },
    {
      path: '/dashboard/items/modifier/details',
      name: 'ModifierEdit',
      component: ModifierEdit,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requirePermissions: ['product']
      }
    },
    {
      path: '/dashboard/purchases/po/all',
      name: 'PurchaseAll',
      component: PurchaseAll,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requirePermissions: ['purchase']
      }
    },
    {
      path: '/dashboard/inventory/overview/todo',
      name: 'InventoryTodo',
      component: InventoryTodo,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requirePermissions: ['inventory']
      }
    },
    {
      path: '/dashboard/inventory/overview/current',
      name: 'CurrentStock',
      component: CurrentStock,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requirePermissions: ['inventory']
      }
    },
    {
      path: '/dashboard/inventory/stockcontrols',
      name: 'StockControl',
      component: StockControl,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requirePermissions: ['inventory']
      }
    },
    {
      path: '/dashboard/inventory/activities',
      name: 'StockActivity',
      component: StockActivity,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requirePermissions: ['inventory']
      }
    },
    {
      path: '/dashboard/inventory/goods-receipt/all',
      name: 'GoodsReceiptAll',
      component: GoodsReceiptAll,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requirePermissions: ['inventory']
      }
    },
    {
      path: '/dashboard/inventory/goods-receipt/new',
      name: 'GoodsReceiptNew',
      component: GoodsReceiptNew,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requirePermissions: ['inventory']
      }
    },
    {
      path: '/dashboard/inventory/goods-receipt/details',
      name: 'GoodsReceiptEdit',
      component: GoodsReceiptEdit,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requirePermissions: ['inventory']
      }
    },
    {
      path: '/dashboard/inventory/goods-issue/all',
      name: 'GoodsIssueAll',
      component: GoodsIssueAll,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requirePermissions: ['inventory']
      }
    },
    {
      path: '/dashboard/inventory/goods-issue/new',
      name: 'GoodsIssueNew',
      component: GoodsIssueNew,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requirePermissions: ['inventory']
      }
    },
    {
      path: '/dashboard/inventory/goods-issue/details',
      name: 'GoodsIssueEdit',
      component: GoodsIssueEdit,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requirePermissions: ['inventory']
      }
    },
    {
      path: '/dashboard/inventory/config/warehouse-management',
      name: 'WarehouseManagement',
      component: WarehouseManagement,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requirePermissions: ['inventory']
      }
    },
    {
      path: '/dashboard/inventory/config/assignitems',
      name: 'InventoryAssignItem',
      component: InventoryAssignItem,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requirePermissions: ['inventory']
      }
    },
    {
      path: '/dashboard/apps/category/all',
      name: 'AppsCategoryAll',
      component: AppsCategoryAll,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requireOwner: true
      }
    },
    {
      path: '/dashboard/settings/general/company',
      name: 'SettingsCompany',
      component: SettingsCompany,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requireOwner: true
      }
    },
    {
      path: '/dashboard/settings/general/appearance',
      name: 'SettingsAppearance',
      component: SettingsAppearance,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requireOwner: true
      }
    },
    {
      path: '/dashboard/settings/user-permissions/all',
      name: 'SettingsUserPermissionAll',
      component: SettingsUserPermissionAll,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requireOwner: true
      }
    },
    {
      path: '/dashboard/settings/user-permissions/new',
      name: 'SettingsUserPermissionNew',
      component: SettingsUserPermissionNew,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requireOwner: true
      }
    },
    {
      path: '/dashboard/settings/user-permissions/details',
      name: 'SettingsUserPermissionEdit',
      component: SettingsUserPermissionEdit,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requireOwner: true
      }
    },
    {
      path: '/dashboard/contact/all',
      name: 'ContactListAll',
      component: ContactListAll,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requirePermissions: ['contact']
      }
    },
    {
      path: '/dashboard/contact/vendor/all',
      name: 'ContactVendorAll',
      component: ContactVendorAll,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requirePermissions: ['contact']
      }
    },
    {
      path: '/dashboard/contact/vendor/new',
      name: 'ContactVendorNew',
      component: ContactVendorNew,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requirePermissions: ['contact']
      }
    },
    {
      path: '/dashboard/contact/vendor/details',
      name: 'ContactVendorEdit',
      component: ContactVendorEdit,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requirePermissions: ['contact']
      }
    },
    {
      path: '/dashboard/contact/customer/all',
      name: 'ContactCustomerAll',
      component: ContactCustomerAll,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requirePermissions: ['contact']
      }
    },
    {
      path: '/dashboard/contact/customer/new',
      name: 'ContactCustomerNew',
      component: ContactCustomerNew,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requirePermissions: ['contact']
      }
    },
    {
      path: '/dashboard/contact/customer/details',
      name: 'ContactCustomerEdit',
      component: ContactCustomerEdit,
      meta: {
        requireLogin: true,
        requireLoginShop: true,
        requirePermissions: ['contact']
      }
    },
    {
      path: '*',
      name: '404',
      component: {
        template: '<div>404 Page Not Found</div>'
      }
    }
  ]
})
