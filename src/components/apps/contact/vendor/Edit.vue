<template>
  <div id="content">
    <div class="header col-md-12">
      <div class="header-inner row align-items-center">
        <div class="col left">
          <div class="title">
              {{ $t('sidebar.vendor') }} > {{ $t('sidebar.create') }}
          </div>
        </div>
        <div class="col-md-8 right">
          <div class="action" v-if="vendor !== null">
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

      <template v-if="!edited && ready">
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
                           @keyup="onKeyupName"
                           disabled>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="form-group row">
                  <div class="col-md-12">
                    <label>{{ $t('message.address') }}</label>
                    <textarea class="form-control" v-model="form.address" disabled></textarea>
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
                    <input type="text" class="form-control" ref="" v-model="form.email" disabled>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="form-group row">
                  <div class="col-md-12">
                    <label>{{ $t('message.tel') }}</label>
                    <input type="text" class="form-control" ref="" v-model="form.tel" disabled>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="form-group row">
                  <div class="col-md-12">
                    <label>{{ $t('message.note') }}</label>
                    <textarea class="form-control" v-model="form.note" disabled></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </template>

      <template v-if="edited && ready">
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
            <button class="btn btn-web" @click="update()">{{ $t('button.edit') }}</button>
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

export default {
  name: 'ContactVendorEdit',
  data () {
    return {
      ready: false,

      edited: false,
      updated: false,

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
    error: 'getError',
    sidebar: 'getSidebar',
    vendor: 'getVendor'
  }),{
    data () {
      var data = {
          vendor_id: this.vendor.vendor_id,
          name: this.form.name
      }
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
    async update (option = {}) {
      if(!this.isValidForm) {
        this.$refs.name.focus()
        return $("html, body").animate({ scrollTop: 0 }, "slow")
      }

      // console.log(this.data)
      // return

      let res = await this.$store.dispatch('updateVendor', this.data)

      // console.log(res)
      // return

      if(res.success) {
        // show notify
        this.notify(this.$vs, {
          text: this.$t('message.hasbeenupdated', { msg: this.data.name }),
          color:'success',
          icon: 'save'
        })
        // get products
        await this.$store.dispatch('getVendor', {
          vendor_id: this.vendor.vendor_id
        })
        // set original form
        this.originalForm = this.getObject(this.form)
        // set edited
        this.edited = false
        // set updated
        this.updated = true
        // set sidebar ui
        sidebarModule.init(this.getObject(require('../sidebar.json')))
        sidebarModule.update(this.sidebar, 2, [{
          "name": this.vendor.vendor_name,
          "router": {
            "name": "ContactVendorEdit",
            "query": {
              ven_id: this.vendor.vendor_id,
              ven_name: this.vendor.vendor_name
            }
          },
          "activeClass": 'active'
        }], {
          sidebarAtIdx: 2,
          submenuAtIdx: 2
        })
        // loading finish
        this.showFinish(this.$Progress)
      }
    },
    async del () {
      let data = {
        vendor_id: this.vendor.vendor_id
      }

      let res = await this.$store.dispatch('deleteVendor', data)

      // console.log(res)
      // return

      if(res.success) {
        // show notify
        this.notify(this.$vs, {
          text: this.$t('message.hasbeendeleted', { msg: this.vendor.vendor_name }),
          color:'danger',
          icon: 'delete'
        })
        // close modal
        this.closeConfirmdeleteModal()
        // go to ContactVendorAll page
        return this.$router.push({ name: "ContactVendorAll"})
      }
    },
    onKeyupName () {
      this.isValidForm
    },
    clearForm () {
      this.form = this.getObject(this.originalForm)
      this.form.birthdate = new Date(this.originalForm.birthdate)
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
    ready: function () {
      // loading finish
      this.showFinish(this.$Progress)
      // dataTable option
      let option = this.dataTableOption()
      // set dataTable
      setTimeout(()=>{$('#dataTable').DataTable(option)}, 1)
    },
    edited: function (after, before) {
      if(!this.edited && !this.updated) {
        this.clearForm()
      } else {
        this.updated = false
      }
    }
  },
  beforeCreate: function () {

  },
  created: async function () {
    /**
     *  validation
     */
    if(!this.$route.query.ven_id) {
      return this.$router.push({ name: "ContactVendorAll"})
    }
    // get vendor
    let res = await this.$store.dispatch('getVendor', {
      vendor_id: this.$route.query.ven_id
    })
    if(!res.success) {
      return this.$router.push({ name: "ContactVendorAll"})
    }
    if(res.data.length == 0) {
      return this.$router.push({ name: "ContactVendorAll"})
    }
    /**
     *  validation success
     */
    // set form
    this.form.name = this.vendor.vendor_name
    this.form.gender = this.vendor.gender
    this.form.birthdate = new Date(this.vendor.birthdate)
    this.form.address = this.vendor.address
    for(let i in this.vendor.contacts) {
      let item = this.vendor.contacts[i]
      if(item.platfrom == 'email') {
        this.form.email = item.source
      }
      if(item.platfrom == 'tel') {
        this.form.tel = item.source
      }
    }
    this.form.note = this.vendor.note,
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
    sidebarModule.init(this.getObject(require('../sidebar.json')))
    sidebarModule.update(this.sidebar, 2, [{
      "name": this.$route.query.ven_name,
      "router": {
        "name": "ContactVendorEdit",
        "query": {
          ven_id: this.$route.query.ven_id,
          ven_name: this.$route.query.ven_name
        }
      },
      "activeClass": 'active'
    }], {
      sidebarAtIdx: 2,
      submenuAtIdx: 2
    })
  },
  mounted: function () {
    // set popup modal
    this.setModal('#confirmdeleteModal')
  },
  destroyed: function() {
    this.leavePage(this.$Progress, ['clearVendor'])
  }
}
</script>
