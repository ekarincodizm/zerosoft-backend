<template>
  <div id="content">
    <div class="header col-md-12">
      <div class="header-inner row align-items-center">
        <div class="col left">
          <div class="title">
            {{ $t('sidebar.overviews') }} > {{ $t('sidebar.currentstock') }}
          </div>
        </div>
      </div>
    </div>
    <div class="content col-md-12" style="padding-top: 24px;">
      <p v-if="!ready">{{ $t('message.loading') }}</p>

      <!-- <pre>{{ currentstocks }}</pre> -->

      <table id="dataTable" class="table table-bordered" style="width: 100%;" v-if="ready">
        <thead>
          <tr>
            <th>สินค้า</th>
            <th class="text-right">จอง</th>
            <th class="text-right">คงเหลือ</th>
          </tr>
        </thead>
        <tbody>
          <tr :ref="'skuid_'+item.product.sku_id"
              @click="toggle('skuid_'+item.product.sku_id)"
              v-for="(item, index) in currentstocks">
            <td>
              <div class="item">
                <i class="fas fa-angle-right"></i>
                <span>
                  {{ getProductFullName(item.product.product_name, item.product.attributes) }}
                </span>
              </div>
              <div class="wh" v-for="warehouse in item.warehouses">
                {{ warehouse.warehouse_name }}
              </div>
            </td>
            <td class="text-right">
              <div class="total">
                {{ getNumber(item.total_reserved) }}
              </div>
              <div class="reserved" v-for="count in item.reserved">
                {{ getNumber(count) }}
              </div>
            </td>
            <td class="text-right">
              <div class="total">
                {{ getNumber(item.total_instock) }}
              </div>
              <div class="instock" v-for="count in item.instock">
                {{ getNumber(count) }}
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
import sidebarModule from './../../sidebarModule'
import submenuModule from '../submenuModule'

export default {
  name: 'CurrentStock',
  data () {
    return {
      ready: false
    }
  },
  computed: mapGetters({
    loading: 'getLoading',
    error: 'getError',
    activities: 'getActivities',
    warehouses: 'getWarehouses',
    sidebar: 'getSidebar',
    currentstocks: 'getCurrentstocks'
  }),
  methods: {
    toggle (ref) {
      $(this.$refs[ref]).toggleClass( "toggle" )
    }
  },
  watch: {
    loading: function (isLoading) {
      this.showLoading(this.$Progress, isLoading)
    },
    error: function (msg) {
      this.showError(this.$Progress, this.$vs, msg, {
        title: this.$t('message.message'),
        text: this.$t('message.somethingwentwrong')
      })
    },
    ready: function () {
      // finish loading
      this.showFinish(this.$Progress)
      // set option dataTable
      let option = this.dataTableOption()
      // set dataTable
      setTimeout(()=>{$('#dataTable').DataTable(option)}, 10)
    },
    warehouses: function (newVal, oldVal) {
      sidebarModule.init(this.getObject(require('../sidebar.json')))
      sidebarModule.update(this.sidebar, 1, submenuModule.getWarehouses(this.warehouses))
      sidebarModule.active({
        sidebarAtIdx: 0,
        submenuAtIdx: 1
      })
    }
  },
  beforeCreate: function () {

  },
  created: async function () {
    // get warehouses
    if(this.warehouses.length == 0) {
      await this.$store.dispatch('getWarehouses')
    }
    // get current stocks
    await this.$store.dispatch('getCurrentstocks')
    // ready
    this.ready = true
  },
  beforeMount: function () {
    // init page
    this.initPage({
      section: 'app',
      name: this.$t('app.inventory.title')
    })
    // set sidebar stockcontrols ui
    sidebarModule.init(this.getObject(require('../sidebar.json')))
    sidebarModule.update(this.sidebar, 1, submenuModule.getWarehouses(this.warehouses))
    sidebarModule.active({
      sidebarAtIdx: 0,
      submenuAtIdx: 1
    })
  },
  mounted: function () {

  },
  updated: function () {

  },
  destroyed: function() {
    this.leavePage(this.$Progress, ['clearCurrentstocks'])
  }
}
</script>

<style scoped>
  .highlight {
    background: rgba(0,0,0,.05);
  }
  /* .table thead, .table tbody {
    background: none;
  } */
  .table .toggle .item i {
    transform: rotate(90deg);
  }
  .table .toggle .wh, .table .toggle .reserved, .table .toggle .instock {
    display: block;
  }
  .table tbody tr {
    cursor: pointer;
  }
  .table tbody tr:hover, .table tbody tr.toggle {
    background: rgba(216,226,231,.25)
  }
  .table .item strong {

  }
  .table .item strong i {
    position: relative;
  }
  .table .item strong span {
    padding-left: 5px;
  }
  .table .wh {
    padding-left: 35px;
    display: none;
  }
  .table .total {
    text-decoration: underline;
  }
  .table .reserved, .table .instock {
    display: none;
  }
</style>
