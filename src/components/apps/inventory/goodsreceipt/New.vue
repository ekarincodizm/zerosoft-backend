<template>
  <div id="content">
    <div class="header col-md-12">
      <div class="header-inner row align-items-center">
        <div class="col left">
          <div class="title">
            {{ $t('sidebar.goodsreceipt') }} > {{ $t('sidebar.create') }}
          </div>
        </div>
      </div>
    </div>

    <div class="content col-md-12">
      <p v-if="!ready">{{ $t('message.loading') }}</p>
      <template v-if="ready">
        <section>
          <div class="col-md-12 no-padding">
            <section-header :title="$t('message.vendor')+'/'+$t('message.partner')" :subtitle="$t('message.refgrcode')+' ' + nextGrCode"></section-header>
            <div class="row">
              <div class="col-md-12">
                <div class="form-group row">
                  <div class="col-md-12">
                    <label>{{ $t('message.storecompanyperson') }}</label>
                    <selectize
                      @pick="onPickedVendor"
                      @add="onAddedVendor"
                      v-model="pickedVendorId"
                      :default="defaultVendorId"
                      :updateoption="updateOptionVendor"
                      :options="optionVendors"
                      :multiple="false"
                      :create="true"
                      :loading="loadingVendor"
                      :placeholder="$t('placeholder.selectorcreate')"></selectize>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group row">
                  <div class="col-md-12">
                    <label>{{ $t('message.refpo') }}</label>
                    <input type="text" class="form-control" placeholder="PO003">
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group row">
                  <div class="col-md-12">
                    <label>{{ $t('message.scheduled_at') }}</label>
                    <v-date-picker
                      mode="single"
                      popoverVisibility="focus"
                      :formats="formats"
                      v-model="selectedDate"
                      >
                    </v-date-picker>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div class="col-md-12 no-padding">
            <section-header :title="$t('message.product')"></section-header>
            <div class="row">
              <div class="col-md-12">
                <div class="form-group row">
                  <div class="col-md-12">
                    <section-title :title="$t('message.addremoveitem')"></section-title>
                    <selectize
                      @pick="onPickedSku"
                      @add="onAddedSku"
                      @remove="onRemoveSku"
                      v-model="pickedSkuId"
                      :updateoption="updateOptionSkus"
                      :options="optionSkus"
                      :multiple="true"
                      :create="true"
                      :loading="loadingSkus"
                      :validation="trickValidationSkus"
                      :placeholder="$t('placeholder.selectorcreate')"></selectize>
                  </div>
                </div>
              </div>
            </div>
            <div class="row" v-if="addedItemList.length > 0">
              <div class="col-md-12">
                <div class="form-group row" style="margin-bottom: 0;">
                  <div class="col-md-12">
                    <section-title :title="$t('message.productlist')+' (' + addedItemList.length + ')'"></section-title>

                    <div class="col-md-12 no-padding" v-for="(data, index) in addedItemList">
                      <div class="row" style="margin-bottom: 12px;">
                        <div class="col-12">
                          <span style="margin-right: 10px;">{{ data.item }}</span>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-lg-6">
                          <div class="input-group mb-3">
                            <div class="input-group-prepend">
                              <span class="input-group-text text-lowercase">{{ $t('message.initialdemand') }}</span>
                            </div>
                            <input type="text" class="form-control text-right text-select-all" placeholder="0" v-model="addedItemList[index].quantity">
                          </div>
                        </div>
                      </div>
        						</div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div class="col-md-12 no-padding">
            <section-header :title="$t('message.stockto')"></section-header>
            <div class="row">
              <div class="col-md-12">
                <div class="form-group row">
                  <div class="col-md-12">
                    <selectize
                      :options="optionWarehouses"
                      v-model="pickedWarehouseId"
                      :updateoption="updateOptionWarehouse"
                      :default="defaultWarehouseId"
                      :multiple="false"
                      :create="false"
                      placeholder=""></selectize>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="form-group row">
                  <div class="col-md-12">
                    <textarea class="form-control" :placeholder="$t('placeholder.note')" v-model="note"></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="action-bar">
          <div class="col-md-12" v-if="!$store.state.app.loading">
            <div class="btn-group">
              <button type="button"
                      class="btn btn-web"
                      @click="save()">{{ $t('button.save') }}</button>
              <button type="button"
                      class="btn btn-web dropdown-toggle dropdown-toggle-split"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false">
                <span class="sr-only">Toggle Dropdown</span>
              </button>
              <div class="dropdown-menu">
                <a class="dropdown-item"
                   @click="save()">{{ $t('button.save') }}</a>
                <a class="dropdown-item"
                   @click="save({isCreateAnother: true})">{{ $t('button.saveandcreateanother') }}</a>
              </div>
            </div>
            <button class="btn btn-light btn-block-mobile-only"
                    @click="clearForm()">{{ $t('button.cancel') }}</button>
          </div>
          <div class="col-md-12" v-if="$store.state.app.loading">
            <div class="btn-group">
              <button type="button"
                      class="btn btn-web"
                      disabled><i class="fas fa-spinner spin"></i></button>
              <button type="button"
                      class="btn btn-web dropdown-toggle dropdown-toggle-split"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                      disabled>
                <span class="sr-only">Toggle Dropdown</span>
              </button>
              <div class="dropdown-menu">
              </div>
            </div>
            <button class="btn btn-light btn-block-mobile-only" disabled>{{ $t('button.cancel') }}</button>
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
  name: 'GoodsReceiptNew',
  data () {
    return {
      ready: false,

      pickedWarehouseId: null,
      defaultWarehouseId: null,
      optionWarehouses: [],
      updateOptionWarehouse: null,

      addedItemList: [],

      productsAvailable: [],

      pickedSkuId: [],
      optionSkus: [],
      updateOptionSkus: null,
      loadingSkus: false,
      trickValidationSkus: 0,

      pickedVendorId: null,
      defaultVendorId: null,
      optionVendors: [],
      updateOptionVendor: null,
      loadingVendor: false,

      note: null,
      selectedDate: new Date(),
      formats: {
        title: 'MMMM YYYY',
        weekdays: 'WWW',
        navMonths: 'MMM',
        input: ['DD/MM/YYYY'], // Only for `v-date-picker`
        dayPopover: 'DD/MM/YYYY', // Only for `v-date-picker`
      }
    }
  },
  computed: mapGetters({
    loading: 'getLoading',
    error: 'getError',
    warehouses: 'getWarehouses',
    sidebar: 'getSidebar',
    products: 'getProducts',
    vendor: 'getVendor',
    vendors: 'getVendors',
    nextGrCode: 'getNextGrCode'
  }),
  methods: {
    onPickedSku (value) {
      console.log('onPickedSku:' + value)
      let sku_id = value
      let sku = this.getSku(sku_id)
      if(sku) {
        this.addItem({
          item: sku.product_name,
          sku_id: sku.sku_id,
          quantity: 0
        })
      }
    },
    async onAddedSku (value) {
      console.log('onAddedSku:' + value)

      // show loading selectize
      this.loadingSkus = true

      let data = {
        product_name: value,
        type: 'product',
        stock_tracking: true
      }

      let res = await this.$store.dispatch('insertProduct', data)

      console.log(res)

      if(res.success)
      {
        let product = res.data

        // get products, refresh
        await this.$store.dispatch('getProducts')

        // update option skus
        this.updateOptionSkus = {
          text: value,
          value: product.prices[0].sku_id,
          picked: true
        }

        // finish loading
        this.showFinish(this.$Progress)
        // hide loading selectize
        this.loadingSkus = false
      }
    },
    onRemoveSku (value) {
      console.log('onRemoveSku:' + value)
      let sku_id = value
      for(let i in this.addedItemList) {
        let item = this.addedItemList[i]
        if(item.sku_id == sku_id) {
          this.addedItemList.splice(i, 1)
        }
      }
    },
    onPickedVendor (value) {
      console.log('onPickedVendor: ' + value)
    },
    async onAddedVendor(value) {
      console.log('onAddedVendor: ' + value)

      // show loading selectize
      this.loadingVendor = true

      // insert new vendor
      let res = await this.$store.dispatch('insertVendor', {
        name: value
      })
      if(res.success) {
        let vendor = res.data
        // update option value
        this.updateOptionVendor = {
          text: value,
          value: vendor.vendor_id,
          picked: true
        }
        // finish loading
        this.showFinish(this.$Progress)
        // hide loading selectize
        this.loadingVendor = false
      }
    },
    async clearForm () {

      this.ready = false

      this.selectedDate = new Date()
      this.addedItemList = []
      this.note = ''

      // get next grcode
      await this.$store.dispatch('getNextGrCode', {
        warehouse_id: this.defaultWarehouseId,
        short_name: this.getWhSortName(this.defaultWarehouseId)
      })

      this.ready = true

      // scroll to top
      $("html, body").animate({ scrollTop: 0 }, "slow")
    },
    async save (option = {}) {

      // trickValidationSkus to validate selectize
      this.trickValidationSkus++

      if(this.addedItemList.length == 0) {
        // scroll to top
        $("html, body").animate({ scrollTop: 0 }, "slow")
        return
      }
      let data = {
      	orders: this.addedItemList,
      	stockin: {
      		warehouse_id: this.pickedWarehouseId,
      		short_name: this.getWhSortName(this.pickedWarehouseId)
      	},
      	note: this.note,
      	po_id: null,
        vendor_id: this.pickedVendorId,
        scheduled_at: this.selectedDate.toISOString()
      }

      for(let i in data.orders) {
        let order = data.orders[i]
        let sku_id = order.sku_id
        let warehouse_id = data.stockin.warehouse_id
        for(let j in this.products) {
          let product = this.products[j]
          for(let k in product.prices) {
            let price = product.prices[k]
            if(price.sku_id == sku_id) {
              for(let l in price.stocks) {
                let stock = price.stocks[l]
                if(stock.warehouse_id == warehouse_id) {
                  order['stock_id'] = stock.stock_id
                  order['warehouse_id'] = warehouse_id
                }
              }
            }
          }
        }
      }

      // console.log(data)
      // this.clearForm()
      // return

      // save data
      const res = await this.$store.dispatch('insertGoodsreceipt', data)

      console.log(res)

      if(res.success)
      {
        let gr_code = res.data.goodsreceipt.gr_code

        // show notify
        this.notify(this.$vs, {
          text: this.$t('message.hasbeencreated', { msg: gr_code }),
          color:'success',
          icon: 'cloud'
        })

        if(!option.isCreateAnother) {
          // go to GoodsIssueAll page
          return this.$router.push({ name: "GoodsReceiptAll"})
        } else {
          this.clearForm()
        }
      }
    },
    setOptionWarehouses () {
      if(this.warehouses.length > 0) {
        var primary_id
        for(let i in this.warehouses) {
          if(this.warehouses[i].primary) {
            primary_id = this.warehouses[i].warehouse_id
          }
          this.optionWarehouses.push({
            text: this.warehouses[i].warehouse_name,
            value: this.warehouses[i].warehouse_id
          })
        }
        this.defaultWarehouseId = primary_id
      }
    },
    setOptionSkus () {
      for(let i in this.productsAvailable) {
        let item = this.productsAvailable[i]
        this.optionSkus.push({
          text: item.product_name,
          value: item.sku_id
        })
      }
    },
    getSku (sku_id) {
      for(let i in this.productsAvailable) {
        let item = this.productsAvailable[i]
        if(item.sku_id == sku_id) {
          return item
        }
      }
      return null
    },
    addItem (option) {
      let found = false
      for(let i in this.addedItemList) {
        let item = this.addedItemList[i]
        if(item.sku_id == option.sku_id) {
          found = true
        }
      }
      console.log('found: ' + found)
      if(!found) {
        this.addedItemList.push(option)
      }
    },
    getWhSortName (warehouse_id) {
      for(let i in this.warehouses) {
        let item = this.warehouses[i]
        if(item.warehouse_id == warehouse_id) {
          return item.short_name
        }
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
    ready: function(isReady) {
      if(isReady) {
        // loading finish
        this.showFinish(this.$Progress)
        // set option skus
        this.setOptionSkus()
        // set option warehouses
        if(this.warehouses.length > 0)
        {
          this.setOptionWarehouses()
        }
      }
    },
    warehouses: function(newVal, oldVal) {
      sidebarModule.init(this.getObject(require('../sidebar.json')))
      sidebarModule.update(this.sidebar, 1, submenuModule.getWarehouses(this.warehouses))
      sidebarModule.active({
        sidebarAtIdx: 3,
        submenuAtIdx: 1
      })
      this.setOptionWarehouses()
    },
    products: function() {
      this.productsAvailable = []
      for(let i in this.products) {
        let product = this.products[i]
        for(let j in product.prices) {
          let price = product.prices[j]
          if(price.stocks.length > 0) {
            if(price.stocks[0].is_enabled) {
              this.productsAvailable.push({
                product_name: this.getProductFullName(product.product_name, price.attributes),
                sku_id: price.sku_id,
                unit: product.unit
              })
            }
          }
        }
      }
    },
    vendors: function(after, before) {
      for(let i in after) {
        let vendor = after[i]
        this.optionVendors.push({
          text: vendor.vendor_name,
          value: vendor.vendor_id
        })
      }
    },
    addedItemList: {
      handler: function(newValue) {
        for(let i in this.addedItemList) {
          let item = this.addedItemList[i]
          item.quantity = parseFloat(item.quantity)
        }
      },
      deep: true
    },
    async pickedWarehouseId (after, before) {
      // get next grcode
      await this.$store.dispatch('getNextGrCode', {
        warehouse_id: this.pickedWarehouseId,
        short_name: this.getWhSortName(this.pickedWarehouseId)
      })
      // loading finish
      this.showFinish(this.$Progress)
    },
    selectedDate: function (after, before) {

    }
  },
  beforeCreate: function () { // clear states
    // clear products
    this.$store.dispatch('clearProducts')
  },
  created: async function () { // call api to get data and set state
    // get warehouses
    if(this.warehouses.length == 0) {
      await this.$store.dispatch('getWarehouses')
    }
    // get products
    await this.$store.dispatch('getProducts')
    // get vendors
    await this.$store.dispatch('getVendors')
    // ready
    this.ready = true
  },
  beforeMount: function() { // set states ui
    // init page
    this.initPage({
      section: 'app',
      name: this.$t('app.inventory.title')
    })
    // set sidebar ui
    sidebarModule.init(this.getObject(require('../sidebar.json')))
    sidebarModule.update(this.sidebar, 1, submenuModule.getWarehouses(this.warehouses))
    sidebarModule.active({
      sidebarAtIdx: 3,
      submenuAtIdx: 1
    })
  },
  mounted: function () { // run script

  },
  updated: function () { // re-rendered html

  },
  destroyed: function() { // leave this page
    this.leavePage(this.$Progress, ['clearVendor', 'clearVendors'])
  }
}
</script>
