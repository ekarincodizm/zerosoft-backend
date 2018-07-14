<template>
  <div id="content">
    <div class="header col-md-12">
      <div class="header-inner row align-items-center">
        <div class="col left">
          <div class="title">
            {{ $t('sidebar.products') }} > {{ $route.query.pname }}
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
      <p v-if="!ready">Loading...</p>
      <pre v-if="product">
        {{ product }}
      </pre>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import sidebarModule from './../../sidebarModule'

export default {
  name: 'ProductEdit',
  data () {
    return {
      ready: false
    }
  },
  computed: mapGetters({
    loading: 'getLoading',
    error: 'getError',
    product: 'getProduct',
    sidebar: 'getSidebar',
  }),
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
    }
  },
  beforeCreate: function () {
    // clear product
    this.$store.dispatch('clearProduct')
  },
  created: async function () {
    // get product
    await this.$store.dispatch('getProduct', this.$route.query.pid)
    // set ready
    this.ready = true
  },
  beforeMount: function () {
    // init page
    this.initPage({
      section: 'app',
      name: this.$t('app.products.title')
    })
    // set sidebar ui
    sidebarModule.init(this.getObject(require('../sidebar.json')))
    sidebarModule.update(this.sidebar, 0, [{
      "name": this.$route.query.pname,
      "router": {
        "name": "ProductEdit"
      },
      "activeClass": 'active'
    }], {
      sidebarAtIdx: 0,
      submenuAtIdx: 2
    })
  },
  mounted: function () {

  },
  destroyed: function() {
    this.leavePage(this.$Progress, ['clearProduct'])
  }
}
</script>
