<template>
  <div id="content">
    <div class="header col-md-12">
      <div class="header-inner row align-items-center">
        <div class="col-md-8 left">
          <div class="title">
              {{ $t('sidebar.configuration') }} > {{ $t('sidebar.assignitems') }}
          </div>
        </div>
        <div class="col-md-4 right">
          <div class="action" v-if="1">
            <div class="dropdown item">
              <button class="btn no-bg dropdown-toggle text-secondary" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-pencil-alt"></i>
                <span class="name">{{ $t('button.edit') }}</span>
              </button>
              <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                <a class="dropdown-item" @click="edited = true">
                  <span class="text-secondary">{{ $t('button.edit') }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="content col-md-12">
      <p v-if="!ready">{{ $t('message.loading') }}</p>

      <template v-if="ready && !edited">
        <section class="assign-items disabled" style="margin-bottom: 20px;" v-if="assignitems.length > 0">
          <div class="col-md-12 no-padding">
            <section-header :title="$t('message.assignitems') + ' ('+assignitems.length+')'"></section-header>
            <div class="col-md-12 row align-items-center no-padding no-margin subheader-assign">
              <div class="col no-padding">{{$t('message.productlist') }}</div>
            </div>
            <div
            class="col-md-12 row align-items-center no-padding no-margin item"
            v-for="(item, index) in items"
            v-bind:class="{ active: item.active}"
            v-if="item.active">
              <div class="col">
                {{ item.product_name }}
              </div>
            </div>
          </div>
        </section>
        <section class="mt-4" v-if="assignitems.length > 0">
          <div class="col-md-12 no-padding">
            {{ $t('message.assignitemsinventorydetail') }}
            <a href="#" target="_blank">
              {{ $t('button.learnmore') }}
              <i class="fas fa-external-link-alt"></i>
            </a>
          </div>
        </section>
      </template>

      <template v-if="ready && edited">
        <section class="assign-items" style="margin-bottom: 20px;" v-if="items.length > 0">
          <div class="col-md-12 no-padding">
            <section-header :title="$t('message.assignitems') + ' ('+assignitems.length+')'"></section-header>
            <div class="col-md-12 row align-items-end no-padding no-margin subheader-assign">
              <div class="col no-padding">{{$t('message.productlist') }}</div>
              <div class="col no-padding text-right">
                <button class="btn btn-sm" style="padding-right: 17px;padding-left: 17px;position: relative;top: -3px;" @click="state.selectall = !state.selectall">
                  Select All
                </button>
              </div>
            </div>
            <div
            class="col-md-12 row align-items-center no-padding no-margin item"
            v-for="(item, index) in items"
            v-bind:class="{ active: item.active}"
            @click="toggleAssign(item)">
              <div class="col">
                {{ item.product_name }}
              </div>
              <div class="col text-right">
                <i class="fas fa-check-circle"></i>
                <i class="far fa-circle"></i>
              </div>
            </div>
          </div>
        </section>
        <section class="mt-4">
          <div class="col-md-12 no-padding">
            {{ $t('message.assignitemsinventorydetail') }}
            <a href="#" target="_blank">
              {{ $t('button.learnmore') }}
              <i class="fas fa-external-link-alt"></i>
            </a>
          </div>
        </section>
        <section class="action-bar">
          <div class="col-md-12" v-if="!$store.state.app.loading">
            <button class="btn btn-web" @click="save()">{{ $t('button.save') }}</button>
            <button class="btn btn-light btn-block-mobile-only" @click="edited = false">{{ $t('button.cancel') }}</button>
          </div>
          <div class="col-md-12" v-if="$store.state.app.loading">
            <button class="btn btn-web" disabled>
              <i class="fas fa-spinner spin"></i>
            </button>
            <button class="btn btn-light" disabled>{{ $t('button.cancel') }}</button>
          </div>
        </section>
      </template>

    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import sidebarModule from './../../sidebarModule'
import submenuModule from '../submenuModule'

export default {
  name: 'WarehouseManagement',
  data () {
    return {
      ready: false,

      edited: false,
      updated: false,

      items: [],
      original_items: null,

      assignitems: [],
      original_assignitems: null,

      state: {
        selectall: false
      }
    }
  },
  computed: mapGetters({
    loading: 'getLoading',
    error: 'getError',
    warehouses: 'getWarehouses',
    sidebar: 'getSidebar',
    products: 'getProducts'
  }),
  methods: {
    toggleAssign (item) {
      item.active = !item.active
    },
    setItems (products) {
      this.items = []
      for(let i in products) {
        let product = products[i]
        var active = false
        let done = false
        for(let j in product.prices) {
          let sku = product.prices[j]
          for(let k in sku.stocks) {
            let stock = sku.stocks[k]
            if(stock.is_enabled && !done) {
              active = true
              done  = true
            }
          }
        }
        this.items.push({
          product_id: product.product_id,
          product_name: product.product_name,
          active: active
        })
      }
    },
    updateAssignItems (items) {
      this.assignitems = []
      for(let i in items) {
        let item  = items[i]
        if(item.active) {
          let skuIds = this.getSkuIds(item.product_id)
          var skus = []
          for(let j in skuIds) {
            skus.push({
              sku_id: skuIds[j]
            })
          }
          this.assignitems.push({
            product_id: item.product_id,
            skus: skus
          })
        }
      }
    },
    getSkuIds (product_id) {
      let skuIds = []
      for(let i in this.products) {
        let product = this.products[i]
        if(product_id == product.product_id) {
          for(let j in product.prices) {
            let sku = product.prices[j]
            skuIds.push(sku.sku_id)
          }
        }
      }
      return skuIds
    },
    async save () {

      let data = {
        assign: this.assignitems
      }

      // console.log(data)
      // return

      let res = await this.$store.dispatch('assignInventory', data)

      console.log(res)

      if(res.success) {
        // show notify
        this.notify(this.$vs, {
          text: this.$t('message.saved'),
          color:'success',
          icon: 'save'
        })
        // original items
        this.original_items = this.getObject(this.items)
        // original assignitems
        this.original_assignitems = this.getObject(this.assignitems)
        // set edited
        this.edited = false
        // set updated
        this.updated = true
        // loading finish
        this.showFinish(this.$Progress)
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
    warehouses: function (newVal, oldVal) {
      sidebarModule.init(this.getObject(require('../sidebar.json')))
      sidebarModule.update(this.sidebar, 1, submenuModule.getWarehouses(this.warehouses))
      sidebarModule.active({
        sidebarAtIdx: 5,
        submenuAtIdx: 1
      })

      // set ready
      this.ready = true
    },
    items: {
      handler: function(after) {
        let items = after
        this.updateAssignItems(items)
      },
      deep: true
    },
    edited: function (after, before) {
      if(!this.edited && !this.updated) {
        this.items = this.getObject(this.original_items)
        this.assignitems = this.getObject(this.original_assignitems)
      } else {
        this.updated = false
      }
    },
    state: {
      handler: function(value) {
        let isSelectdAllAlready = true
        for(let i in this.items) {
          if(!this.items[i].active) isSelectdAllAlready = false
        }
        for(let i in this.items) {
          this.items[i].active = !isSelectdAllAlready
        }
        // update assignitems
        this.updateAssignItems(this.items)
      },
      deep: true
    }
  },
  beforeCreate: function () {

  },
  created: async function () {
    // get warehouses
    if(this.warehouses.length == 0) {
      await this.$store.dispatch('getWarehouses')
    }
    // get products
    await this.$store.dispatch('getProducts')
    // set items
    this.setItems(this.products)
    // update assignitems
    this.updateAssignItems(this.items)
    // original items
    this.original_items = this.getObject(this.items)
    // original assignitems
    this.original_assignitems = this.getObject(this.assignitems)
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
      sidebarAtIdx: 5,
      submenuAtIdx: 1
    })
  },
  mounted: function () {

  },
  destroyed: function() {
    this.leavePage(this.$Progress, [])
  }
}
</script>

<style scoped>

</style>
