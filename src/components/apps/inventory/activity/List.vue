<template>
  <div id="content">
    <div class="header col-md-12">
      <div class="header-inner row align-items-center">
        <div class="col left">
          <div class="title">
            {{ $t('sidebar.activities') }}
          </div>
        </div>
      </div>
    </div>

    <!-- style="max-height: 534px;" -->
    <div class="content col-md-12">

      <p v-if="!ready">{{ $t('message.loading') }}</p>

      <!-- <pre>{{ activities }}</pre> -->

      <div class="col-md-12 no-padding" v-if="ready">
        <table id="dataTable" class="table table-bordered" style="width: 100%;">
          <thead>
            <tr>
              <th>{{ $t('message.item') }}</th>
              <th class="text-center">{{ $t('message.reason') }}</th>
              <th class="text-center">{{ $t('message.stockinout') }}</th>
              <th class="text-center">{{ $t('message.store') }}</th>
              <th class="text-center">{{ $t('message.refinventory') }}</th>
              <th class="text-center">{{ $t('message.refposo') }}</th>
              <th class="text-center">{{ $t('message.createdat') }}</th>
              <th>{{ $t('message.createdby') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in activities">
              <td>
                <template
                  v-if="!checkAuth({app_id: 2})">
                {{ getProductFullName(item.product.product_name, item.product.attributes) }}
                </template>
                <router-link :to="{name: 'ProductEdit', query: {
                  'pid': item.product.product_id,
                  'pname': item.product.product_name
                  }}"
                  v-if="checkAuth({app_id: 2})">
                  {{ getProductFullName(item.product.product_name, item.product.attributes) }}
                </router-link>
              </td>
              <td class="text-center">{{ item.stockactivity.details.reason }}</td>
              <td class="text-center">
                {{ getNumber(item.stockactivity.details.quantity) }}
                <template v-if="item.stockactivity.details.status == 'in'">
                  {{ $t('message.stockin') }}
                </template>
                <template v-if="item.stockactivity.details.status == 'out'">
                  {{ $t('message.stockout') }}
                </template>
              </td>
              <td class="text-center">
                <router-link :to="{name: 'WarehouseManagement', query: {
                  'wh_id': item.warehouse.warehouse_id
                  }}">
                  {{ item.warehouse.warehouse_name }}
                </router-link>
              </td>
              <td class="text-center">
                <template v-if="item.stockactivity.details.ref_inventory">
                  <template v-if="item.stockactivity.details.ref_inventory.gr">
                    <router-link :to="{name: 'GoodsReceiptEdit', query: {
                      'gr_id': item.stockactivity.details.ref_inventory.gr.id,
                      'gr_code': item.stockactivity.details.ref_inventory.gr.code
                      }}">
                      {{ item.stockactivity.details.ref_inventory.gr.code }}
                    </router-link>
                  </template>
                  <template v-if="item.stockactivity.details.ref_inventory.gi">
                    <router-link :to="{name: 'GoodsIssueEdit', query: {
                      'gi_id': item.stockactivity.details.ref_inventory.gi.id,
                      'gi_code': item.stockactivity.details.ref_inventory.gi.code
                      }}">
                      {{ item.stockactivity.details.ref_inventory.gi.code }}
                    </router-link>
                  </template>
                </template>
              </td>
              <td class="text-center"></td>
              <td class="text-center" v-tooltip="{
                  text: item.stockactivity.created_at,
                  position:'right'
                }">
                {{ getFriendlyTime(item.stockactivity.created_at) }}
              </td>
              <td>{{ item.user.email || item.user.username }}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <!-- <div class="footer col-md-12">
      <div>Footer</div>
    </div> -->

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import sidebarModule from './../../sidebarModule'
import submenuModule from '../submenuModule'

export default {
  name: 'StockControl',
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
    auth: 'getAuth'
  }),
  methods: {

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
    ready: function() {
      // loading finish
      this.showFinish(this.$Progress)
      // set option dataTable
      let option = this.dataTableOption()
      // set dataTable
      setTimeout(()=>{$('#dataTable').DataTable(option)}, 1)
    },
    warehouses: function (newVal, oldVal) {
      sidebarModule.init(this.getObject(require('../sidebar.json')))
      sidebarModule.update(this.sidebar, 1, submenuModule.getWarehouses(this.warehouses))
      sidebarModule.active({
        sidebarAtIdx: 2
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
    // get warehouses
    await this.$store.dispatch('getActivities')
    // set ready
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
      sidebarAtIdx: 2
    })
  },
  mounted: function () {

  },
  updated: function() {

  },
  destroyed: function() {
    this.leavePage(this.$Progress, ['clearActivities'])
  }
}
</script>
