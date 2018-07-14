<template>
  <div id="content">
    <div class="header col-md-12">
      <div class="header-inner row align-items-center">
        <div class="col left">
          <div class="title">
            {{ $t('sidebar.products') }} > {{ $t('sidebar.create') }}
          </div>
        </div>
      </div>
    </div>

    <div class="content col-md-12">
      <p v-if="!ready">{{ $t('message.loading') }}</p>

      <template v-if="ready">
        <section class="choose-type">
          <div class="col-md-12 no-padding">
            <section-header :title="$t('message.selecttype')"></section-header>
            <div class="row wrapper">
              <div class="col-md-6">
                <vs-radio
                vs-color="success"
                v-model="typeRadios"
                vs-value="product"
                style="float: left;padding: 0;">
                  <strong>{{ $t('message.product') }}</strong>
                </vs-radio>
                <br/>
                <div class="form-check-label" style="margin-left: 28px;">
                  <p>{{ $t('message.selecttype_detail1') }}</p>
                </div>
              </div>
              <div class="col-md-6">
                <vs-radio
                vs-color="success"
                v-model="typeRadios"
                vs-value="service"
                style="float: left;padding: 0;">
                  <strong>{{ $t('message.service') }}</strong>
                </vs-radio>
                <br/>
                <div class="form-check-label" style="margin-left: 28px;">
                  <p>{{ $t('message.selecttype_detail2') }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div class="section-product" v-if="chooseType == 'product'">
          <section>
            <div class="col-md-12 no-padding">
              <section-header :title="$t('message.general')"></section-header>
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group row">
                    <div class="col-md-12">
                      <label>{{ $t('message.productname') }} *</label>
                      <input type="text" class="form-control" v-model="productName">
                    </div>
                  </div>
                </div>
                <!-- <div class="col-md-6">
                  <div class="form-group row">
                    <div class="col-md-12">
                      <label>{{ $t('message.brand') }}</label>
                      <selectize @change="onChangedBrand()" :options="optionsBrand" v-model="brandName" default="" :multiple="false" :create="true" :placeholder="$t('placeholder.selectorcreate')"></selectize>
                    </div>
                  </div>
                </div> -->
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group row">
                    <div class="col-md-12">
                      <label>{{ $t('message.productimage') }}</label>
                      <input type="file" class="form-control" style="height: 130px;">
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group row">
                    <div class="col-md-12">
                      <label>{{ $t('message.category') }}</label>
                      <selectize @change="onChangedCat()"
                                 :options="optionsCat"
                                 v-model="catName"
                                 default=""
                                 :multiple="false"
                                 :create="true"
                                 :placeholder="$t('placeholder.selectorcreate')"></selectize>
                    </div>
                  </div>
                  <div class="form-group row">
                    <div class="col-md-12">
                      <label>{{ $t('message.unit') }}</label>
                      <selectize @change="onChangedUnit()" :options="optionsUnit" v-model="unit" default="" :multiple="false" :create="true" :placeholder="$t('placeholder.selectorcreate')"></selectize>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section>
            <div class="col-md-12 no-padding">
              <section-header :title="$t('message.pricing')"></section-header>
              <div class="row">

                <template v-if="tempPrices.length == 0">
                  <div class="col-md-6">
                    <div class="form-group row">
                      <div class="col-md-12">
                        <label>{{ $t('message.price') }}</label>
                        <div class="input-group">
                          <div class="input-group-prepend">
                            <button
                              class="btn dropdown-toggle"
                              type="button"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                              style="border: 1px solid #ced4da;">
                              <template v-if="isFixedPrice">
                              {{ $t('message.fixedprice') }}
                              </template>
                              <template v-if="!isFixedPrice">
                              {{ $t('message.variableprice') }}
                              </template>
                            </button>
                            <div class="dropdown-menu">
                              <a class="dropdown-item"
                                 @click="isFixedPrice = true">{{ $t('message.fixedprice') }}</a>
                              <a class="dropdown-item"
                                 @click="isFixedPrice = false">{{ $t('message.variableprice') }}</a>
                            </div>
                          </div>
                          <input type="text" class="form-control text-right" :disabled="!isFixedPrice" v-model="textField_ProductPrice">
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group row">
                      <div class="col-md-12">
                        <label>{{ $t('message.cost') }}</label>
                        <input type="text" class="form-control text-right" v-model="textField_ProductCost">
                      </div>
                    </div>
                  </div>
                </template>

                <template>
                  <div class="col-md-12 no-padding" v-for="(data, index) in tempPrices">
      							<div class="col-md-12" style="padding: 0 15px 0 15px;">
      								<div class="row" style="margin-bottom: 12px;">
      									<div class="col-6">
                          <span v-for="attribute in data.attributes" style="margin-right: 10px;">{{ attribute.name }}: {{ attribute.option }}</span>
                        </div>
      									<div class="col-6 text-right" style="max-height: 24px;">
                          {{ $t('message.available') }}
                          <vs-switch vs-type="success" style="float: right;position: relative;top: -8px;" disabled="true" v-model="tempPrices[index].is_available"/>
      									</div>
      								</div>
      								<div class="row">
      									<div class="col-lg-4">
      										<div class="input-group mb-3">
      											<div class="input-group-prepend">
      												<span class="input-group-text">{{ $t('message.pcode') }}</span>
      											</div>
      											<input type="text" class="form-control text-right text-select-all" disabled v-model="tempPrices[index].pcode">
      										</div>
      									</div>
      									<div class="col-lg-4">
      										<div class="input-group mb-3">
      											<div class="input-group-prepend">
      												<span class="input-group-text">{{ $t('message.sku') }}</span>
      											</div>
      											<input type="text" class="form-control text-right text-select-all" disabled v-model="tempPrices[index].sku">
      										</div>
      									</div>
      									<div class="col-lg-4">
      										<div class="input-group mb-3">
      											<div class="input-group-prepend">
      												<span class="input-group-text">{{ $t('message.barcode') }}</span>
      											</div>
      											<input type="text" class="form-control text-right text-select-all" disabled v-model="tempPrices[index].barcode">
      										</div>
      									</div>
      								</div>
      								<div class="row">
      									<div class="col-lg-8">
      										<div class="input-group mb-3">
      											<div class="input-group-prepend">
      												<button class="btn dropdown-toggle"
                                      type="button"
                                      style="border: 1px solid #ced4da;">
                                      <template v-if="data.is_fixedprice">
                                      {{ $t('message.fixedprice') }}
                                      </template>
                                      <template v-if="!data.is_fixedprice">
                                      {{ $t('message.variableprice') }}
                                      </template>
                                    </button>
      											</div>
      											<input type="text" class="form-control text-right text-select-all" disabled @keyup="keyupPricce(tempPrices[index].price)" v-model="tempPrices[index].price">
      										</div>
      									</div>
      									<div class="col-lg-4">
      										<div class="input-group mb-3">
      											<div class="input-group-prepend">
      												<span class="input-group-text">{{ $t('message.cost') }}</span>
      											</div>
      											<input type="text" class="form-control text-right text-select-all" disabled @keyup="keyupCost(tempPrices[index].cost)" v-model="tempPrices[index].cost">
      										</div>
      									</div>
      								</div>
      							</div>
      						</div>
                </template>


                <div class="col-md-12">
                  <div class="form-group row">
                    <div class="col-md-12">
                      <button class="btn btn-light"
                              @click="openModalPrices()">
                              <i class="far fa-window-restore"></i> {{ $t('message.addmoreprices') }}</button>
                      <a href="#" target="_blank">{{ $t('button.learnmore') }} <i class="fas fa-external-link-alt"></i></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div class="section-service" v-if="chooseType == 'service'">
          <section>
            <div class="col-md-12 no-padding">
              <section-header :title="$t('message.service')"></section-header>
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group row">
                    <div class="col-md-12">
                      <label>{{ $t('message.servicename') }} *</label>
                      <input type="text" class="form-control" v-model="productName">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section>
          <div class="col-md-12 no-padding">
            <section-header :title="$t('message.pricing')"></section-header>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group row">
                  <div class="col-md-12">
                    <label>{{ $t('message.price') }}</label>
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <button
                          class="btn dropdown-toggle"
                          type="button"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                          style="border: 1px solid #ced4da;">
                          <template v-if="isFixedPrice">
                          {{ $t('message.fixedprice') }}
                          </template>
                          <template v-if="!isFixedPrice">
                          {{ $t('message.variableprice') }}
                          </template>
                        </button>
                        <div class="dropdown-menu">
                          <a class="dropdown-item"
                             @click="isFixedPrice = true">{{ $t('message.fixedprice') }}</a>
                          <a class="dropdown-item"
                             @click="isFixedPrice = false">{{ $t('message.variableprice') }}</a>
                        </div>
                      </div>
                      <input type="text" class="form-control text-right" :disabled="!isFixedPrice" v-model="textField_ServicePrice">
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group row">
                  <div class="col-md-12">
                    <label>{{ $t('message.cost') }}</label>
                    <input type="text" class="form-control text-right" v-model="textField_ServiceCost">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        </div>

        <section class="action-bar" v-if="chooseType !== null">
          <div class="col-md-12">
            <div class="btn-group">
              <button type="button" class="btn btn-web" @click="saveProduct">{{ $t('button.save') }}</button>
              <button type="button" class="btn btn-web dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="sr-only">Toggle Dropdown</span>
              </button>
              <div class="dropdown-menu">
                <a class="dropdown-item">{{ $t('button.save') }}</a>
                <a class="dropdown-item">{{ $t('button.saveandcreateanother') }}</a>
              </div>
            </div>
            <button class="btn btn-light btn-block-mobile-only">{{ $t('button.cancel') }}</button>
          </div>
        </section>
      </template>

    </div>

    <div class="modal fade bd-example-modal-lg" id="pricesModal" tabindex="-1" role="dialog" aria-labelledby="pricesModalTitle" aria-hidden="true" data-keyboard="false" data-backdrop="static">
  		<div class="modal-dialog modal-lg" role="document">
  			<div class="modal-content">
  				<div class="modal-header">
  					<h5 class="modal-title" id="pricesModalTitle">{{ $t('message.addmoreprices') }}</h5>
  					<button type="button" class="close" aria-label="Close" @click="cancelPrices()">
  						<span aria-hidden="true">&times;</span>
  					</button>
  				</div>
  				<div class="modal-body">
  					<section>
              <section-title :title="$t('message.attribute')"></section-title>
  						<div class="col-md-12 no-padding">
  							<div class="row">
  								<template v-for="(item, i) in attributes.length">
                    <div class="wrap-attributes-input col-md-12">
                      <div class="row">
                        <div class="col-md-4">
        							    <div class="form-group row" style="margin-bottom: 10px;">
        										<div class="col-md-12">
        											<input type="text" class="form-control" :placeholder="$t('message.attributename')" v-model="attributes[i].name">
        										</div>
        									</div>
        								</div>
        								<div class="col-md-8">
        									<div class="form-group row" style="margin-bottom: 10px;">
        										<div class="col-md-12">
                              <input-tags :placeholder="$t('message.options_colorsize')" v-model="attributes[i].options"></input-tags>
        										</div>
        									</div>
        								</div>
                      </div>
                    </div>
                  </template>
  								<div class="col-md-12 no-padding-top">
  									<div class="form-group row">
  										<div class="col-md-12">
  											<button class="btn btn-light" @click="addAttribute()"><i class="fas fa-plus"></i> {{ $t('message.addattribute') }}</button>
  										</div>
  									</div>
  								</div>
  							</div>
  						</div>
  					</section>

  					<section>
  						<section-title :title="$t('message.function')"></section-title>
  						<div class="col-md-12 no-padding">
  							<div class="row">
  								<div class="col-md-12 col-lg-6">
  									<div class="form-group row">
  										<div class="col-md-12">
                        <vs-checkbox vs-color="success" style="float: left;margin: 0;" v-model="autoGenPcode">{{ $t('message.autogenpcode') }}</vs-checkbox>
  										</div>
  									</div>
  								</div>
  								<div class="col-md-12 col-lg-6">
  									<div class="form-group row">
  										<div class="col-md-12">
                        <vs-checkbox vs-color="success" style="float: left;margin: 0;" v-model="autoGenSku">{{ $t('message.autogensku') }}</vs-checkbox>
  										</div>
  									</div>
  								</div>
  								<div class="col-md-12 col-lg-6">
  									<div class="form-group row">
  										<div class="col-md-12">
                        <vs-checkbox vs-color="success" style="float: left;margin: 0;" v-model="replacePrice">{{ $t('message.replaceprice') }}</vs-checkbox>
  										</div>
  									</div>
  								</div>
  								<div class="col-md-12 col-lg-6">
  									<div class="form-group row">
  										<div class="col-md-12">
                        <vs-checkbox vs-color="success" style="float: left;margin: 0;" v-model="replaceCost">{{ $t('message.replacecost') }}</vs-checkbox>
  										</div>
  									</div>
  								</div>
  							</div>
  						</div>
  					</section>

  					<section>
  						<section-title :title="'Prices (' + prices.length + ')'" v-if="prices.length > 0"></section-title>
              <div class="container no-padding mb-3" v-for="(data, index) in prices">
  							<div class="col-md-12" style="background: #F5F5F5;padding: 15px 15px 0 15px;">
  								<div class="row" style="margin-bottom: 12px;">
  									<div class="col-6">
                      <span v-for="attribute in data.attributes" style="margin-right: 10px;">{{ attribute.name }}: {{ attribute.option }}</span>
                    </div>
  									<div class="col-6 text-right" style="max-height: 24px;">
                      {{ $t('message.available') }}
                      <vs-switch vs-type="success" style="float: right;position: relative;top: -8px;" v-model="prices[index].is_available"/>
  									</div>
  								</div>
  								<div class="row">
  									<div class="col-lg-4">
  										<div class="input-group mb-3">
  											<div class="input-group-prepend">
  												<span class="input-group-text">{{ $t('message.pcode') }}</span>
  											</div>
  											<input type="text" class="form-control text-right text-select-all" v-model="prices[index].pcode">
  										</div>
  									</div>
  									<div class="col-lg-4">
  										<div class="input-group mb-3">
  											<div class="input-group-prepend">
  												<span class="input-group-text">{{ $t('message.sku') }}</span>
  											</div>
  											<input type="text" class="form-control text-right text-select-all" placeholder="unique" v-model="prices[index].sku">
  										</div>
  									</div>
  									<div class="col-lg-4">
  										<div class="input-group mb-3">
  											<div class="input-group-prepend">
  												<span class="input-group-text">{{ $t('message.barcode') }}</span>
  											</div>
  											<input type="text" class="form-control text-right text-select-all" v-model="prices[index].barcode">
  										</div>
  									</div>
  								</div>
  								<div class="row">
  									<div class="col-lg-8">

                      <div class="input-group">
                        <div class="input-group-prepend">
                          <button
                            class="btn dropdown-toggle"
                            type="button"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                            style="border: 1px solid #ced4da;">
                            <template v-if="data.is_fixedprice">
                            {{ $t('message.fixedprice') }}
                            </template>
                            <template v-if="!data.is_fixedprice">
                            {{ $t('message.variableprice') }}
                            </template>
                          </button>
                          <div class="dropdown-menu">
                            <a class="dropdown-item"
                               @click="data.is_fixedprice = true">{{ $t('message.fixedprice') }}</a>
                            <a class="dropdown-item"
                               @click="data.is_fixedprice = false">{{ $t('message.variableprice') }}</a>
                          </div>
                        </div>
                        <input type="text"
                               class="form-control text-right text-select-all"
                               :disabled="!data.is_fixedprice"
                               @keyup="keyupPricce(prices[index].price)"
                               v-model="prices[index].price">
                      </div>

  									</div>
  									<div class="col-lg-4">
  										<div class="input-group mb-3">
  											<div class="input-group-prepend">
  												<span class="input-group-text">{{ $t('message.cost') }}</span>
  											</div>
  											<input type="text"
                               class="form-control text-right text-select-all"
                               @keyup="keyupCost(prices[index].cost)"
                               v-model="prices[index].cost">
  										</div>
  									</div>
  								</div>
  							</div>
  						</div>
  					</section>

  				</div>
  				<div class="modal-footer">
  					<button type="button" class="btn btn-light" @click="cancelPrices()">{{ $t('button.cancel') }}</button>
  					<button type="button" class="btn btn-light" @click="resetPrices()">{{ $t('button.reset') }}</button>
  					<button type="button" class="btn btn-web" @click="applyPrices()">{{ $t('button.apply') }}</button>
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
  name: 'ProductNew',
  data () {
    return {
      ready: false,

      radios1: null,
      typeRadios: null,
      chooseType: null,
      formEdited: false,
      productName: null,

      textField_ProductPrice: null,
      textField_ProductCost: null,
      isFixedPrice: true,

      textField_ServicePrice: null,
      textField_ServiceCost: null,

      brandName: null,
      catName: null,
      unit: null,
      attributes: [],
      prices: [],
      tempPrices: [],
      tempAttrs: [],

      autoGenPcode: false,
      autoGenSku: false,
      replacePrice: false,
      replaceCost: false,

      startPcodeAt: 1,
      optionsBrand: [{
        value: 'opt1',
        text: 'opt1'
      },{
        value: 'opt2',
        text: 'opt2'
      }],
      optionsCat: [],
      optionsUnit: []
    }
  },
  computed: mapGetters({
    loading: 'getLoading',
    error: 'getError',
    categories: 'getCategories'
  }),
  methods: {
    addAttribute () {
      if(this.attributes.length < 3) {
        this.attributes.push({
          name: null,
          options: []
        })
      }
    },
    applyPrices () {
      if(this.prices.length == 0) {
        return false
      }

      if(this.prices.length > 0) {
        var temp = JSON.stringify(this.prices)
        this.tempPrices = JSON.parse(temp)
        var temp2 = JSON.stringify(this.attributes)
        this.tempAttrs = JSON.parse(temp2)
      } else {
        this.tempPrices = []
        this.tempAttrs = []
      }
      this.closeModalPrices()
    },
    cancelPrices () {
      let t = this
      var temp = JSON.stringify(this.tempPrices)
      this.prices = JSON.parse(temp)
      var temp2 = JSON.stringify(this.tempAttrs)
      this.attributes = []
      setTimeout(()=>{
        t.attributes = JSON.parse(temp2)
      }, 1)

      this.closeModalPrices()
    },
    resetPrices () {
      this.attributes = []
      this.prices = []
      let t = this
      setTimeout(() => {
        t.addAttribute()
      }, 1)
    },
    async saveProduct () {
      let newproduct = {}

      if(this.productName) newproduct['product_name'] = this.productName
      if(this.typeRadios) newproduct['type'] = this.typeRadios
      if(this.typeRadios == 'service') {
        this.prices = [{
          price: this.textField_ServicePrice,
          cost: this.textField_ServiceCost
        }]
      } else if(this.typeRadios == 'product') {
        newproduct['stock_tracking'] = true
        if(this.tempPrices.length == 0) {
          this.prices = [{
            price: this.textField_ProductPrice,
            cost: this.textField_ProductCost
          }]
        }
      }
      if(this.brandName) newproduct['brand_name'] = this.brandName
      if(this.catName) newproduct['category_name'] = this.catName
      if(this.unit) newproduct['unit'] = this.unit
      if(this.prices.length > 0) newproduct['prices'] = this.prices

      // delete key we don't need
      for(let i in newproduct.prices) {
        if(newproduct.prices[i].is_fixedprice) {
          delete newproduct.prices[i].is_fixedprice
        }
      }

      // console.log(newproduct)
      // return

      // call api
      let res = await this.$store.dispatch('insertProduct', newproduct)

      console.log(res)

      if(res.success) {
        // show notify
        this.notify(this.$vs, {
          text: this.$t('message.hasbeencreated', { msg: newproduct.product_name }),
          color:'success',
          icon: 'cloud'
        })
        // go to GoodsIssueAll page
        return this.$router.push({ name: "ProductAll"})
      }
    },
    genPrices (attributes) {
      var prices = []
      var pattern = []
      var count = 1
      var maxIdx = [] // 2, 2, 1
      var currentPattern = [] // 0, 0, 0
      var currentIdx = [] // 0, 0 ,0
      var rootAtIdx = attributes.length - 1
      var enable = true

      function getAttr(pattern) {
        var results = []
        for(let i in attributes) {
          results.push({
            name: attributes[i].name,
            option: attributes[i].options[pattern[i]]
          })
        }
        return results
      }

      for(let i in attributes) {
        let optsCount = attributes[i].options.length
        count *= optsCount
        maxIdx.push(optsCount-1)
        currentPattern.push(0)
        currentIdx.push(0)
      }

      for(var i = 0; i < count; i++) {
        var arr = []
        for(let attrIdx in attributes) {
          attrIdx = parseInt(attrIdx)
          arr.push(currentIdx[attrIdx])
        }

        pattern[i] = arr

        currentIdx[attributes.length-1]++

        if(currentIdx[attributes.length-1] > maxIdx[attributes.length-1]) {
          currentIdx[attributes.length-1] = 0

          if(enable) {
            enable = false
            rootAtIdx--
          }

          if(currentIdx[rootAtIdx] !== undefined) {
            if(currentIdx[rootAtIdx] < maxIdx[rootAtIdx]) {
              currentIdx[rootAtIdx]++
            } else {
              currentIdx[rootAtIdx] = 0
              currentIdx[0]++
            }
          }
        }
      }
      for(var i = 0; i < count; i++) {
        prices.push({
          "attributes": getAttr(pattern[i]),
          "pcode": null,
          "sku": null,
          "barcode": null,
          "price": 0,
          "cost": 0,
          "is_available": true,
          "is_fixedprice": true
        })
      }
      return prices
    },
    keyupPricce (price) {
      if(this.replacePrice) {
        for(let i in this.prices) {
          if(this.prices[i].is_fixedprice) {
            this.prices[i].price = price
          } else {
            this.prices[i].price = null
          }
        }
      }
    },
    keyupCost (cost) {
      if(this.replaceCost) {
        for(let i in this.prices) {
          this.prices[i].cost = cost
        }
      }
    },
    genPcode () {
      let startAt = this.startPcodeAt
      for(let i in this.prices) {
        this.prices[i].pcode = 'P'+this.pad(startAt++, 4)
      }
    },
    openModalPrices () {
      // set to default
      if(this.prices.length == 0) {
        this.autoGenPcode = false
        this.autoGenSku = false
        this.replacePrice = false
        this.replaceCost = false
      }
      $('#pricesModal').modal('show')
    },
    closeModalPrices () {
      $('#pricesModal').modal('hide')
    },
    onChangedBrand () {
      console.log("ok it's work! : " + this.brandName)
    },
    onChangedCat () {
      console.log("ok it's work! : " + this.catName)
    },
    onChangedUnit () {
      console.log("ok it's work! : " + this.unit)
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
    productName: function (newVal, oldVal) {
      this.formEdited = true
    },
    typeRadios: function (newVal, oldVal) {
      if(this.formEdited) {
        console.log('are u sure?')
      }
      // chanage chooseType
      this.chooseType = newVal

      // clear form
      this.productName = null
      this.prices = []
      this.tempPrices = []
      this.tempAttrs = []
      this.textField_ServicePrice = null
      this.textField_ServiceCost = null
      this.isFixedPrice = true

      // clear selectize
      this.brandName = null
      this.catName = null
      this.unit = null
    },
    prices: function (newVal, oldVal) {
      if(this.autoGenPcode) {
        this.genPcode()
      }
    },
    categories: function (newVal, oldVal) {
      this.optionsCat = []
      let items = newVal
      for(let i in items) {
        this.optionsCat.push({
          text: items[i].category_name,
          value: items[i].category_name
        })
      }
    },
    autoGenPcode: function (newVal, oldVal) {
      if(newVal == false) {
        for(let i in this.prices) {
          this.prices[i].pcode = null
        }
      } else {
        this.genPcode()
      }
    },
    attributes: {
      handler: function(newValue) {
        this.prices = this.genPrices(this.attributes)

        if(this.autoGenPcode) {
          this.genPcode()
        }
      },
      deep: true
    },
    prices: {
      handler: function(newVal) {
        for(let i in this.prices) {
          if(!this.prices[i].is_fixedprice) {
            this.prices[i].price = null
          }
        }
      },
      deep: true
    },
    isFixedPrice: function (after, before) {
      if(!after) {
        this.textField_ProductPrice = null
        this.textField_ServicePrice = null
      }
    }
  },
  beforeCreate: function () {

  },
  created: async function () {
    // get categories
    await this.$store.dispatch('getCategories')
    // set ready
    this.ready = true
  },
  beforeMount: function() {
    // init page
    this.initPage({
      section: 'app',
      name: this.$t('app.products.title')
    })
    // set sidebar ui
    sidebarModule.init(this.getObject(require('../sidebar.json')), {
      sidebarAtIdx: 0,
      submenuAtIdx: 1
    })
  },
  mounted: function () {
    // add attribute
    this.addAttribute()
    // set popup modal
    this.setModal('#pricesModal')
  },
  updated: function () {

  },
  destroyed: function() {
    this.leavePage(this.$Progress, ['clearCategories'])
  }
}
</script>

<style scoped>
  section.choose-type .form-check input, section.choose-type .form-check label {
    cursor: pointer;
  }
  section .form-check p {
    margin: 0;
  }
  @media (max-width: 575.98px) {
    .choose-type .wrapper > div {
      margin-bottom: 15px;
    }
  }
</style>
