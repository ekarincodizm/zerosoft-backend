<template>
  <div id="content">
    <div class="header col-md-12">
      <div class="header-inner row align-items-center">
        <div class="col left">
          <div class="title">
            {{ $t('sidebar.stockcontrols') }} {{ '> ' + warehouse_name }}
          </div>
        </div>
        <div class="col right">
          <div class="action">
            <!-- <button class="btn btn-no-bg text-default" @click="openAdjustmentModal(null, true)">
              <i class="fas fa-redo-alt"></i>
              {{ $t('message.adjustment') }}
            </button> -->
            <!-- <button class="btn btn-no-bg text-default">
              <i class="fas fa-exchange-alt" style="font-size: 18px;"></i>
              {{ $t('message.transfer') }}
            </button> -->
          </div>
        </div>
      </div>
    </div>

    <div class="content col-md-12">
      <p v-if="!ready">{{ $t('message.loading') }}</p>
      <!-- <pre>{{ stocks }}</pre> -->
      <table id="dataTable" class="table table-bordered" v-if="ready" style="width: 100%;">
        <thead>
          <tr>
            <th>{{ $t('message.item') }}</th>
            <th class="text-center">{{ $t('message.minstock') }}</th>
            <th class="text-center">{{ $t('message.maxstock') }}</th>
            <th class="text-center">{{ $t('message.balance') }}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in stocks">
            <td>
              <template
                v-if="!checkAuth({app_id: 2})">
              {{ getProductFullName(item.product_name, item.attributes) }}
              </template>
              <router-link :to="{name: 'ProductEdit', query: {
                'pid': item.product_id,
                'pname': item.product_name
                }}"
                v-if="checkAuth({app_id: 2})">
                {{ getProductFullName(item.product_name, item.attributes) }}
              </router-link>
            </td>
            <td class="text-center">{{ getNumber(item.control.minstock) }}</td>
            <td class="text-center">{{ getNumber(item.control.maxstock) }}</td>
            <td class="text-center">{{ getNumber(item.instock) }} {{ item.unit }}</td>
            <td class="text-center">
              <div class="dropdown">
                <button class="btn no-bg dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span class="name">
                    {{ $t('message.option') }}
                  </span>
                </button>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                  <!-- <a class="dropdown-item">
                    <i class="fas fa-credit-card"></i> จัดซื้อ
                  </a> -->
                  <a class="dropdown-item" @click="openAdjustmentModal(item, false)">
                    <i class="fas fa-redo-alt"></i> {{ $t('message.adjustment') }}
                  </a>
                  <!-- <a class="dropdown-item">
                    <i class="fas fa-exchange-alt"></i> {{ $t('message.transfer') }}
                  </a> -->
                  <a class="dropdown-item" @click="openStockwarningModal(item)">
                    <i class="fas fa-cog"></i> {{ $t('message.warningstock') }}
                  </a>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="modal fade bd-example-modal-lg" id="adjustmentModal" tabindex="-1" role="dialog" aria-labelledby="pricesModalTitle" aria-hidden="true" data-keyboard="false" data-backdrop="static">
  		<div class="modal-dialog modal-lg" role="document">
  			<div class="modal-content">
  				<div class="modal-header">
  					<h5 class="modal-title">{{ $t('message.adjustment') }}</h5>
  					<button
              type="button"
              class="close"
              aria-label="Close"
              @click="closeAdjustmentModal()"
              v-if="!$store.state.app.loading">
    						<span aria-hidden="true">&times;</span>
  					</button>
  				</div>
  				<div class="modal-body">

            <section>
  						<section-title :title="$t('message.reason')"></section-title>
  						<div class="col-md-12 no-padding">
                <select id="adjustment-reson"
                        class="form-control"
                        ref="adjustment_reson"
                        v-model="adjustmentReson">
                  <option value="">--{{ $t('placeholder.select').toLowerCase() }}--</option>
                  <option value="manual recount">{{ $t('message.recount').toLowerCase() }}</option>
                  <option value="manual received">{{ $t('message.received').toLowerCase() }}</option>
                  <option value="manual loss">{{ $t('message.loss').toLowerCase() }}</option>
                  <option value="manual damage">{{ $t('message.damage').toLowerCase() }}</option>
                  <option value="manual return">{{ $t('message.return').toLowerCase() }}</option>
                </select>
  						</div>
  					</section>

            <section v-if="allowAddMore_adj">
              <section-title :title="$t('message.addremoveitem')"></section-title>
  						<div class="col-md-12 no-padding">
                <template v-if="stocks.length > 0">
                  <selectize
                    @change="onChangedSkus"
                    @pick="onPickedSkus"
                    @remove="onRemovedSkus"
                    v-model="pickedSkus"
                    :options="optionSkus"
                    :default="defaultSkus"
                    :multiple="true"
                    :create="false"
                    :validation="trickValidationSkus"
                    :placeholder="$t('placeholder.selectproduct')"></selectize>
                </template>
              </div>
  					</section>

            <section>
  						<section-title :title="$t('message.productlist')+' ('+adjustItemList.length+')'" v-if="adjustItemList.length"></section-title>
              <div class="container no-padding mb-3" v-for="(item, index) in adjustItemList">
  							<div class="col-md-12" style="background: #F5F5F5;padding: 15px 15px 0 15px;">
  								<div class="row" style="margin-bottom: 12px;">
  									<div class="col-6">{{ item.product_name }}</div>
  								</div>
  								<div class="row">
  									<div class="col-md-12">
  										<div class="input-group mb-3">
  											<div class="input-group-prepend">
  												<span class="input-group-text text-lowercase">{{ $t('message.quantity') }}</span>
  											</div>
  											<input type="text" class="form-control text-right text-select-all quantity" :data-id="item.sku_id" v-model="adjustItemList[index].quantity">
  										</div>
  									</div>
  								</div>
  								<div class="row">
  									<div class="col-md-6">
  										<div class="input-group mb-3">
  											<div class="input-group-prepend">
  												<span class="input-group-text">{{ warehouse_name }}</span>
  											</div>
  											<input type="text" class="form-control text-right" disabled :value="item.instock">
  										</div>
  									</div>
                    <div class="col-md-6">
  										<div class="input-group mb-3">
  											<div class="input-group-prepend">
  												<span class="input-group-text text-lowercase">{{ $t('message.newresult') }}</span>
  											</div>
  											<input type="text" class="form-control text-right" disabled v-model="adjustItemList[index].source_total">
  										</div>
  									</div>
  								</div>
  							</div>
  						</div>
  					</section>

  				</div>
  				<div class="modal-footer" v-if="!$store.state.app.loading">
  					<button
              type="button"
              class="btn btn-light"
              @click="closeAdjustmentModal()">{{ $t('button.cancel') }}</button>
  					<button type="button" class="btn btn-web" @click="updateStock()">{{ $t('button.apply') }}</button>
  				</div>
          <div class="modal-footer" v-if="$store.state.app.loading">
  					<button type="button" class="btn btn-light" disabled>{{ $t('button.cancel') }}</button>
  					<button type="button" class="btn btn-web" disabled>
              <i class="fas fa-spinner spin"></i>
            </button>
  				</div>
  			</div>
  		</div>
  	</div>

    <div class="modal fade bd-example-modal-lg" id="stockwarningModal" tabindex="-1" role="dialog" aria-labelledby="pricesModalTitle" aria-hidden="true" data-keyboard="false" data-backdrop="static">
  		<div class="modal-dialog modal-lg" role="document">
  			<div class="modal-content">
  				<div class="modal-header">
  					<h5 class="modal-title">{{ $t('message.stockwarning') }}</h5>
  					<button
              type="button"
              class="close"
              aria-label="Close"
              @click="closeStockwarningModal()"
              v-if="!$store.state.app.loading">
    						<span aria-hidden="true">&times;</span>
  					</button>
  				</div>
  				<div class="modal-body">

            <section v-if="stockwarningItemMap">
              <div class="row">
    						<div class="col-md-6">
                  <label>สต๊อกน้อยสุด</label>
                  <input type="number" class="form-control" v-model="stockwarningItemMap.control.minstock">
    						</div>
                <div class="col-md-6">
                  <label>สต๊อกมากสุด</label>
                  <input type="number" class="form-control" v-model="stockwarningItemMap.control.maxstock">
    						</div>
              </div>
  					</section>

            <section class="mb-0">
  						<div class="col-md-12 no-padding mb-0">
                ระบบจะแจ้งเตือนเมื่อสินค้ามีจำนวนน้อยกว่าที่กำหนด
  						</div>
  					</section>

  				</div>
  				<div class="modal-footer" v-if="!$store.state.app.loading">
  					<button
              type="button"
              class="btn btn-light"
              @click="closeStockwarningModal()">{{ $t('button.cancel') }}</button>
  					<button type="button" class="btn btn-web" @click="updateStockWarning()">{{ $t('button.apply') }}</button>
  				</div>
          <div class="modal-footer" v-if="$store.state.app.loading">
  					<button type="button" class="btn btn-light" disabled>{{ $t('button.cancel') }}</button>
  					<button type="button" class="btn btn-web" disabled>
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
  name: 'StockControl',
  data () {
    return {
      ready: false,

      warehouse_name: null,
      currentWhId: null,

      adjustmentReson: '',
      adjustItemList: [],
      allowAddMore_adj: true,

      stockwarningItemMap: null,

      pickedSkus: [],
      optionSkus: [],
      defaultSkus: null,
      trickValidationSkus: 0,

      dataTable: null
    }
  },
  computed: mapGetters({
    loading: 'getLoading',
    error: 'getError',
    warehouses: 'getWarehouses',
    stocks: 'getStocks',
    refreshStocks: 'getRefreshStocks',
    sidebar: 'getSidebar',
    auth: 'getAuth'
  }),
  methods: {
    setSubTitle (wh_id) {
      for(let i in this.warehouses) {
        let wh = this.warehouses[i]
        if(wh_id == wh.warehouse_id) {
          this.warehouse_name = wh.warehouse_name
        }
      }
    },
    async loadStocks (wh_id) {
      // destory old dataTable
      if(this.dataTable) this.dataTable.destroy()

      // get stocks
      await this.$store.dispatch('getStocks', wh_id)
      // set ready
      this.ready = true
      // loading finish
      this.showFinish(this.$Progress)

      // dataTable option
      let option = this.dataTableOption()
          option['columnDefs'] = [
            { "width": "120px", "targets": 1 },
            { "width": "120px", "targets": 2 },
            { "width": "150px", "targets": 4 },
          ]
      // set dataTable
      setTimeout(()=>{
        this.dataTable = $('#dataTable').DataTable(option)
      }, 1)
    },
    getWhIdPrimary (warehouses) {
      var wh_id = null
      if(this.$route.query.wh_id) {
        wh_id = this.$route.query.wh_id
      } else {
        let foundPrimary = false
        for(let i in this.warehouses) {
          let wh = this.warehouses[i]
          if(wh.primary && !foundPrimary) {
            foundPrimary = true
            wh_id = wh.warehouse_id
          }
        }
      }
      return wh_id
    },
    getSubmenuIdx (wh_id) {
      let submenus = this.sidebar[1].submenus
      for(let i in submenus) {
        if(wh_id == submenus[i].router.query.wh_id) {
          return i
        }
      }
    },
    getSubmenuWarehouses (warehouses) {
      var submenus = []
      for(let i in warehouses) {
        let wh = warehouses[i]
        var submenu = {
          "name": wh.warehouse_name,
          "router": {
            "name": "StockControl",
            "query": {
              "wh_id": wh.warehouse_id
            }
          },
          "activeClass": ''
        }
        submenus.push(submenu)
      }
      return submenus
    },
    openAdjustmentModal (sku, allowAddMore) {
      if(sku) {
        this.adjustItemList.push({
          sku_id: sku.sku_id,
          stock_id: sku.stock_id,
          warehouse_id: sku.warehouse_id,
          product_name: this.getProductFullName(sku.product_name, sku.attributes),
          instock: sku.instock,
          quantity: 0,
          source_total: ''
        })
      }
      if(allowAddMore === undefined || !allowAddMore) {
        this.allowAddMore_adj = false
      } else {
        this.allowAddMore_adj = true
      }

      $(this.$refs.adjustment_reson).removeClass('is-invalid')

      $('#adjustmentModal').modal('show')
    },
    closeAdjustmentModal () {
      let that = this
      $('#adjustmentModal')
        .modal('hide')
        .on('hidden.bs.modal', function () {
          console.log('hidden')
          // clear all data
          that.adjustItemList = []
          // clear select to defailt
          that.adjustmentReson = ''
          // clear default product
          that.defaultSkus = that.defaultSkus + ' '
        })
    },
    openStockwarningModal (item)
    {
      this.stockwarningItemMap = this.getObject(item)

      $('#stockwarningModal').modal('show')
    },
    closeStockwarningModal () {
      $('#stockwarningModal').modal('hide')
    },
    getSkuById (sku_id) {
      for(let i in this.stocks) {
        if(this.stocks[i].sku_id == sku_id) {
          return this.stocks[i]
        }
      }
      return null
    },
    async updateStock () {

      // trickValidationSkus to validation form
      this.trickValidationSkus++

      if(this.adjustmentReson == '' || this.adjustItemList.length == 0)
      {
        if(this.adjustmentReson == '')
        {
          $(this.$refs.adjustment_reson).addClass('is-invalid')
          // scroll to top
          $("#adjustmentModal").animate({ scrollTop: 0 }, "slow")
        }
        return false
      }

      var data = []

      for(let i in this.adjustItemList) {
        let sku = this.adjustItemList[i]
        let reson = this.adjustmentReson
        let json = {
          "stock_id": sku.stock_id,
          "sku_id": sku.sku_id,
          "warehouse_id": sku.warehouse_id,
          "quantity": parseInt(sku.quantity),
          "reason": reson,
          "note": "Text..."
        }
        data.push(json)
      }

      // console.log(data)
      // return

      var nameProducts = ""

      for(let i in data) {
        let sku = this.getSkuById(data[i].sku_id)
        nameProducts += this.getProductFullName(sku.product_name, sku.attributes)
        if(i < data.length-1) {
          nameProducts += ', '
        }
      }

      let res = await this.$store.dispatch('updateStock', data)

      if(res.success)
      {
        // show notify
        this.notify(this.$vs, {
          text: this.$t('message.stockhasbeenupdated', { msg: nameProducts }),
          color:'success',
          icon: 'cloud'
        })
      }
    },
    async updateStockWarning ()
    {
      let data = {
        stock_id: this.stockwarningItemMap.stock_id,
        min: parseFloat(this.stockwarningItemMap.control.minstock),
        max: parseFloat(this.stockwarningItemMap.control.maxstock)
      }

      // console.log(data)
      // return

      let res = await this.$store.dispatch('updateStockWarning', data)

      //console.log(res)

      if(res.success)
      {
        let nameProduct = this.getProductFullName(this.stockwarningItemMap.product_name, this.stockwarningItemMap.attributes)
        // show notify
        this.notify(this.$vs, {
          text: this.$t('message.stockhasbeenupdated', { msg: nameProduct }),
          color:'success',
          icon: 'cloud'
        })
      }
    },
    calculate (reason, oldVal, quantity) {
      var str = ''
      var oldVal = parseInt(oldVal)
      var quantity = parseInt(quantity)
      switch (reason) {
        case 'manual recount':
          str = quantity
        break;
        case 'manual received':
          str = oldVal + ' + ' + quantity + ' = ' + (oldVal+quantity)
        break;
        case 'manual loss':
        case 'manual damage':
        case 'manual return':
          str = oldVal + ' - ' + quantity + ' = ' + (oldVal-quantity)
        break;
      }
      return str
    },
    onChangedSkus () {

    },
    onPickedSkus (value) {
      console.log('onPickedSkus: ' + value)
      let sku_id = value
      let sku = this.getSkuById(sku_id)
      var found = false
      for(let i in this.adjustItemList) {
        if(sku_id == this.adjustItemList[i].sku_id) {
          found = true
        }
      }
      if(!found) {
        this.adjustItemList.push({
          sku_id: sku.sku_id,
          stock_id: sku.stock_id,
          warehouse_id: sku.warehouse_id,
          product_name: this.getProductFullName(sku.product_name, sku.attributes),
          instock: sku.instock,
          quantity: 0,
          source_total: ''
        })
      }
    },
    onRemovedSkus (value) {
      console.log('onRemovedSkus: ' + value)
      let sku_id = value
      for(let i in this.adjustItemList) {
        let item = this.adjustItemList[i]
        if(item.sku_id == sku_id) {
          this.adjustItemList.splice(i, 1)
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
    ready () {
      // loading finish
      this.showFinish(this.$Progress)
    },
    warehouses: function (newVal, oldVal) {
      let primaryWhId = this.getWhIdPrimary(this.warehouses)
      sidebarModule.init(this.getObject(require('../sidebar.json')))
      sidebarModule.update(this.sidebar, 1, submenuModule.getWarehouses(this.warehouses))
      sidebarModule.active({
        sidebarAtIdx: 1,
        submenuAtIdx: this.getSubmenuIdx(primaryWhId)
      })
      this.setSubTitle(primaryWhId)
      this.loadStocks(primaryWhId)
      this.currentWhId = primaryWhId
    },
    '$route': function (refreshPage) {
      let wh_id = refreshPage.query.wh_id
      sidebarModule.init(this.getObject(require('../sidebar.json')))
      sidebarModule.update(this.sidebar, 1, submenuModule.getWarehouses(this.warehouses))
      sidebarModule.active({
        sidebarAtIdx: 1,
        submenuAtIdx: this.getSubmenuIdx(wh_id)
      })
      this.setSubTitle(wh_id)
      this.loadStocks(wh_id)
      this.currentWhId = wh_id
    },
    stocks: function(newVal, oldVal) {
      this.optionSkus = []
      for(let i in this.stocks) {
        let item = this.stocks[i]
        this.optionSkus.push({
          text: this.getProductFullName(item.product_name, item.attributes),
          value: item.sku_id
        })
      }
    },
    refreshStocks: async function(newVal, oldVal) {
      // reload data
      await this.loadStocks(this.currentWhId)

      // close popup modal
      this.closeAdjustmentModal()
      // close popup modal
      this.closeStockwarningModal()
    },
    allowAddMore_adj: function(newVal, oldVal) {

    },
    adjustmentReson (after, before) {
      let reason = after
      for(let i in this.adjustItemList) {
        let item = this.adjustItemList[i]
        item.source_total = this.calculate (reason, item.instock, item.quantity)
      }

      if(!after) {
        $(this.$refs.adjustment_reson).addClass('is-invalid')
      }
      else {
        $(this.$refs.adjustment_reson).removeClass('is-invalid')
      }
    },
    adjustItemList: {
      handler: function(after, before) {
        let reason = this.adjustmentReson
        for(let i in this.adjustItemList) {
          let item = this.adjustItemList[i]
          item.source_total = this.calculate (reason, item.instock, item.quantity)
        }
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
  },
  beforeMount: function () {
    // init page
    this.initPage({
      section: 'app',
      name: this.$t('app.inventory.title')
    })
    // set sidebar stockcontrols ui
    if(this.warehouses.length > 0) {
      let primaryWhId = this.getWhIdPrimary(this.warehouses)
      sidebarModule.init(this.getObject(require('../sidebar.json')))
      sidebarModule.update(this.sidebar, 1, submenuModule.getWarehouses(this.warehouses))
      sidebarModule.active({
        sidebarAtIdx: 1,
        submenuAtIdx: this.getSubmenuIdx(primaryWhId)
      })
      this.setSubTitle(primaryWhId)
      this.loadStocks(primaryWhId)
      this.currentWhId = primaryWhId
    }
  },
  mounted: function () {
    // set popup modal
    this.setModal('#adjustmentModal')
    this.setModal('#stockwarningModal')
  },
  updated: function() {

  },
  destroyed: function() {
    this.leavePage(this.$Progress, ['clearStock'])
  }
}
</script>

<style scoped>
#content .header-inner .right .action button {
  float: right;
  border-left: solid 1px #D8E2E7;
  padding-top: 0;
  padding-bottom: 0;
}
#content .header-inner .right .action button:first-of-type {
  padding-right: 0;
}
#content .header-inner .right .action button:last-of-type {
  border-left: none;
}
.dropdown > button {
  padding: 0;
}
</style>
