<template>
  <div id="content">
    <div class="header col-md-12">
      <div class="header-inner row align-items-center">
        <div class="col-md-4 left">
          <div class="title">
            {{ $t('sidebar.categories') }} > {{ this.$route.query.cat_name }}
          </div>
        </div>
        <div class="col-md-8 right">
          <div class="action" v-if="category !== null">
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

      <!-- <pre>{{ products }}</pre> -->

      <template v-if="ready && !edited">
        <section>
          <div class="col-md-12 no-padding">
            <section-header :title="$t('message.category')"></section-header>
            <div class="row">
              <div class="col-md-12">
                <div class="form-group row mb-0">
                  <div class="col-md-12">
                    <label>{{ $t('message.category_name') }} *</label>
                    <input type="text" class="form-control" :value="textfield.category_name" disabled>
                  </div>
                </div>
              </div>
            </div>
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

      <template v-if="ready && edited">
        <section>
          <div class="col-md-12 no-padding">
            <section-header :title="$t('message.category')"></section-header>
            <div class="row">
              <div class="col-md-12">
                <div class="form-group row mb-0">
                  <div class="col-md-12">
                    <label>{{ $t('message.category_name') }} *</label>
                    <input type="text" class="form-control category-name" :placeholder="$t('placeholder.required')" ref="category_name" v-model="textfield.category_name">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section class="assign-items mt-3" style="margin-bottom: 20px;" v-if="items.length > 0">
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
                <span v-if="!item.active && item.category_id != category.category_id">
                  {{ item.category_name }}
                </span>
                <span v-if="item.active">
                  {{ textfield.category_name }}
                </span>
                <i class="fas fa-check-circle"></i>
                <i class="far fa-circle"></i>
              </div>
            </div>
          </div>
        </section>
        <section class="action-bar">
          <div class="col-md-12" v-if="!$store.state.app.loading">
            <button class="btn btn-web" @click="update()">{{ $t('button.edit') }}</button>
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

    <div class="modal fade " id="confirmdeleteModal" tabindex="-1" role="dialog" aria-labelledby="pricesModalTitle" aria-hidden="true" data-keyboard="false" data-backdrop="static">
      <div class="modal-dialog " role="document">
        <div class="modal-content">
          <div class="modal-header" style="border-bottom: none;">
            <h5 class="modal-title" v-if="category">
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
  name: 'CategoryEdit',
  data () {
    return {
      ready: false,

      textfield: {
        category_name: ''
      },
      original_textfield: null,

      items: [],
      original_items: null,

      assignitems: [],
      original_assignitems: null,

      edited: false,
      updated: false
    }
  },
  computed: mapGetters({
    loading: 'getLoading',
    error: 'getError',
    sidebar: 'getSidebar',
    products: 'getProducts',
    category: 'getCategory',
  }),
  methods: {
    toggleAssign (item) {
      if(this.textfield.category_name.trim().length == 0) {
        this.textfield.category_name = ""
        return $(this.$refs.category_name).focus().addClass('is-invalid')
      }
      item.active = !item.active
    },
    async update () {
      if(this.textfield.category_name.trim().length == 0) {
        return $(this.$refs.category_name).focus().addClass('is-invalid')
      }

      let data = {
        category_id: this.category.category_id,
        category_name: this.textfield.category_name
      }

      if(this.assignitems.length > 0) {
        data['assign'] = this.assignitems
      }

      // console.log(data)
      // return

      let res = await this.$store.dispatch('updateCategory', data)

      // console.log(res)

      if(res.success) {
        // show notify
        this.notify(this.$vs, {
          text: this.$t('message.hasbeenupdated', { msg: this.textfield.category_name }),
          color:'success',
          icon: 'save'
        })
        // get products
        await this.$store.dispatch('getProducts')
        // set items
        this.setItems(this.category, this.products)
        // update assignitems
        this.updateAssignItems(this.items)
        // original textfield
        this.original_textfield = this.getObject(this.textfield)
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
    },
    async del () {
      let data = {
        category_id: this.category.category_id
      }

      // console.log(data)
      // return

      let res = await this.$store.dispatch('deleteCategory', data)

      // console.log(res)
      // return

      if(res.success) {
        // show notify
        this.notify(this.$vs, {
          text: this.$t('message.hasbeendeleted', { msg: this.textfield.category_name }),
          color:'danger',
          icon: 'delete'
        })
        // close modal
        this.closeConfirmdeleteModal()
        // go to GoodsIssueAll page
        return this.$router.push({ name: "CategoryAll"})
      }
    },
    setItems (category, products) {
      this.items = []
      for(let i in products) {
        let product = products[i]
        var active = false
        if(category) {
          if(category.category_id == product.category_id) {
            active = true
          }
        }
        this.items.push({
          product_id: product.product_id,
          product_name: product.product_name,
          category_id: product.category_id,
          category_name: product.category_name,
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
    },
    items: {
      handler: function(after) {
        let items = after
        this.updateAssignItems(items)
      },
      deep: true
    },
    textfield: {
      handler: function(after) {
        if(after.category_name.trim().length > 0) {
          $(this.$refs.category_name).removeClass('is-invalid')
        } else {
          $(this.$refs.category_name).addClass('is-invalid')
        }
      },
      deep: true
    },
    edited: function (after, before) {
      if(!this.edited && !this.updated) {
        this.textfield = this.getObject(this.original_textfield)
        this.items = this.getObject(this.original_items)
        this.assignitems = this.getObject(this.original_assignitems)
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
    if(!this.$route.query.cat_id) {
      return this.$router.push({ name: "CategoryAll"})
    }
    // get category
    let res = await this.$store.dispatch('getCategory', {
      category_id: this.$route.query.cat_id
    })
    if(!res.success) {
      return this.$router.push({ name: "CategoryAll"})
    }
    if(res.data.length == 0) {
      return this.$router.push({ name: "CategoryAll"})
    }
    /**
     *  validation success
     */
    // set textfield category_name
    this.textfield.category_name = this.category.category_name
    // get products
    await this.$store.dispatch('getProducts')
    // set items
    this.setItems(this.category, this.products)
    // update assignitems
    this.updateAssignItems(this.items)
    // original textfield
    this.original_textfield = this.getObject(this.textfield)
    // original items
    this.original_items = this.getObject(this.items)
    // original assignitems
    this.original_assignitems = this.getObject(this.assignitems)
    // set ready
    this.ready = true
  },
  beforeMount: function() { // set states ui
    // init page
    this.initPage({
      section: 'app',
      name: this.$t('app.products.title')
    })
    // set sidebar ui
    sidebarModule.init(this.getObject(require('../sidebar.json')))
    sidebarModule.update(this.sidebar, 1, [{
      "name": this.$route.query.cat_name,
      "router": {
        "name": "CategoryEdit",
        "query": {
          cat_id: this.$route.query.cat_id,
          cat_name: this.$route.query.cat_name
        }
      },
      "activeClass": 'active'
    }], {
      sidebarAtIdx: 1,
      submenuAtIdx: 2
    })
  },
  mounted: function () { // run script
    // set popup modal
    this.setModal('#confirmdeleteModal')
  },
  updated: function () { // re-rendered html

  },
  destroyed: function() { // leave this page
    this.leavePage(this.$Progress, ['clearProducts', 'clearCategory'])
  }
}
</script>
