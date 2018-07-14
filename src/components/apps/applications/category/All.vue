<template>
  <div id="content">
    <div class="header col-md-12">
      <div class="header-inner row align-items-center">
        <div class="col left">
          <div class="title">
            {{ $t('sidebar.applications') }} > {{ $t('sidebar.all') }}
          </div>
        </div>
      </div>
    </div>

    <div class="content col-md-12">
      <p v-if="$store.state.app.loading">Loading...</p>

      <div class="col-md-12 no-padding no-margin row">

        <!-- <pre>{{ apps }}</pre> -->

        <div class="col-md-12 col-lg-6" v-for="(app, index) in apps">
          <div class="col-md-12 card">
            <div class="top">
              <div class="icon" :style="'background:' + app.icon.bgcolor">
                <i :class="app.icon.name"></i>
              </div>
              <div class="details">
                <strong>{{ app.title }}</strong>
                <p>{{ app.description }}</p>
              </div>
            </div>
            <div class="footer row">
              <div class="col-md-12 col-lg-8">
                <vs-switch style="float: left;margin: 8px 0px 8px -10px;" vs-type="success" @change="switchChanged(app.app_id, switchs[app.switch_name])" v-model="switchs[app.switch_name]"/>
                <label class="label">เปิดใช้งานแล้ว</label>
              </div>
              <div class="col-md-12 col-lg-4">
                <a :href="app.learn_more_link" target="_blank">
                  เรียนรู้เพิ่มเติม
                  <i class="fas fa-external-link-alt"></i>
                </a>
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

