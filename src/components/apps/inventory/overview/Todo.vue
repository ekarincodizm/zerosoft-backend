<template>
  <div id="content">
    <div class="header col-md-12">
      <div class="header-inner row align-items-center">
        <div class="col left">
          <div class="title">
            {{ $t('sidebar.overviews') }} > {{ $t('sidebar.todo') }}
          </div>
        </div>
      </div>
    </div>
    <div class="content col-md-12">
      <p v-if="!ready">{{ $t('message.loading') }}</p>

      <!-- <pre>{{ todo }}</pre> -->

      <div class="col-md-12 no-padding no-margin row" v-if="ready && todo.length > 0">
        <div class="col-md-12 col-lg-6" v-for="(item, index) in todo">
          <div class="col-md-12 card">
            <section-title :title="item.warehouse.warehouse_name" fontweight="bold"></section-title>
            <div class="col-md-12 no-padding no-margin row">
              <div class="col-md-6 mb-2 no-padding">
                <p>{{ $t('message.goodsreceipt') }}</p>
                <router-link class="btn btn-web btn-sm" :to="{
                    name: 'GoodsReceiptAll',
                    query: {
                      wh_id: item.warehouse.warehouse_id,
                      status: 'padding'
                    }
                  }">
                  {{ item.goodsreceipt.todo }}
                  {{ $t('button.todo') }}
                </router-link>
              </div>
              <div class="col-md-6 mb-2 no-padding">
                <p>{{ $t('message.goodsissue') }}</p>
                <router-link class="btn btn-web btn-sm" :to="{
                    name: 'GoodsIssueAll',
                    query: {
                      wh_id: item.warehouse.warehouse_id,
                      status: 'padding'
                    }
                  }">
                  {{ item.goodsissue.todo }}
                  {{ $t('button.todo') }}
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import sidebarModule from './../../sidebarModule'
import submenuModule from '../submenuModule'

export default {
  name: 'InventoryTodo',
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
    todo: 'getTodo'
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
      // finish loading
      this.showFinish(this.$Progress)
    },
    warehouses: function (newVal, oldVal) {
      sidebarModule.init(this.getObject(require('../sidebar.json')))
      sidebarModule.update(this.sidebar, 1, submenuModule.getWarehouses(this.warehouses))
      sidebarModule.active({
        sidebarAtIdx: 0,
        submenuAtIdx: 0
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
    // get todo
    await this.$store.dispatch('getTodo')
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
      submenuAtIdx: 0
    })
  },
  mounted: function () {

  },
  destroyed: function() {
    this.leavePage(this.$Progress, ['clearTodo'])
  }
}
</script>

<style scoped>
  #content .content {
    padding-top: 18px;
    padding-left: 15px;
    padding-right: 15px;
  }
  .card {
    background: #FFF;
    border: solid 1px #D8E2E7;
    border-radius: 2px;
    padding: 15px 15px 7px 15px;
    margin: 10px 0 15px 0;
  }
  .card p {
    margin: 0 0 5px 0;
  }
  .btn-web {
    min-width: 92px;
  }
  @media (max-width: 575.98px) {
    .btn-web {
      width: 100%;
    }
  }
</style>
