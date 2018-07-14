<template>
  <div id="content">
    <div class="header col-md-12">
      <div class="header-inner row align-items-center">
        <div class="col left">
          <div class="title">
              {{ $t('sidebar.goodsissue') }} > {{ $t('sidebar.all') }}
          </div>
        </div>
        <div class="col right">
          <select class="form-control form-control-sm" style="float: right;width: 120px;margin-left: 12px;" v-model="status">
            <option value="all">{{ $t('message.all') }}</option>
            <option value="padding">{{ $t('message.paddingdelivery') }}</option>
            <option value="done">{{ $t('message.deliveredorder') }}</option>
          </select>
          <select class="form-control form-control-sm" style="float: right;width: 120px;" v-model="warehouse_id">
            <option value="all">{{ $t('message.all') }}</option>
            <option v-for="(item, index) in warehouses" :value="item.warehouse_id">
              {{ item.warehouse_name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="content col-md-12">

      <p v-if="!ready">{{ $t('message.loading') }}</p>

      <!-- <pre>{{ goodsissues }}</pre> -->

      <table id="dataTable" class="table table-bordered" v-if="ready" style="width: 100%;">
        <thead>
          <tr>
            <th>{{ $t('message.refgi') }}</th>
            <th class="text-center">{{ $t('message.customer') }}/{{ $t('message.partner') }}</th>
            <th class="text-center">{{ $t('message.scheduled_at') }}</th>
            <th>{{ $t('message.status') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in goodsissues">
            <td>
              <router-link :to="{name: 'GoodsIssueEdit', query: {
                'gi_id': item.gi_id,
                'gi_code': item.gi_code
                }}">
                {{ item.gi_code }}
              </router-link>
            </td>
            <td class="text-center">
              <template v-if="item.vendor">
                {{ item.vendor.vendor_name }}
              </template>
            </td>
            <td class="text-center">
              {{ getDate(item.scheduled_at) }}
            </td>
            <td>
              <div class="dropdown">
                <button
                  class="btn no-bg dropdown-toggle" type="button" id="dropdownMenuButton1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                  v-if="item.status == 'padding'"
                >
                  <i class="far fa-circle text-warning"></i>
                  <span class="name text-warning">{{ $t('message.paddingdelivery') }}</span>
                </button>
                <button
                class="btn no-bg"
                type="button"
                v-if="item.status == 'done'"
                >
                  <i class="far fa-check-circle text-success"></i>
                  <span class="name text-success">{{ $t('message.deliveredorder') }}</span>
                </button>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton1">
                  <router-link class="dropdown-item" :to="{name: 'GoodsIssueEdit', query: {
                    'gi_id': item.gi_id,
                    'gi_code': item.gi_code,
                    'modal': 'received-orders'
                    }}">
                    <i class="far fa-check-circle text-success"></i>
                    <span class="text-success">{{ $t('message.deliveredorder') }}</span>
                  </router-link>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

    </div>

    <div class="footer">

    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import sidebarModule from './../../sidebarModule'
import submenuModule from '../submenuModule'

export default {
  name: 'GoodsIssueAll',
  data () {
    return {
      ready: false,
      dataTable: null,
      status: 'all',
      warehouse_id: 'all'
    }
  },
  computed: mapGetters({
    loading: 'getLoading',
    error: 'getError',
    warehouses: 'getWarehouses',
    sidebar: 'getSidebar',
    goodsissues: 'getGoodsissues',
    uiOptions: 'getUIOptions'
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
    ready: function () {

      let that = this

      // loading finish
      this.showFinish(this.$Progress)

      if(this.$route.query.wh_id) {
        this.warehouse_id = this.$route.query.wh_id
      }

      if(this.$route.query.status) {
        this.status = this.$route.query.status
      }

      let option = this.dataTableOption()
          option['columnDefs'] = [
            { "width": "180px", "targets": 2 },
            { "width": "180px", "targets": 3 }
          ]

      // reset search
      $.fn.dataTable.ext.search = []

      // set dataTable
      setTimeout(()=>{
        this.dataTable = $('#dataTable').DataTable(option)
      }, 1)

      // event search
      $.fn.dataTable.ext.search.push(
        function( settings, data, dataIndex )
        {
          let warehouse_id = that.goodsissues[dataIndex].stockout.warehouse_id
          let status = that.goodsissues[dataIndex].status

          let input_warehouseId = that.warehouse_id
          let input_status = that.status

          if(input_warehouseId == 'all' && input_status == 'all') {
            return true
          }

          if(input_warehouseId == 'all') {
            if(input_status == status) {
              return true
            }
          }

          if(input_status == 'all') {
            if(input_warehouseId == warehouse_id) {
              return true
            }
          }

          if(input_warehouseId == warehouse_id && input_status == status) {
            return true
          }

          return false
        }
      )
    },
    warehouses: function (newVal, oldVal) {
      sidebarModule.init(this.getObject(require('../sidebar.json')))
      sidebarModule.update(this.sidebar, 1, submenuModule.getWarehouses(this.warehouses))
      sidebarModule.active({
        sidebarAtIdx: 4,
        submenuAtIdx: 0
      })
    },
    warehouse_id: function (after, before) {
      console.log('warehouse_id: ' + after)
      this.dataTable.draw()
    },
    status: function (after, before) {
      console.log('status: ' + after)
      this.dataTable.draw()
    }
  },
  beforeCreate: function () {

  },
  created: async function () {
    // get warehouses
    if(this.warehouses.length == 0) {
      await this.$store.dispatch('getWarehouses')
    }
    // get goodsissues
    await this.$store.dispatch('getGoodsissues')
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
      sidebarAtIdx: 4,
      submenuAtIdx: 0
    })
  },
  mounted: function () {

  },
  destroyed: function() {
    $.fn.dataTable.ext.search = []
    this.leavePage(this.$Progress, ['clearGoodsissues'])
  }
}
</script>

<style scoped>
  .dropdown > button {
    padding: 0;
  }
</style>