export default {
  name: 'AppsCategoryAll',
  data () {
    return {
      ready: false,
      switchs: {
        "pos": false,
        "product": false,
        "inventory": false,
        "purchase": false,
        "sale": false,
        "expense": false,
        "customer": false,
        "report": false,
        "bi": false,
        "ecommerce": false,
        "contact": false
      }
    }
  },
  computed: Object.assign(mapGetters({
    loading: 'getLoading',
    error: 'getError',
    auth: 'getAuth'
  }),{
    apps () {
      return [{
        switch_name: 'pos',
        app_id: 1,
        icon: {
          name: this.$t('app.pos.icon'),
          bgcolor: this.$t('app.pos.bgcolor')
        },
        title: this.$t('app.pos.title'),
        description: this.$t('app.pos.description'),
        learn_more_link: 'https://google.co.th'
      },{
        switch_name: 'product',
        app_id: 2,
        icon: {
          name: this.$t('app.products.icon'),
          bgcolor: this.$t('app.products.bgcolor')
        },
        title: this.$t('app.products.title'),
        description: this.$t('app.products.description'),
        learn_more_link: 'https://google.co.th'
      },{
        switch_name: 'inventory',
        app_id: 3,
        icon: {
          name: this.$t('app.inventory.icon'),
          bgcolor: this.$t('app.inventory.bgcolor')
        },
        title: this.$t('app.inventory.title'),
        description: this.$t('app.inventory.description'),
        learn_more_link: 'https://google.co.th'
      },{
        switch_name: 'purchase',
        app_id: 4,
        icon: {
          name: this.$t('app.purchases.icon'),
          bgcolor: this.$t('app.purchases.bgcolor')
        },
        title: this.$t('app.purchases.title'),
        description: this.$t('app.purchases.description'),
        learn_more_link: 'https://google.co.th'
      },{
        switch_name: 'sale',
        app_id: 5,
        icon: {
          name: this.$t('app.sales.icon'),
          bgcolor: this.$t('app.sales.bgcolor')
        },
        title: this.$t('app.sales.title'),
        description: this.$t('app.sales.description'),
        learn_more_link: 'https://google.co.th'
      },{
        switch_name: 'expense',
        app_id: 6,
        icon: {
          name: this.$t('app.expenses.icon'),
          bgcolor: this.$t('app.expenses.bgcolor')
        },
        title: this.$t('app.expenses.title'),
        description: this.$t('app.expenses.description'),
        learn_more_link: 'https://google.co.th'
      },{
        switch_name: 'customer',
        app_id: 7,
        icon: {
          name: this.$t('app.crm.icon'),
          bgcolor: this.$t('app.crm.bgcolor')
        },
        title: this.$t('app.crm.title'),
        description: this.$t('app.crm.description'),
        learn_more_link: 'https://google.co.th'
      },{
        switch_name: 'report',
        app_id: 8,
        icon: {
          name: this.$t('app.reports.icon'),
          bgcolor: this.$t('app.reports.bgcolor')
        },
        title: this.$t('app.reports.title'),
        description: this.$t('app.reports.description'),
        learn_more_link: 'https://google.co.th'
      },{
        switch_name: 'bi',
        app_id: 9,
        icon: {
          name: this.$t('app.bi.icon'),
          bgcolor: this.$t('app.bi.bgcolor')
        },
        title: this.$t('app.bi.title'),
        description: this.$t('app.bi.description'),
        learn_more_link: 'https://google.co.th'
      },{
        switch_name: 'ecommerce',
        app_id: 10,
        icon: {
          name: this.$t('app.ecommerce.icon'),
          bgcolor: this.$t('app.ecommerce.bgcolor')
        },
        title: this.$t('app.ecommerce.title'),
        description: this.$t('app.ecommerce.description'),
        learn_more_link: 'https://google.co.th'
      },{
        switch_name: 'contact',
        app_id: 11,
        icon: {
          name: this.$t('app.contacts.icon'),
          bgcolor: this.$t('app.contacts.bgcolor')
        },
        title: this.$t('app.contacts.title'),
        description: this.$t('app.contacts.description'),
        learn_more_link: 'https://google.co.th'
      }]
    }
  }),
  methods: {
    setSwitchs () {
      if(this.auth) {
        this.switchs.pos = this.isInstallApp({app_id: 1})
        this.switchs.product = this.isInstallApp({app_id: 2})
        this.switchs.inventory = this.isInstallApp({app_id: 3})
        this.switchs.purchase = this.isInstallApp({app_id: 4})
        this.switchs.sale = this.isInstallApp({app_id: 5})
        this.switchs.expense = this.isInstallApp({app_id: 6})
        this.switchs.customer = this.isInstallApp({app_id: 7})
        this.switchs.report = this.isInstallApp({app_id: 8})
        this.switchs.bi = this.isInstallApp({app_id: 9})
        this.switchs.ecommerce = this.isInstallApp({app_id: 10})
        this.switchs.contact = this.isInstallApp({app_id: 11})
      }
    },
    switchChanged (app_id, status) {
      if(status) {
        this.$store.dispatch('installApp', {
          app_id: app_id
        })
      } else {
        this.$store.dispatch('uninstallApp', {
          app_id: app_id
        })
      }
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
      // loading finish
      this.showFinish(this.$Progress)
    },
    auth: function(after, before) {
      this.setSwitchs()
    }
  },
  beforeCreate: function () { // clear states
    // clear products
    this.$store.dispatch('clearProducts')
  },
  created: function () { // call api to get data and set state
    // set ready
    this.ready = true
  },
  beforeMount: function() { // set states ui
    // init page
    this.initPage({
      section: 'app',
      name: this.$t('app.installapp.title')
    })
    // set sidebar ui
    sidebarModule.init(this.getObject(require('../sidebar.json')), {
      sidebarAtIdx: 0,
      submenuAtIdx: 0
    })
  },
  mounted: function () { // run script
    this.setSwitchs()
  },
  updated: function () { // re-rendered html

  },
  destroyed: function() { // leave this page

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
    padding: 15px 15px 0 15px;
    margin: 10px 0 15px 0;
  }
  .card .top {
    width: 100%;
    left: left;
    padding-bottom: 15px;
    border-bottom: solid 1px #D8E2E7;
  }
  .card .top .icon {
    width: 70px;
    height: 70px;
    float: left;
    margin-right: 15px;
    text-align: center;
  }
  .card .top .icon i {
    position: relative;
    top: 18px;
    font-size: 36px;
    color: #FFF;
  }
  .card .top .details {
    width: -webkit-calc(100% - 70px - 15px);
  	width:    -moz-calc(100% - 70px - 15px);
  	width:         calc(100% - 70px - 15px);
    float: left;
    max-height: 72px;
    overflow: auto;
  }
  .card .top .details p {
    margin: 0;
  }
  .card .footer {

  }
  .card .footer .label {
    color: #D4D4D4;
    font-size: 15px;
    margin: 18px 0 0 0;
  }
  .card .footer a {
    float: right;
    margin: 18px 0 15px 0;
  }
  @media (max-width: 992px) {
    .card .footer a {
      margin: 0 0 15px 0;
    }
  }
</style>
