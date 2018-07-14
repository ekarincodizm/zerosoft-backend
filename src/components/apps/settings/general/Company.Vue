<template>
  <div id="content">
    <div class="header col-md-12">
      <div class="header-inner row align-items-center">
        <div class="col-md-8 left">
          <div class="title">
              {{ $t('sidebar.general') }} > {{ $t('sidebar.companyinfo') }}
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

      <template v-if="!edited">
        <section>
          <div class="col-md-12 no-padding">
            <section-header :title="$t('message.about')"></section-header>
            <div class="form-row">
              <div class="col-md-6">
                <div class="form-group row">
                  <div class="col-md-12">
                    <label>{{ $t('message.shopname') }} *</label>
                    <input type="text" class="form-control" disabled v-model="form.shop_name">
                  </div>
                </div>
              </div>
              <!-- <div class="col-md-6">
                <div class="form-group row">
                  <div class="col-md-12">
                    <label>{{ $t('message.businesstype') }} *</label>
                    <input type="text" class="form-control" disabled>
                  </div>
                </div>
              </div> -->
            </div>
          </div>
        </section>
      </template>

      <template v-if="edited">
        <section>
          <div class="col-md-12 no-padding">
            <section-header :title="$t('message.about')"></section-header>
            <div class="form-row">
              <div class="col-md-6">
                <div class="form-group row">
                  <div class="col-md-12">
                    <label>{{ $t('message.shopname') }} *</label>
                    <input type="text"
                           class="form-control"
                           ref="shopname"
                           v-bind:class="[class_.shop_name]"
                           v-model="form.shop_name"
                           @keyup="onkeyupShopname">
                  </div>
                </div>
              </div>
              <!-- <div class="col-md-6">
                <div class="form-group row">
                  <div class="col-md-12">
                    <label>{{ $t('message.businesstype') }} *</label>
                    <input type="text" class="form-control">
                  </div>
                </div>
              </div> -->
            </div>
          </div>
        </section>
        <section class="action-bar">
          <div class="col-md-12" v-if="!$store.state.app.loading">
            <button class="btn btn-web" @click="save()">{{ $t('button.save') }}</button>
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

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import sidebarModule from './../../sidebarModule'

export default {
  name: 'SettingsCompany',
  data () {
    return {
      ready: false,

      edited: false,
      updated: false,

      form: {
        shop_name: '',
      },

      originalForm: null,

      class_: {
        shop_name: null
      }
    }
  },
  computed: Object.assign(mapGetters({
    loading: 'getLoading',
    error: 'getError',
    shopInfo: 'getShopInfo'
  }),{
    IsValidform () {
      // check shop_name
      if(this.form.shop_name.trim().length == 0) {
        this.class_.shop_name = 'is-invalid'
      } else {
        this.class_.shop_name = null
      }
      return this.form.shop_name.trim().length > 0
    }
  }),
  methods: {
    async save () {

      if(!this.IsValidform) {
        // scroll to top
        return $("html, body").animate({ scrollTop: 0 }, "slow")
      }

      let data = {
        shop_name: this.form.shop_name
      }

      // console.log(data)

      let res = await this.$store.dispatch('updateShop', data)

      if(res.success) {
        // show notify
        this.notify(this.$vs, {
          text: this.$t('message.updated'),
          color:'success',
          icon: 'cloud'
        })
        // loading finish
        this.showFinish(this.$Progress)
        // set original form
        this.originalForm = this.getObject(this.form)
        // set edited
        this.edited = false
      }
    },
    onkeyupShopname () {
      this.IsValidform
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
    edited: function (after) {
      if(!this.edited && !this.updated) {
        this.form = this.getObject(this.originalForm)
        this.IsValidform
      } else {
        this.updated = false
      }
    }
  },
  beforeCreate: function () {

  },
  created: function () {
    // set from
    this.form.shop_name = this.shopInfo.shop_name
    // set original form
    this.originalForm = this.getObject(this.form)

    // set ready
    this.ready = true
  },
  beforeMount: function () {
    // init page
    this.initPage({
      section: 'app',
      name: this.$t('app.settings.title')
    })
    // set sidebar ui
    sidebarModule.init(this.getObject(require('../sidebar.json')), {
      sidebarAtIdx: 0,
      submenuAtIdx: 0
    })
  },
  mounted: function () {

  },
  destroyed: function() {
    this.leavePage(this.$Progress, [])
  }
}
</script>
