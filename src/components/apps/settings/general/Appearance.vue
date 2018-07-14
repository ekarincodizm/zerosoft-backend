<template>
  <div id="content">
    <div class="header col-md-12">
      <div class="header-inner row align-items-center">
        <div class="col-md-8 left">
          <div class="title">
              {{ $t('sidebar.general') }} > {{ $t('sidebar.appearance') }}
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
            <section-header :title="$t('message.formats')"></section-header>
            <div class="form-row">
              <div class="col-md-6">
                <div class="form-row">
                  <div class="col-md-12" style="height: 32px;">
                    {{ $t('message.formatnumberandusecomma') }}
                  </div>
                  <div class="form-group col-4" style="padding-right: 0;">
                    <select class="custom-select" disabled style="border-radius: .25rem 0 0 .25rem;" v-model="form.selectDecimalPlacesFormat">
                      <option value="0">{{ $t('message.decimalplaces', {number: 0}) }}</option>
                      <option value="1">{{ $t('message.decimalplaces', {number: 1}) }}</option>
                      <option value="2">{{ $t('message.decimalplaces', {number: 2}) }}</option>
                    </select>
                  </div>
                  <div class="form-group col-4" style="padding: 0;">
                    <div class="box-input active" style="border-radius: 0;">
                      <vs-checkbox vs-color="primary" :disabled="true" style="float: left;position: relative;top: -5px;left: -5px;" v-model="form.checkboxUsecomma">
                        {{ $t('message.usecomma') }}
                      </vs-checkbox>
                    </div>
                  </div>
                  <div class="form-group col-4" style="padding-left: 0;">
                    <div class="box-input active">
                      {{ $t('message.formatnumberpreview', {string: previewFormatNumber}) }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group row">
                  <div class="col-md-12">
                    <label>{{ $t('message.formatdate') }}</label>
                    <select class="custom-select" disabled v-model="form.selectDateFormat">
                      <option value="YYYY/MM/DD">YYYY/MM/DD</option>
                      <option value="YYYY/DD/MM">YYYY/DD/MM</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div class="col-md-12 no-padding">
            <section-header :title="$t('message.local')"></section-header>
            <div class="form-row">
              <div class="col-md-6">
                <label>{{ $t('message.currency') }}</label>
                <select class="custom-select" disabled v-model="form.selectCurrency">
                  <option value="USD">USD</option>
                  <option value="THB">THB</option>
                </select>
              </div>
              <div class="col-md-6">
                <label>{{ $t('message.language') }}</label>
                <select class="custom-select" disabled v-model="form.selectLanguage">
                  <option value="en">English</option>
                  <option value="th">ภาษาไทย</option>
                </select>
              </div>
            </div>
          </div>
        </section>
      </template>

      <template v-if="edited">
        <section>
          <div class="col-md-12 no-padding">
            <section-header :title="$t('message.formats')"></section-header>
            <div class="form-row">
              <div class="col-md-6">
                <div class="form-row">
                  <div class="col-md-12" style="height: 32px;">
                    {{ $t('message.formatnumberandusecomma') }}
                  </div>
                  <div class="form-group col-4" style="padding-right: 0;">
                    <select class="custom-select" style="border-radius: .25rem 0 0 .25rem;" v-model="form.selectDecimalPlacesFormat">
                      <option value="0">{{ $t('message.decimalplaces', {number: 0}) }}</option>
                      <option value="1">{{ $t('message.decimalplaces', {number: 1}) }}</option>
                      <option value="2">{{ $t('message.decimalplaces', {number: 2}) }}</option>
                    </select>
                  </div>
                  <div class="form-group col-4" style="padding: 0;">
                    <div class="box-input">
                      <vs-checkbox vs-color="primary" style="float: left;position: relative;top: -5px;left: -5px;" v-model="form.checkboxUsecomma">
                        {{ $t('message.usecomma') }}
                      </vs-checkbox>
                    </div>
                  </div>
                  <div class="form-group col-4" style="padding-left: 0;">
                    <div class="box-input active">
                      {{ $t('message.formatnumberpreview', {string: previewFormatNumber}) }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group row">
                  <div class="col-md-12">
                    <label>{{ $t('message.formatdate') }}</label>
                    <select class="custom-select" v-model="form.selectDateFormat">
                      <option value="YYYY/MM/DD">YYYY/MM/DD</option>
                      <option value="YYYY/DD/MM">YYYY/DD/MM</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div class="col-md-12 no-padding">
            <section-header :title="$t('message.local')"></section-header>
            <div class="form-row">
              <div class="col-md-6">
                <label>{{ $t('message.currency') }}</label>
                <select class="custom-select" v-model="form.selectCurrency">
                  <option value="USD">USD</option>
                  <option value="THB">THB</option>
                </select>
              </div>
              <div class="col-md-6">
                <label>{{ $t('message.language') }}</label>
                <select class="custom-select" v-model="form.selectLanguage">
                  <option value="en">English</option>
                  <option value="th">ภาษาไทย</option>
                </select>
              </div>
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
  name: 'SettingsAppearance',
  data () {
    return {
      ready: false,
      edited: false,
      updated: false,
      form: {
        selectDecimalPlacesFormat: 0,
        checkboxUsecomma: false,
        selectDateFormat: null,
        selectCurrency: null,
        selectLanguage: null,
      },
      originalForm: null
    }
  },
  computed: Object.assign(mapGetters({
    loading: 'getLoading',
    error: 'getError',
    shopInfo: 'getShopInfo'
  }),{
    previewFormatNumber () {
      const decimalplaces = this.form.selectDecimalPlacesFormat
      const useComma = this.form.checkboxUsecomma
      const defaultNumber = 1500
      if(!useComma) {
        return defaultNumber.toFixed(decimalplaces)
      }
      return defaultNumber.toLocaleString('en-US',{minimumFractionDigits: decimalplaces})
    }
  }),
  methods: {
    async save () {
      let data = {
        "appearance": {
      		"currency": this.form.selectCurrency,
      		"decimal_places": parseInt(this.form.selectDecimalPlacesFormat),
      		"use_comma": this.form.checkboxUsecomma,
      		"date": this.form.selectDateFormat
      	}
      }

      // console.log(data)
      // return

      let res = await this.$store.dispatch('updateSettings', data)

      console.log(res)

      if(res.success) {
        /*
        ** set language
        */
        this.$i18n.locale = this.form.selectLanguage
        // switch lang
        this.$store.dispatch('switchLang', this.form.selectLanguage)
        // init page, set tab title with new language
        this.initPage({
          section: 'app',
          name: this.$t('app.settings.title')
        })
        /*
        ** set language done
        */

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
      } else {
        this.updated = false
      }
    }
  },
  beforeCreate: function () {

  },
  created: function () {
    // set form
    this.form.selectDecimalPlacesFormat = this.shopInfo.settings.general.appearance.format_number.decimal.place
    this.form.checkboxUsecomma = this.shopInfo.settings.general.appearance.format_number.use_comma
    this.form.selectDateFormat = this.shopInfo.settings.general.appearance.format_date
    this.form.selectCurrency = this.shopInfo.settings.general.appearance.currency
    this.form.selectLanguage = this.$store.state.app.lang
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
  .box-input {
    position: relative;
    padding-left: 10px;
    height: 38px;
    background: #fff;
    border: 1px solid #ced4da;
    border-left: none;
    color: #495057;
    line-height: 38px;
    border-radius: 0;
    display: inline-block;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .box-input.active {
    background: #e9ecef;
    border-radius: 0 .25rem .25rem 0;
  }
</style>
