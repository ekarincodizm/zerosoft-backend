// router
import router from './router'
// vuex
import { mapGetters } from 'vuex'
// store
import store from './store'
// momentjs
import moment from 'moment'
// moment timezone
import tz from 'moment-timezone'

var loopLoading = null

/**
 ** libs function use for only this file
 **/
function toCurrentTimeZone (date) {
  // get user time zone
  let timezone = moment.tz.guess()
  return moment(date).tz(timezone)
}

function setTabTitle (title) {
  document.title = title
}

function removeModal () {
  $('body > .modal, body > .modal-backdrop').remove()
  $('body').removeClass('modal-open')
}

export default {
  computed: mapGetters({
    auth: 'getAuth',
    dateformat: 'getDateFormat'
  }),
  methods: {
    initPage (opts) {
      // set last router
      store.dispatch('setLastRouter', router.history.current.name)
      // set section
      store.dispatch('setSection', opts.section)
      // set title
      setTabTitle(opts.name)
      // set header
      store.dispatch('setHeader', opts.name)
    },
    getObject (json) {
      let temp = JSON.stringify(json)
      return JSON.parse(temp)
    },
    setTabTitle (title) {
      return setTabTitle(title)
    },
    setModal (id) {
      if($('body > ' + id).length == 0) {
        // move modal to outside this element
        $(id).appendTo('body')
      } else {
        // remove modal in this element
        $('body > ' + id).remove()
        // move modal to outside this element
        $(id).appendTo('body')
      }
    },
    removeModal () {
      removeModal()
    },
    pad (n, width, z) {
      z = z || '0'
      n = n + ''
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
    },
    getNumber (number) {

      if(number === undefined || number === '' || number === null) return

      const shop_info = this.auth.shop_info
      const settings = shop_info.settings
      const appearance = settings.general.appearance
      const format_number = appearance.format_number
      const place = format_number.decimal.place
      const use_comma = format_number.use_comma
      let foundDot = number.toString().indexOf('.') >= 0
      if(!use_comma) {
        return number.toLocaleString('en-US',{minimumFractionDigits: place}).replace(',', '')
      }
      return number.toLocaleString('en-US',{minimumFractionDigits: place})
    },
    getProductFullName: (product_name, attributes) => {
      var fullname = ''
      var option = ''
      for(let i in attributes) {
        if(i == 0) {
          option += '('
        }
        //option +=  attributes[i].name + ' '
        option += attributes[i].option
        if(i < attributes.length-1) {
          option += ', '
        } else {
          option += ')'
        }
      }
      if(attributes.length > 0) {
        fullname = product_name + ' ' + option
      } else {
        fullname = product_name
      }
      return fullname
    },
    dataTableOption () {
      return {
          fixedHeader: {
              header: true,
              footer: false,
              headerOffset: $('#content .header').position().top + $('#content .header').outerHeight() - 7
          },
          pageLength: 10, // 10
          bSort: false,
          //info: false
      }
    },
    getDate (date) {
      return toCurrentTimeZone(date).format(this.dateformat)
    },
    getFriendlyTime (date) {
      return toCurrentTimeZone(date).startOf('minute').fromNow()
    },
    notify ($vs, opts) {
      $vs.notify({
        title: opts.title || null,
        text: opts.text,
        color: opts.color,
        icon: opts.icon,
        time: 1000*3,
        position:'top-right'
      })
    },
    showLoading ($progress, isLoading)
    {
      if(!loopLoading)
      {
        $progress.start()
        loopLoading = setInterval(()=>
        {
          if($progress.get() > 90) {
            $progress.pause()
          }
        }, 100)
      }
    },
    showFinish ($progress)
    {
      $progress.finish()

      clearInterval(loopLoading)

      loopLoading = null

      store.dispatch('Loading', false)
    },
    showError ($progress, $vs, msg, opts)
    {
      $progress.fail()

      $vs.notify({
        title: opts.title,
        text: msg || opts.text,
        color:'warning',
        icon: 'warning',
        fixed: 'true',
        position:'top-right'
      })

      clearInterval(loopLoading)

      loopLoading = null
    },
    leavePage ($progress, clearStateArray, commonOptions) {
      // set progress to zero
      $progress.set(0)
      // clear state in array
      for(let i in clearStateArray) {
        store.dispatch(clearStateArray[i])
      }
      // remove modal
      removeModal()
      // trick window resize, if you use dataTable use must trick resize before destory to remove fixed header of table
      window.dispatchEvent(new Event('resize'))
    },
    checkAuth (opt) { // check install app and permissions
      let apps = this.auth.shop_info.install_apps
      let permissions = this.auth.user_info.permissions
      for(let i in apps) {
        let isInstall = apps[i].app_id == opt.app_id
        if(isInstall) {
          for(let j in permissions) {
            let isAllowPermission = apps[i].app_id == permissions[j].app_id
            if(isAllowPermission) {
              return true
            }
          }
        }
      }
      return false
    },
    isAllowPermission (opt) { // check only permissions
      let permissions = this.auth.user_info.permissions
      for(let i in permissions) {
        if(permissions[i].app_id == opt.app_id) {
          return true
        }
      }
      return false
    },
    isInstallApp (opt) {
      let apps = this.auth.shop_info.install_apps
      for(let i in apps) {
        let isInstall = apps[i].app_id == opt.app_id
        if(isInstall) {
          return true
        }
      }
      return false
    },
    getAppInfo ($t, app_id) {
      switch (app_id) {
        case 1:
          return $t('app.pos')
          break
        case 2:
          return $t('app.products')
          break
        case 3:
          return $t('app.inventory')
          break
        case 4:
          return $t('app.purchases')
          break
        case 5:
          return $t('app.sales')
          break
        case 6:
          return $t('app.expenses')
          break
        case 7:
          return $t('app.crm')
          break
        case 8:
          return $t('app.reports')
          break
        case 9:
          return $t('app.bi')
          break
        case 10:
          return $t('app.ecommerce')
          break
        case 11:
          return $t('app.contacts')
          break
      }
      return null
    }
  }
}
