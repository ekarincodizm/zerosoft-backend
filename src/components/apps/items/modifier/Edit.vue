<template>
  <div id="content">
    <div class="header col-md-12">
      <div class="header-inner row align-items-center">
        <div class="col left">
          <div class="title">
            {{ $t('sidebar.modifiers') }} > {{ this.$route.query.modi_name }}
          </div>
        </div>
        <div class="col-md-8 right">
          <div class="action" v-if="_modifier !== null">
            <div class="dropdown item">
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
          </div>
        </div>
      </div>
    </div>

    <div class="content col-md-12">
      <p v-if="!ready">{{ $t('message.loading') }}</p>

      <template v-if="!edited">
        <section>
          <div class="col-md-12 no-padding">
            <section-header :title="$t('message.modifiers')"></section-header>
            <modifier
              :data="modifier"
              :disabled="true"
              v-if="modifier.options.length > 0"></modifier>
          </div>
        </section>
        <section class="assign-items mt-3 disabled" style="margin-bottom: 20px;" v-if="assignitems.length > 0">
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
      </template>

      <template v-if="edited">
        <section>
          <div class="col-md-12 no-padding">
            <section-header :title="$t('message.modifiers')"></section-header>
            <modifier
              :validation="validation"
              :data="modifier"
              @data="form"
              v-if="modifier.options.length > 0"></modifier>
          </div>
        </section>

        <section
          class="assign-items mt-3"
          style="margin-bottom: 20px;"
          v-if="items.length > 0 && modifier.name">
          <div class="col-md-12 no-padding">
            <section-header :title="$t('message.assignitems') + ' ('+assignitems.length+')'"></section-header>
            <div class="col-md-12 row align-items-center no-padding no-margin subheader-assign">
              <div class="col no-padding">{{$t('message.productlist') }}</div>
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
                <span class="comma" v-for="(_item, index) in item.modifiers" v-if="_item.modifier_id != _modifier.modifier_id">
                  {{ _item.modifier_name }}
                </span>
                <span class="comma" v-if="item.active">
                  {{ modifier.name }}
                </span>
                <i class="fas fa-check-circle"></i>
                <i class="far fa-circle"></i>
              </div>
            </div>
          </div>
        </section>

        <section class="action-bar">
          <div class="col-md-12" v-if="!$store.state.app.loading">
            <button class="btn btn-web" @click="validation++">{{ $t('button.save') }}</button>
            <button class="btn btn-light" @click="edited = false">{{ $t('button.cancel') }}</button>
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

    <div class="modal fade " id="confirmdeleteModal" tabindex="-1" role="dialog" aria-labelledby="pricesModalTitle" aria-hidden="true" data-keyboard="false" data-backdrop="static">
      <div class="modal-dialog " role="document">
        <div class="modal-content">
          <div class="modal-header" style="border-bottom: none;">
            <h5 class="modal-title" v-if="_modifier">
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

