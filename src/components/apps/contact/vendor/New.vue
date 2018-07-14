<template>
  <div id="content">
    <div class="header col-md-12">
      <div class="header-inner row align-items-center">
        <div class="col left">
          <div class="title">
              {{ $t('sidebar.vendor') }} > {{ $t('sidebar.create') }}
          </div>
        </div>
      </div>
    </div>

    <div class="content col-md-12">
      <p v-if="!ready">{{ $t('message.loading') }}</p>

      <section>
        <div class="col-md-12 no-padding">
          <section-header :title="$t('message.vendor')+' / '+$t('message.partner')"></section-header>
          <div class="form-row">
            <div class="col-md-12">
              <div class="form-group row">
                <div class="col-md-12">
                  <label>{{ $t('message.storecompanyperson') }} *</label>
                  <input type="text"
                         class="form-control"
                         v-bind:class="[bindClass.name]"
                         ref="name"
                         v-model="form.name"
                         @keyup="onKeyupName">
                </div>
              </div>
            </div>
            <div class="col-md-12">
              <div class="form-group row">
                <div class="col-md-12">
                  <label>{{ $t('message.address') }}</label>
                  <textarea class="form-control" v-model="form.address"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div class="col-md-12 no-padding">
          <section-header :title="$t('message.contactsandnote')"></section-header>
          <div class="form-row">
            <div class="col-md-12">
              <div class="form-group row">
                <div class="col-md-12">
                  <label>{{ $t('message.email') }}</label>
                  <input type="text" class="form-control" ref="" v-model="form.email">
                </div>
              </div>
            </div>
            <div class="col-md-12">
              <div class="form-group row">
                <div class="col-md-12">
                  <label>{{ $t('message.tel') }}</label>
                  <input type="text" class="form-control" ref="" v-model="form.tel">
                </div>
              </div>
            </div>
            <div class="col-md-12">
              <div class="form-group row">
                <div class="col-md-12">
                  <label>{{ $t('message.note') }}</label>
                  <textarea class="form-control" v-model="form.note"></textarea>
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
          <button class="btn btn-light" @click="clearForm()">{{ $t('button.cancel') }}</button>
        </div>
        <div class="col-md-12" v-if="$store.state.app.loading">
          <button class="btn btn-web" disabled>
            <i class="fas fa-spinner spin"></i>
          </button>
          <button class="btn btn-light" disabled>{{ $t('button.cancel') }}</button>
        </div>
      </section>

    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import sidebarModule from './../../sidebarModule'

export default {
  name: 'ContactVendorNew',
  data () {
    return {
      ready: false,

      form: {
        name: '',
        address: '',
        email: '',
        tel: '',
        note: ''
      },

      originalForm: null,

      bindClass: {
        name: null
      }
    }
  },
  computed: Object.assign(mapGetters({
    loading: 'getLoading',
    error: 'getError'
  }),{
    data () {
      var data = {name: this.form.name}
      var contacts = []

      if(this.form.address) data['address'] = this.form.address
      if(this.form.note) data['note'] = this.form.note

      if(this.form.email) {
        contacts.push({
          platfrom: 'email',
          source: this.form.email
        })
      }
      if(this.form.tel) {
        contacts.push({
          platfrom: 'tel',
          source: this.form.tel
        })
      }

      if(contacts.length > 0) {
        data['contacts'] = contacts
      }

      return data
    },
    isValidForm() {
      if(this.form.name.trim().length == 0) {
        this.bindClass.name = 'is-invalid'
        return false
      } else {
        this.bindClass.name = null
        return true
      }
    }
  }),
  methods: {
    async save (option = {}) {
      if(!this.isValidForm) {
        this.$refs.name.focus()
        $("html, body").animate({ scrollTop: 0 }, "slow")
        return
      }

      let res = await this.$store.dispatch('insertVendor', this.data)

      if(res.success) {
        // show notify
        this.notify(this.$vs, {
          text: this.$t('message.hasbeencreated', { msg: this.data.name }),
          color:'success',
          icon: 'cloud'
        })
        if(option.isCreateAnother) {
          // loading finish
          this.showFinish(this.$Progress)
          // clear form
          this.clearForm()
          // scroll to top
          $("html, body").animate({ scrollTop: 0 }, "slow")
        } else {
          // go to ContactVendorAll page
          return this.$router.push({ name: "ContactVendorAll"})
        }
      }
    },
    onKeyupName () {
      this.isValidForm
    },
    clearForm () {
      this.form = this.getObject(this.originalForm)
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
      // dataTable option
      let option = this.dataTableOption()
      // set dataTable
      setTimeout(()=>{$('#dataTable').DataTable(option)}, 1)
    },
  },
  beforeCreate: function () {

  },
  created: function () {
    // set original form
    this.originalForm = this.getObject(this.form)
    // set ready
    this.ready = true
  },
  beforeMount: function () {
    // init page
    this.initPage({
      section: 'app',
      name: this.$t('app.contacts.title')
    })
    // set sidebar ui
    sidebarModule.init(this.getObject(require('../sidebar.json')), {
      sidebarAtIdx: 2,
      submenuAtIdx: 1
    })
  },
  mounted: function () {

  },
  destroyed: function() {
    this.leavePage(this.$Progress, [''])
  }
}
</script>
