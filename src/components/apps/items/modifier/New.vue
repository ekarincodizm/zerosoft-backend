<template>
  <div id="content">
    <div class="header col-md-12">
      <div class="header-inner row align-items-center">
        <div class="col left">
          <div class="title">
            {{ $t('sidebar.modifiers') }} > {{ $t('sidebar.create') }}
          </div>
        </div>
      </div>
    </div>

    <div class="content col-md-12">
      <p v-if="!ready">{{ $t('message.loading') }}</p>

      <template v-if="ready">
        <section>
          <div class="col-md-12 no-padding">
            <section-header :title="$t('message.modifiers')"></section-header>
            <modifier
              :validation="validation"
              :data="modifier"
              @data="form"
              ></modifier>
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
                <span class="comma" v-for="(_item, index) in item.modifiers">
                  {{ _item.modifier_name }}
                </span>
                <span v-if="item.active">
                  {{ modifier.name }}
                </span>
                <i class="fas fa-check-circle"></i>
                <i class="far fa-circle"></i>
              </div>
            </div>
          </div>
        </section>

        <section class="mt-4">
          <div class="col-md-12 no-padding">
            {{ $t('message.modifierapplytopos') }}
            <a href="#" target="_blank">
              {{ $t('button.learnmore') }}
              <i class="fas fa-external-link-alt"></i>
            </a>
          </div>
        </section>

        <section class="action-bar">
          <div class="col-md-12" v-if="!$store.state.app.loading">
            <button class="btn btn-web" @click="validation++">{{ $t('button.save') }}</button>
            <button class="btn btn-light">{{ $t('button.cancel') }}</button>
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

      items: [],
      assignitems: [],

      validation: 0,
      modifier: {
        name: null,
        is_invalid: false,
        options: []
      }
    }
  },
  computed: mapGetters({
    loading: 'getLoading',
    error: 'getError',
    products: 'getProducts'
  }),
  methods: {
    toggleAssign (item) {
      if(!this.modifier.name) {
        return
      }
      item.active = !item.active
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
    form (isValid, data)
    {
      if(!isValid) {
        return $("html, body").animate({ scrollTop: 0 }, "slow")
      }

      if(this.assignitems.length > 0) {
        data['assign'] = this.assignitems
      }

      this.save(data)
    },
    async save (data) {

      // console.log(data)
      // return

      let res = await this.$store.dispatch('insertModifier', data)

      console.log(res)

      if(res.success) {
        // show notify
        this.notify(this.$vs, {
          text: this.$t('message.hasbeencreated', { msg: data.modifier_name }),
          color:'success',
          icon: 'cloud'
        })
        // go to GoodsIssueAll page
        return this.$router.push({ name: "ModifierAll"})
      }
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
    modifier: {
      handler: function (value) {
        //console.log(value)
      },
      deep: true
    }
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
  beforeMount: function () { // set states ui
    // init page
    this.initPage({
      section: 'app',
      name: this.$t('app.products.title')
    })
    // set sidebar ui
    sidebarModule.init(this.getObject(require('../sidebar.json')), {
      sidebarAtIdx: 2,
      submenuAtIdx: 1
    })
  },
  mounted: function () { // run script

  },
  updated: function () { // re-rendered html

  },
  destroyed: function () { // leave this page
    this.leavePage(this.$Progress, ['clearProducts'])
  }
}
</script>
