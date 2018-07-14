<template>
  <div id="content">
    <div class="header col-md-12">
      <div class="header-inner row align-items-center">
        <div class="col left">
          <div class="title">
            {{ $t('sidebar.stockcontrols') }} {{ '> ' + subtitle }}
          </div>
        </div>
        <!--<div class="col right">
          <div class="action">
            <router-link :to="{ name: 'NewProduct' }" class="btn btn-web">
              เพิ่มสินค้าใหม่ <i class="fas fa-plus"></i>
            </router-link>
          </div>
        </div>-->
      </div>
    </div>

    <div class="content col-md-12">
      <p v-if="$store.state.app.loading">Loading...</p>
      <table id="datatable" class="table table-bordered" v-if="stocks.length > 0">
        <thead style="background: #F2F2F2;">
          <tr>
            <th>สินค้า</th>
            <th>สต๊อกน้อยสุด</th>
            <th>สต๊อกมากสุด</th>
            <th>สต๊อก</th>
            <th></th>
          </tr>
        </thead>
        <tbody style="background: #FFF;">
          <tr v-for="(item, index) in stocks">
            <td>{{ item.product_name }}</td>
            <td>{{ item.control.minstock }}</td>
            <td>{{ item.control.maxstock }}</td>
            <td>{{ item.instock }} {{ item.unit }}</td>
            <td>
              <div class="dropdown">
                <button class="btn no-bg dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span class="name">
                    เลือก
                  </span>
                </button>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                  <!-- <a class="dropdown-item">
                    <i class="fas fa-credit-card"></i> จัดซื้อ
                  </a> -->
                  <a class="dropdown-item">
                    <i class="fas fa-redo-alt"></i> ปรับเปลี่ยน
                  </a>
                  <a class="dropdown-item">
                    <i class="fas fa-exchange-alt"></i> โอนย้าย
                  </a>
                  <a class="dropdown-item">
                    <i class="fas fa-cog"></i> แจ้งเตือนสต๊อกสินค้า
                  </a>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'StockControl',
  data () {
    return {
      subtitle: null
    }
  },
  computed: mapGetters({
    auth: 'getAuth',
    warehouses: 'getWarehouses',
    stocks: 'getStocks'
  }),
  methods: {
    loadStocks (wh_id) {
      // sidebar json
      let sidebar = this.getSidebar(require('../sidebar.json'))
      // clear sidebar
      sidebar[1].submenus = []
      // add new menu
      for(let i in this.warehouses) {
        let wh = this.warehouses[i]
        var submenu = {
          "name": wh.warehouse_name,
          // "router": "StockControl",
          // "query": {
          //   wh_id: wh.warehouse_id
          // },
          "router": {
            "name": "StockControl",
            "query": {
              "wh_id": wh.warehouse_id
            }
          },
          "activeClass": ''
        }
        if(wh_id == wh.warehouse_id) {
          // get stocks
          this.$store.dispatch('getStocks', wh.warehouse_id)
          this.subtitle = submenu.name
          submenu['activeClass'] = 'active'
        }
        // add submenu
        sidebar[1].activeClass = "opened"
        sidebar[1].submenus.push(submenu)
      }
      // set sidebar menu active
      this.$store.dispatch('setSidebar', sidebar)
    },
    setSidebar () {
      var wh_id = null
      if(this.$route.query.wh_id) {
        wh_id = this.$route.query.wh_id
      } else {
        let foundPrimary = false
        let sidebar = this.getSidebar(require('../sidebar.json'))
        for(let i in this.warehouses) {
          let wh = this.warehouses[i]
          if(wh.primary && !foundPrimary) {
            foundPrimary = true
            wh_id = wh.warehouse_id
          }
        }
      }
      this.loadStocks(wh_id)
    }
  },
  watch: {
    warehouses: function (newVal, oldVal) {
      console.log('warehouses Changed')
      //this.setSidebar()
    },
    '$route': function (refreshPage) {
      let wh_id = refreshPage.query.wh_id
      //this.loadStocks(wh_id)
    }
  },
  beforeCreate: function () {

  },
  created: function () {
    // get warehouses
    //this.$store.dispatch('getWarehouses')
  },
  beforeMount: function () {
    // set last router
    this.$store.dispatch('setLastRouter', this.$router.history.current.name)
    // set section
    this.$store.dispatch('setSection', 'app')
    // set title
    this.setTitle(this.$t('message.app_inventory'))
    // set header
    this.$store.dispatch('setHeader', this.$t('message.app_inventory'))
    // set sidebar stockcontrols ui
    //this.setSidebar()
  },
  mounted: function () {

  },
  destroyed: function() {
    this.$store.dispatch('clearStock')
  }
}
</script>