export default {
  name: 'ModifierEdit',
  data () {
    return {
      ready: false,

      items: [],
      original_items: null,

      assignitems: [],
      original_assignitems: null,

      validation: 0,

      modifier: {
        name: null,
        is_invalid: false,
        options: []
      },
      original_modifier: null,

      edited: false,
      updated: false
    }
  },
  computed: mapGetters({
    loading: 'getLoading',
    error: 'getError',
    sidebar: 'getSidebar',
    products: 'getProducts',
    _modifier: 'getModifier'
  }),
  methods: {
    toggleAssign (item) {
      if(!this.modifier.name) {
        return
      }
      item.active = !item.active
    },
    setItems (_modifier, products) {
      this.items = []
      for(let i in products) {
        let product = products[i]
        var active = false
        if(_modifier) {
          for(let j in product.modifiers) {
            let item = product.modifiers[j]
            if(_modifier.modifier_id == item.modifier_id) {
              active = true
            }
          }
        }
        this.items.push({
          product_id: product.product_id,
          product_name: product.product_name,
          modifiers: product.modifiers,
          active: active
        })
      }
    },
    updateAssignItems (items) {
      this.assignitems = []
      for(let i in items) {
        let item  = items[i]
        if(item.active) {
          this.assignitems.push({
            product_id: item.product_id
          })
        }
      }
    },
    form (err, data) {
      if(!err) {
        return $("html, body").animate({ scrollTop: 0 }, "slow")
      }

      data['modifier_id'] = this._modifier.modifier_id

      if(this.assignitems.length > 0) {
        data['assign'] = this.assignitems
      }

      this.update(data)
    },
    async update (data) {

      // console.log(data)
      // return

      let res = await this.$store.dispatch('updateModifier', data)

      console.log(res)

      if(res.success) {
        // show notify
        this.notify(this.$vs, {
          text: this.$t('message.hasbeenupdated', { msg: data.modifier_name }),
          color:'success',
          icon: 'save'
        })
        // get products
        await this.$store.dispatch('getProducts')
        // set items
        this.setItems(this._modifier, this.products)
        // update assignitems
        this.updateAssignItems(this.items)
        // original items
        this.original_items = this.getObject(this.items)
        // original assignitems
        this.original_assignitems = this.getObject(this.assignitems)
        // original modifier
        this.original_modifier = this.getObject(this.modifier)
        // set edited
        this.edited = false
        // set updated
        this.updated = true
        // set validation 0
        this.validation = 0
        // loading finish
        this.showFinish(this.$Progress)
      }
    },
    async del () {
      let data = {
        modifier_id: this._modifier.modifier_id
      }

      // console.log(data)
      // return

      let res = await this.$store.dispatch('deleteModifier', data)

      console.log(res)

      if(res.success) {
        // show notify
        this.notify(this.$vs, {
          text: this.$t('message.hasbeendeleted', { msg: this.modifier.name }),
          color:'danger',
          icon: 'delete'
        })
        // close modal
        this.closeConfirmdeleteModal()
        // go to GoodsIssueAll page
        return this.$router.push({ name: "ModifierAll"})
      }
    },
    openConfirmdeleteModal () {
      // set edited
      this.edited = false
      // open modal
      $('#confirmdeleteModal').modal('show')
    },
    closeConfirmdeleteModal () {
      $('#confirmdeleteModal').modal('hide')
    }
  },
  watch: {
    loading: function(isLoading) {
      this.showLoading(this.$Progress, isLoading)
    },
    error: function(msg) {
      this.showError(this.$Progress, this.$vs, msg, {
        title: this.$t('message.message'),
        text: this.$t('message.somethingwentwrong')
      })
    },
    ready: function () {
      // loading finish
      this.showFinish(this.$Progress)
    },
    items: {
      handler: function (after) {
        let items = after
        this.updateAssignItems(items)
      },
      deep: true
    },
    edited (after, before) {
      if(!this.edited && !this.updated) {
        this.items = this.getObject(this.original_items)
        this.assignitems = this.getObject(this.original_assignitems)
        this.modifier = this.getObject(this.original_modifier)
      } else {
        this.updated = false
      }
    }
  },
  beforeCreate: function () { // clear states

  },
  created: async function () { // call api to get data and set state
    /**
     *  validation
     */
    if(!this.$route.query.modi_id) {
      return this.$router.push({ name: "ModifierAll"})
    }
    // get category
    let res = await this.$store.dispatch('getModifier', {
      modifier_id: this.$route.query.modi_id
    })
    if(!res.success) {
      return this.$router.push({ name: "ModifierAll"})
    }
    if(res.data.length == 0) {
      return this.$router.push({ name: "ModifierAll"})
    }
    /**
     *  validation success
     */

    /**
    *  set data
    */
    this.modifier.name = this._modifier.modifier_name

    for(let i in this._modifier.options) {
      let opt = this._modifier.options[i]
      this.modifier.options.push({
        modifieroption_id: opt.modifieroption_id,
        option: opt.option,
        price: opt.price,
        is_invalid: null
      })
    }
    /**
    *  set data done
    */

    // get products
    await this.$store.dispatch('getProducts')
    // set items
    this.setItems(this._modifier, this.products)
    // update assignitems
    this.updateAssignItems(this.items)
    // original items
    this.original_items = this.getObject(this.items)
    // original assignitems
    this.original_assignitems = this.getObject(this.assignitems)
    // original modifier
    this.original_modifier = this.getObject(this.modifier)
    // set ready
    this.ready = true
  },
  beforeMount: function () { // set states ui
    // init page
    this.initPage({
      section: 'app',
      name: this.$t('app.products.title')
    })
    // set sidebar ui
    sidebarModule.init(this.getObject(require('../sidebar.json')))
    sidebarModule.update(this.sidebar, 2, [{
      "name": this.$route.query.modi_name,
      "router": {
        "name": "ModifierEdit",
        "query": {
          modi_id: this.$route.query.modi_id,
          modi_name: this.$route.query.modi_name
        }
      },
      "activeClass": 'active'
    }], {
      sidebarAtIdx: 2,
      submenuAtIdx: 2
    })
  },
  mounted: function () { // run script
    // set popup modal
    this.setModal('#confirmdeleteModal')
  },
  updated: function () { // re-rendered html

  },
  destroyed: function () { // leave this page
    this.leavePage(this.$Progress, ['clearProducts', 'clearModifier'])
  }
}
</script>
