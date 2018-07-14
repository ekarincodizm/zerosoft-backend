<template>
  <div id="content">
    <div class="header col-md-12">
      <div class="header-inner row align-items-center">
        <div class="col-md-4 left">
          <div class="title">
            {{ $t('sidebar.goodsissue') }} > {{ $t('sidebar.create') }}
          </div>
        </div>
        <div class="col-md-8 right">
          <div class="action" v-if="goodsissue !== null">
            <div class="dropdown item" v-if="goodsissue.status == 'padding'">
              <button class="btn no-bg dropdown-toggle text-secondary" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-pencil-alt"></i>
                <span class="name">{{ $t('button.edit') }}</span>
              </button>
              <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                <a class="dropdown-item" @click="edited = true">
                  <span class="text-secondary">{{ $t('button.edit') }}</span>
                </a>
                <a class="dropdown-item" @click="openConfirmdeleteModal()">
                  <span class="text-danger">{{ $t('button.delete') }}</span>
                </a>
              </div>
            </div>
            <div class="dropdown nodro item">
              <button class="btn no-bg text-secondary" type="button">
                <i class="fas fa-envelope"></i>
                <span class="name">{{ $t('button.sendemail') }}</span>
              </button>
            </div>
            <div class="dropdown item">
              <button class="btn no-bg dropdown-toggle text-secondary" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-download"></i>
                <span class="name">{{ $t('button.download') }}</span>
              </button>
              <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                <a class="dropdown-item">
                  <span class="text-secondary">Excel</span>
                </a>
                <a class="dropdown-item">
                  <span class="text-secondary">CSV</span>
                </a>
              </div>
            </div>
            <div class="dropdown nodro item">
              <button class="btn no-bg text-secondary" type="button">
                <i class="fas fa-download"></i>
                <span class="name">{{ $t('button.print') }}</span>
              </button>
            </div>
            <div class="dropdown item" v-if="goodsissue.status == 'padding'">
              <button class="btn no-bg dropdown-toggle text-warning" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="far fa-circle"></i>
                <span class="name">{{ $t('button.paddingdelivery') }}</span>
              </button>
              <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                <a class="dropdown-item" @click="openReceivedorderModal()">
                  <i class="far fa-check-circle text-success"></i>
                  <span class="text-success">{{ $t('button.deliveredorder') }}</span>
                </a>
              </div>
            </div>
            <div class="dropdown item" v-if="goodsissue.status == 'done'">
              <button class="btn no-bg text-success" type="button">
                <i class="far fa-check-circle text-success"></i>
                <span class="text-success">{{ $t('button.deliveredorder') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="content col-md-12">
      <p v-if="!ready">Loading...</p>

      <!-- <pre>{{ goodsissue }}</pre> -->

      <template v-if="ready && !edited">
        <section>
          <div class="col-md-12 no-padding">
            <section-header :title="$t('message.customer')+'/'+$t('message.partner')" :subtitle="$t('message.refgrcode')+' ' +goodsissue.gi_code"></section-header>
            <div class="row">
              <div class="col-md-12">
                <div class="form-group row">
                  <div class="col-md-12">
                    <label>{{ $t('message.storecompanyperson') }}</label>
                    <template v-if="!goodsissue.customer">
                      <input type="text" class="form-control" disabled>
                    </template>
                    <template v-if="goodsissue.customer">
                      <input type="text" class="form-control" disabled :value="goodsissue.customer.customer_name">
                    </template>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group row">
                  <div class="col-md-12">
                    <label>{{ $t('message.refpo') }}</label>
                    <input type="text" class="form-control" disabled>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group row">
                  <div class="col-md-12">
                    <label>{{ $t('message.scheduled_at') }}</label>
                    <input type="text" class="form-control" disabled :value="getDate(goodsissue.scheduled_at)">
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
                <div class="form-group row" style="margin-bottom: 0;">
                  <div class="col-md-12">
                    <section-title :title="$t('message.productlist')+' (' + getCount(goodsissue.orders) + ')'"></section-title>
                    <div class="col-md-12 no-padding" v-for="(data, index) in goodsissue.orders">
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
                            <input type="text" class="form-control text-right text-select-all" disabled :value="data.quantity">
                          </div>
                        </div>
                        <div class="col-lg-6">
                          <div class="input-group mb-3">
                            <div class="input-group-prepend">
                              <span class="input-group-text text-lowercase">{{ $t('message.donedelivery') }}</span>
                            </div>
                            <input
                              type="text"
                              class="form-control text-right text-select-all text-success"
                              disabled
                              :value="data.done"
                              v-if="data.done >= data.quantity">
                            <input
                              type="text"
                              class="form-control text-right text-select-all text-danger"
                              disabled
                              :value="data.done"
                              v-if="data.done < data.quantity">
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
            <section-header :title="$t('message.stockout')"></section-header>
            <div class="row">
              <div class="col-md-12">
                <div class="form-group row">
                  <div class="col-md-12">
                    <input type="text" class="form-control" disabled :value="getWhFullName(goodsissue.stockout.warehouse_id)">
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="form-group row">
                  <div class="col-md-12">
                    <textarea class="form-control" disabled v-model="goodsissue.note"></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </template>

      <template v-if="ready && edited">
        <section>
          <div class="col-md-12 no-padding">
            <section-header :title="$t('message.customer')+'/'+$t('message.partner')" :subtitle="$t('message.refgrcode')+' ' +goodsissue.gi_code"></section-header>
            <div class="row">
              <div class="col-md-12">
                <div class="form-group row">
                  <div class="col-md-12">
                    <label>{{ $t('message.storecompanyperson') }}</label>
                    <selectize
                    @pick="onPickedCustomer"
                    @add="onAddedCustomer"
                    v-model="pickedCustomerId"
                    :default="defaultCustomerId"
                    :updateoption="updateOptionCustomer"
                    :options="optionCustomers"
                    :multiple="false"
                    :create="true"
                    :loading="loadingCustomer"
                    :disabled="false"
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
                    <input type="text" class="form-control">
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group row">
                  <div class="col-md-12">
                    <label>{{ $t('message.scheduled_at') }}</label>
                    <!-- <input type="text" class="form-control" :value="getDate(goodsissue.scheduled_at)"> -->
                    <v-date-picker
                      mode="single"
                      popoverVisibility="focus"
                      :formats="formats"
                      v-model="scheduled_at"
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
                    @add="onAddedSku"
                    @pick="onPickedSku"
                    @remove="onRemoveSku"
                    v-model="pickedSkuId"
                    :updateoption="updateOptionSkus"
                    :options="optionSkus"
                    :default="defaultSkuId"
                    :multiple="true"
                    :create="true"
                    :loading="loadingSkus"
                    :validation="trickValidationSkus"
                    :disabled="false"
                    :placeholder="$t('placeholder.selectorcreate')"></selectize>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
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
            <section-header :title="$t('message.stockout')"></section-header>
            <div class="row">
              <div class="col-md-12">
                <div class="form-group row">
                  <div class="col-md-12">
                    <selectize :options="optionWarehouses" v-model="pickedWarehouseId" :default="defaultWarehouseId" :multiple="false" :create="false" :disabled="true"></selectize>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="form-group row">
                  <div class="col-md-12">
                    <textarea class="form-control" v-model="note"></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style="background: #F5F5F5;border-top: solid 1px #D8E2E7;padding: 25px 0px 25px 0px;">
          <div class="col-md-12" v-if="!$store.state.app.loading">
            <button class="btn btn-web" @click="update()">{{ $t('button.edit') }}</button>
            <button class="btn btn-light btn-block-mobile-only" @click="edited = false">{{ $t('button.cancel') }}</button>
          </div>
          <div class="col-md-12" v-if="$store.state.app.loading">
            <button class="btn btn-web" disabled>
              <i class="fas fa-spinner spin"></i>
            </button>
            <button class="btn btn-light btn-block-mobile-only" disabled>{{ $t('button.cancel') }}</button>
          </div>
        </section>
      </template>

    </div>
    <!-- END CONTENT -->

    <!-- POPUP MODALS -->
    <div class="modal fade bd-example-modal-lg" id="doneModal" tabindex="-1" role="dialog" aria-labelledby="pricesModalTitle" aria-hidden="true" data-keyboard="false" data-backdrop="static">
  		<div class="modal-dialog modal-lg" role="document">
  			<div class="modal-content">
  				<div class="modal-header">
  					<h5 class="modal-title">{{ $t('message.deliveredorder_header') }}</h5>
  					<button type="button" class="close" data-dismiss="modal" aria-label="Close" v-if="!$store.state.app.loading">
  						<span aria-hidden="true">&times;</span>
  					</button>
  				</div>
  				<div class="modal-body">
            <section>
  						<section-title :title="$t('message.productlist')+ ' ('+doneOrders.length+')'"></section-title>
              <div class="col-md-12 no-padding" v-for="(data, index) in doneOrders">
                <div class="row" style="margin-bottom: 12px;">
                  <div class="col-12">
                    <span style="margin-right: 10px;">{{ data.item }}</span>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <div class="input-group mb-3">
                      <div class="input-group-prepend">
                        <span class="input-group-text text-lowercase">{{ $t('message.initialdemand') }}</span>
                      </div>
                      <input type="text" class="form-control text-right" disabled :value="data.quantity">
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="input-group mb-3">
                      <div class="input-group-prepend">
                        <span class="input-group-text text-lowercase">{{ $t('message.donedelivery') }}</span>
                      </div>
                      <input type="number" @change="checkReceivedNumber(doneOrders[index])" @keyup="checkReceivedNumber(doneOrders[index])" class="form-control text-right text-select-all textfield-done" placeholder="0" v-model="doneOrders[index].done">
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-12 no-padding">
                <textarea class="form-control" :placeholder="$t('message.note')" v-model="note"></textarea>
              </div>
  					</section>
            <section v-if="showBackOrderHTML">
  						<section-title title="แจ้งเตือน"></section-title>
              <div class="col-md-12 no-padding">
                <div class="row" style="margin-bottom: 12px;">
                  <div class="col-12">
                    <p>{{ $t('message.backorderdetail') }} <a href="#" target="_blank">{{  $t('button.learnmore') }} <i class="fas fa-external-link-alt"></i></a>่</p>
                    <template v-for="(data, index) in doneOrders">
                    <p class="text-danger" v-if="data.done < data.quantity">
                      {{ data.item }} {{  $t('message.missingcount') }} "{{ data.quantity-data.done }}"
                    </p>
                    </template>
                  </div>
                  <div class="col-12">
                    <vs-checkbox vs-color="success" style="float: left;margin: 0;" v-model="checkboxBackOrder">{{  $t('message.createbackorderauto') }}</vs-checkbox>
                  </div>
                </div>
              </div>
  					</section>
  				</div>
  				<div class="modal-footer" v-if="!$store.state.app.loading">
  					<button type="button" class="btn btn-light" data-dismiss="modal">{{ $t('button.cancel') }}</button>
  					<button type="button" class="btn btn-web" @click="done()">{{ $t('button.confirm') }}</button>
  				</div>
          <div class="modal-footer" v-if="$store.state.app.loading">
  					<button type="button" class="btn btn-light" data-dismiss="modal" disabled>{{ $t('button.cancel') }}</button>
  					<button type="button" class="btn btn-web" disabled>
              <i class="fas fa-spinner spin"></i>
            </button>
  				</div>
  			</div>
  		</div>
  	</div>

    <div class="modal fade " id="confirmdeleteModal" tabindex="-1" role="dialog" aria-labelledby="pricesModalTitle" aria-hidden="true" data-keyboard="false" data-backdrop="static">
      <div class="modal-dialog " role="document">
        <div class="modal-content">
          <div class="modal-header" style="border-bottom: none;">
            <h5 class="modal-title">
              {{ $t('message.areyousuretodeletethis') }}
            </h5>
            <button type="button" class="close" @click="closeConfirmdeleteModal()" aria-label="Close" v-if="!$store.state.app.loading">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-footer" v-if="!$store.state.app.loading">
            <button type="button" class="btn btn-light" @click="closeConfirmdeleteModal()">{{ $t('button.cancel') }}</button>
            <button type="button" class="btn btn-danger" @click="del()">{{ $t('button.delete') }}</button>
          </div>
          <div class="modal-footer" v-if="$store.state.app.loading">
            <button type="button" class="btn btn-light" disabled>{{ $t('button.cancel') }}</button>
            <button type="button" class="btn btn-danger" disabled>
              <i class="fas fa-spinner spin"></i>
            </button>
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
  name: 'GoodsIssueEdit',
  data () {
    return {
      pickedWarehouseId: null,
      defaultWarehouseId: null,
      optionWarehouses: [],

      addedItemList: [],
      doneOrders: [],
      productsAvailable: [],

      pickedSkuId: [],
      defaultSkuId: [],
      optionSkus: [],
      updateOptionSkus: null,
      loadingSkus: false,
      trickValidationSkus: 0,

      pickedCustomerId: null,
      defaultCustomerId: null,
      optionCustomers: [],
      updateOptionCustomer: null,
      loadingCustomer: false,

      scheduled_at: null,
      formats: {
        title: 'MMMM YYYY',
        weekdays: 'WWW',
        navMonths: 'MMM',
        input: ['DD/MM/YYYY'], // Only for `v-date-picker`
        dayPopover: 'DD/MM/YYYY', // Only for `v-date-picker`
      },
      note: null,
      edited: false,
      checkboxBackOrder: true,
      showBackOrderHTML: false,
      ready: false
    }
  },
  computed: mapGetters({
    loading: 'getLoading',
    error: 'getError',
    warehouses: 'getWarehouses',
    sidebar: 'getSidebar',
    products: 'getProducts',
    goodsissue: 'getGoodsissue',
    customers: 'getCustomers'
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
    onPickedCustomer (value) {
      console.log('onPickedCustomer: ' + value)
    },
    async onAddedCustomer(value) {
      console.log('onAddedCustomer: ' + value)

      // show loading selectize
      this.loadingCustomer = true

      // insert new customer
      let res = await this.$store.dispatch('insertCustomer', {
        name: value
      })
      if(res.success) {
        let customer = res.data
        // update option value
        this.updateOptionCustomer = {
          text: value,
          value: customer.customer_id,
          picked: true
        }
        // finish loading
        this.showFinish(this.$Progress)
        // hide loading selectize
        this.loadingCustomer = false
      }
    },
    async update () {
      // trickValidationSkus to validate selectize
      this.trickValidationSkus++

      if(this.addedItemList.length == 0) {
        // scroll to top
        $("html, body").animate({ scrollTop: 0 }, "slow")
        return
      }
      let data = {
        gi_id: this.goodsissue.gi_id,
      	orders: this.addedItemList,
      	stockout: {
      		warehouse_id: this.pickedWarehouseId,
      		short_name: this.getWhSortName(this.pickedWarehouseId)
      	},
      	note: this.note,
      	po_id: null,
        customer_id: this.pickedCustomerId,
        scheduled_at: this.scheduled_at.toISOString()
      }

      for(let i in data.orders) {
        let order = data.orders[i]
        let sku_id = order.sku_id
        let warehouse_id = data.stockout.warehouse_id
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

      // we dont need stockout
      delete data['stockout']

      // console.log(data)
      // return;

      // save data
      const res = await this.$store.dispatch('updateGoodsissue', data)

      if(res.success)
      {
        let gi_code = this.goodsissue.gi_code
        // get goodsissue
        await this.$store.dispatch('getGoodsissue', {
          gi_id: this.goodsissue.gi_id
        })
        // show notify
        this.notify(this.$vs, {
          text: this.$t('message.hasbeenupdated', { msg: gi_code }),
          color:'success',
          icon: 'cloud'
        })
        // finish loading
        this.showFinish(this.$Progress)
        // done editing
        this.edited = false
        // set default selectize customer
        this.setDefaultCustomer()
        // scroll to top
        $("html, body").animate({ scrollTop: 0 }, "slow");
      } else {
        console.log('update data failed')
      }
    },
    async done () {
      let data = {
        	"gi_id": this.goodsissue.gi_id,
          "gi_code": this.goodsissue.gi_code,
          "note": this.note,
        	"orders": []
      }

      for(let i in this.doneOrders) {
        let item = this.doneOrders[i]
        data.orders.push({
          gio_id: item.gio_id,
          sku_id: item.sku_id,
          stock_id: item.stock_id,
          warehouse_id: item.warehouse_id,
          quantity: item.quantity,
          done: item.done
        })
      }

      // console.log(data)
      // return

      let res = await this.$store.dispatch('doneGoodsissue', data)

      if(res.success) {
        // get goodsissue
        await this.$store.dispatch('getGoodsissue', {
          gi_id: this.$route.query.gi_id
        })
        // close modal
        this.closeReceivedorderModal()
        // finish loading
        this.showFinish(this.$Progress)
        // show notify
        this.notify(this.$vs, {
          text: this.$t('message.donegoodsissue', { msg: this.goodsissue.gi_code }),
          color:'success',
          icon: 'cloud'
        })
      }
    },
    async del () {
      let data = {
        gi_id: this.goodsissue.gi_id
      }

      let res = await this.$store.dispatch('deleteGoodsissue', data)

      if(res.success) {
        // show notify
        this.notify(this.$vs, {
          text: this.$t('message.goodsissuehasbeendeletd', { msg: this.goodsissue.gi_code }),
          color:'danger',
          icon: 'delete'
        })
        // finish loading
        this.showFinish(this.$Progress)
        // close modal
        this.closeConfirmdeleteModal()
        // go to GoodsIssueAll page
        return this.$router.push({ name: "GoodsIssueAll"})
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
    getGroId (sku_id) {
      for(let i in this.goodsissue.orders) {
        let item = this.goodsissue.orders[i]
        if(item.sku_id == sku_id) {
          return item.sku_id
        }
      }
      return null
    },
    getWhFullName (warehouse_id) {
      for(let i in this.warehouses) {
        let item = this.warehouses[i]
        if(item.warehouse_id == warehouse_id) {
          return item.warehouse_name
        }
      }
    },
    getWhSortName (warehouse_id) {
      for(let i in this.warehouses) {
        let item = this.warehouses[i]
        if(item.warehouse_id == warehouse_id) {
          return item.short_name
        }
      }
    },
    getCount (arr) {
      if(arr) return arr.length
      return 0
    },
    setDefaultWarehouse () {
      this.defaultWarehouseId = this.goodsissue.stockout.warehouse_id
    },
    setDefaultCustomer () {
      if(this.goodsissue.customer) {
        this.defaultCustomerId = this.goodsissue.customer.customer_id
      } else {
        this.defaultCustomerId = null
      }
    },
    openReceivedorderModal () {
      this.edited = false
      this.note = this.goodsissue.note
      this.showBackOrderHTML = false
      this.doneOrders = []
      for(let i in this.goodsissue.orders) {
        let data = this.goodsissue.orders[i]
        this.doneOrders.push({
          gio_id: data.gio_id,
          sku_id: data.sku_id,
          stock_id: data.stock_id,
          warehouse_id: data.warehouse_id,
          item: data.item,
          quantity: data.quantity,
          done: data.quantity
        })
      }
      $('#doneModal').modal('show')

      setTimeout(()=>{
        $('.textfield-done').removeClass('text-success text-danger')
        $('.textfield-done').addClass('text-success')
      }, 100)
    },
    closeReceivedorderModal () {
      $('#doneModal').modal('hide')
    },
    openConfirmdeleteModal () {
      $('#confirmdeleteModal').modal('show')
    },
    closeConfirmdeleteModal () {
      $('#confirmdeleteModal').modal('hide')
    },
    checkReceivedNumber (order) {
      let t = this
      let found = false
      for(let i in this.doneOrders) {
        let data = this.doneOrders[i]
        if(data.done < data.quantity) {
          found = true
        }
      }

      this.showBackOrderHTML = found

      $('.textfield-done').each(function(i){
        let done = parseFloat($(this).val())
        let qty = parseFloat(t.doneOrders[i].quantity)
        $(this).removeClass('text-danger text-success')
        if(done < qty) {
          $(this).addClass('text-danger')
        } else {
          $(this).addClass('text-success')
        }
      })
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
    ready: function(newVal, oldVal) {
      if(this.$route.query.modal == 'received-orders' && this.goodsissue.status == 'padding') {
        setTimeout(()=>{
          this.openReceivedorderModal()
        }, 500)
      }
      this.setDefaultWarehouse()
      this.setOptionWarehouses()
      this.setDefaultCustomer()
      this.setOptionSkus()

      // finish loading
      this.showFinish(this.$Progress)
    },
    warehouses: function(newVal, oldVal) {
      sidebarModule.init(this.getObject(require('../sidebar.json')))
      sidebarModule.update(this.sidebar, 1, submenuModule.getWarehouses(this.warehouses))
      sidebarModule.update(this.sidebar, 4, [{
        "name": this.$route.query.gi_code,
        "router": {
          "name": "GoodsIssueEdit",
          "query": {
            "gi_id": this.$route.query.gi_id,
            "gi_code": this.$route.query.gi_code
          }
        },
        "activeClass": ""
      }], {
        sidebarAtIdx: 4,
        submenuAtIdx: 2
      })

      this.setOptionWarehouses()
    },
    products: function(after, before) {
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
    goodsissue: function(after, before) {

    },
    edited: function(after, before) {

      this.scheduled_at = new Date(this.goodsissue.scheduled_at)
      this.note = this.goodsissue.note

      if(this.edited) {
        let sku_ids = []

        for(let i in this.goodsissue.orders) {
          sku_ids.push(this.goodsissue.orders[i].sku_id)
        }

        this.defaultSkuId = sku_ids

        setTimeout(()=>{

          this.addedItemList = []

          for(let i in sku_ids) {
            let sku_id = sku_ids[i]
            let sku = this.getSku(sku_id)
            this.addItem({
              item: sku.product_name,
              sku_id: sku.sku_id,
              quantity: 0
            })
          }

          for(let i in this.addedItemList) {
            this.addedItemList[i].quantity = this.goodsissue.orders[i].quantity
          }
        }, 10)
      }
    },
    doneOrders: {
      handler: function(newValue) {
        for(let i in this.doneOrders) {
          this.doneOrders[i].done = parseFloat(this.doneOrders[i].done)
        }
      },
      deep: true
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
    customers: function(after, before) {
      for(let i in after) {
        let customer = after[i]
        this.optionCustomers.push({
          text: customer.customer_name,
          value: customer.customer_id
        })
      }
    },
  },
  beforeCreate: function () { // clear states
    if(this.$route.query === undefined) {
      this.$router.push({ name: "GoodsIssueAll"})
    }
    if(this.$route.query.gi_id === undefined || this.$route.query.gi_code === undefined) {
      this.$router.push({ name: "GoodsIssueAll"})
    }
  },
  created: async function () { // call api to get data and set state
    // get warehouses
    if(this.warehouses.length == 0) {
      await this.$store.dispatch('getWarehouses')
    }

    // get goodsissue
    let res = await this.$store.dispatch('getGoodsissue', {
      gi_id: this.$route.query.gi_id
    })

    if(!res.success || res.data.length == 0) {
      return this.$router.push({ name: "GoodsIssueAll"})
    }

    // get products
    await this.$store.dispatch('getProducts')
    // get customers
    await this.$store.dispatch('getCustomers')
    // set ready
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
    sidebarModule.update(this.sidebar, 4, [{
      "name": this.$route.query.gi_code,
      "router": {
        "name": "GoodsIssueEdit",
        "query": {
          "gi_id": this.$route.query.gi_id,
          "gi_code": this.$route.query.gi_code
        }
      },
      "activeClass": ""
    }], {
      sidebarAtIdx: 4,
      submenuAtIdx: 2
    })
    // scroll to top
    $('body,html').animate({
        scrollTop: 0
    }, 100)
  },
  mounted: function () { // run script
    // set popup modal
    this.setModal('#doneModal')
    this.setModal('#confirmdeleteModal')
  },
  updated: function () { // re-rendered html

  },
  destroyed: function() { // leave this page
    this.leavePage(this.$Progress, ['clearGoodsissue', 'clearProducts'])
  }
}
</script>

<style scoped>
  #content .header-inner .right .action .item {
    float: right;
    border-left: solid 1px #D8E2E7;
    padding: 0 10px 0 10px;
  }
  #content .header-inner .right .action .item:first-of-type {
    padding-right: 0;
  }
  #content .header-inner .right .action .item:last-of-type {
    border-left: none;
  }
  #content .header-inner .right .action .item button {
    padding-top: 0;
    padding-bottom: 0;
  }
</style>
