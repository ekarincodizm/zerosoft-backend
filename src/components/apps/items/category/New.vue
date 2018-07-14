<template>
  <div id="content">
    <div class="header col-md-12">
      <div class="header-inner row align-items-center">
        <div class="col left">
          <div class="title">
            {{ $t('sidebar.categories') }} > {{ $t('sidebar.create') }}
          </div>
        </div>
      </div>
    </div>

    <div class="content col-md-12">
      <p v-if="!ready">{{ $t('message.loading') }}</p>

      <!-- <pre>{{ products }}</pre> -->

      <template v-if="ready">
        <section>
          <div class="col-md-12 no-padding">
            <section-header :title="$t('message.category')"></section-header>
            <div class="row">
              <div class="col-md-12">
                <div class="form-group row mb-0">
                  <div class="col-md-12">
                    <label>{{ $t('message.category_name') }} *</label>
                    <input type="text" class="form-control category-name" ref="category_name" v-model="textfield.category_name">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          class="assign-items mt-3"
          style="margin-bottom: 20px;"
          v-if="items.length > 0 && textfield.category_name.trim().length > 0">
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
                <span v-if="!item.active">
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
            <button class="btn btn-web" @click="save()">{{ $t('button.save') }}</button>
            <button class="btn btn-light" @click="clearForm()">{{ $t('button.cancel') }}</button>
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

export default {
  name: 'CategoryNew',
  data () {
    return {
      ready: false,

      textfield: {
        category_name: ''
      },
      items: [],
      assignitems: []
    }
  },
  computed: mapGetters({
    loading: 'getLoading',
    error: 'getError',
    products: 'getProducts'
  }),
  methods: {
    toggleAssign (item) {
      if(this.textfield.category_name.trim().length == 0) {
        this.textfield.category_name = ""
        return $(this.$refs.category_name).focus().addClass('is-invalid')
      }
      item.active = !item.active
    },
    clearForm () {
      this.ready = false

      this.textfield.category_name = ''
      this.setItems(null, this.products)

      setTimeout(()=>{
        this.ready = true
      }, 1)
    },
    async save () {

      if(this.textfield.category_name.trim().length == 0) {
        return $(this.$refs.category_name).focus().addClass('is-invalid')
      }

      let data = {
        category_name: this.textfield.category_name
      }

      if(this.assignitems.length > 0) {
        data['assign'] = this.assignitems
      }

      // console.log(data)
      // return

      let res = await this.$store.dispatch('insertCategory', data)

      console.log(res)

      if(res.success) {
        // show notify
        this.notify(this.$vs, {
          text: this.$t('message.hasbeencreated', { msg: this.textfield.category_name }),
          color:'success',
          icon: 'cloud'
        })
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
  },
  beforeCreate: function () { // clear states

  },
  created: async function () { // call api to get data and set state
    // get products
    await this.$store.dispatch('getProducts')
    // set items
    this.setItems(null, this.products)
    // update assignitems
    this.updateAssignItems(this.items)
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
    sidebarModule.init(this.getObject(require('../sidebar.json')), {
      sidebarAtIdx: 1,
      submenuAtIdx: 1
    })
  },
  mounted: function () { // run script

  },
  updated: function () { // re-rendered html

  },
  destroyed: function() { // leave this page
    this.leavePage(this.$Progress, ['clearProducts'])
  }
}
</script>
