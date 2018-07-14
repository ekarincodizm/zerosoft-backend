<template>
  <div id="content">
    <div class="header col-md-12">
      <div class="header-inner row align-items-center">
        <div class="col left">
          <div class="title">
              {{ $t('sidebar.userpermission') }} > {{ $t('sidebar.create') }}
          </div>
        </div>
        <div class="col-md-8 right">
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

      <!-- {{ apps }} -->

      <template v-if="!edited">
        <section>
          <div class="col-md-12 no-padding">
            <section-header :title="$t('message.general')"></section-header>
            <div class="form-row">
              <div class="col-md-6">
                <div class="form-group row">
                  <div class="col-md-12">
                    <label>{{ $t('message.username') }} *</label>
                    <input type="text"
                           class="form-control"
                           ref="username"
                           v-bind:class="[class_.username]"
                           v-model="textfieldUsername"
                           @change="onChangedUsername"
                           disabled>
                    <div class="valid-feedback">
                      {{ $t('message.availablecandidate', {candidate: this.textfieldUsername}) }}
                    </div>
                    <div class="invalid-feedback" v-if="textfieldUsername">
                      {{ $t('message.notavailablecandidate', {candidate: this.textfieldUsername}) }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group row">
                  <div class="col-md-12">
                    <label>{{ $t('message.password') }} *</label>
                    <input type="password"
                           autocomplete="off"
                           class="form-control"
                           ref="password"
                           v-bind:class="[class_.password]"
                           v-model="textfieldPassword"
                           @change="onChangedPassword"
                           disabled>
                     <div class="valid-feedback">
                       {{ $t('message.availablepassword') }}
                     </div>
                     <div class="invalid-feedback" v-if="textfieldPassword">
                       {{ $t('message.notavailablepassword') }}
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div class="col-md-12 no-padding">
            <section-header :title="$t('message.permissions')"></section-header>
            <div class="form-row" v-for="(item, index) in apps">
              <div class="form-group col-6 col-md-6 col-lg-9 mb-1" style="padding-right: 0;">
                <div class="box-input active">
                  <vs-checkbox vs-color="success"
                               v-model="item.active"
                               :disabled="true"
                               style="float: left;position: relative;top: -5px;left: -5px;">
                    {{ getAppInfo($t, item.app_id).title }}
                  </vs-checkbox>
                </div>
              </div>
              <div class="form-group col-6 col-md-6 col-lg-3 mb-1" style="padding-left: 0;">
                <select class="custom-select"
                        style="border-radius: 0 .25rem .25rem 0;"
                        :disabled="!item.active"
                        v-model="item.role"
                        disabled>
                  <option value="" disabled>{{ $t('placeholder.selectrole') }}</option>
                  <option value="manager">{{ $t('message.manager') }}</option>
                  <option value="user">{{ $t('message.user') }}</option>
                  <option value="viewer">{{ $t('message.viewer') }}</option>
                </select>
              </div>
            </div>
          </div>
        </section>
        <section class="mt-2">
          <div class="col-md-12 no-padding">
            {{ $t('message.learnmoreaboutuserpermission') }}
            <a href="#" target="_blank">
              {{ $t('button.learnmore') }}
              <i class="fas fa-external-link-alt"></i>
            </a>
          </div>
        </section>
      </template>

      <template v-if="edited">
        <section>
          <div class="col-md-12 no-padding">
            <section-header :title="$t('message.general')"></section-header>
            <div class="form-row">
              <div class="col-md-6">
                <div class="form-group row">
                  <div class="col-md-12">
                    <label>{{ $t('message.username') }} *</label>
                    <input type="text"
                           class="form-control"
                           ref="username"
                           v-bind:class="[class_.username]"
                           v-model="textfieldUsername"
                           @change="onChangedUsername"
                           disabled>
                    <div class="valid-feedback">
                      {{ $t('message.availablecandidate', {candidate: this.textfieldUsername}) }}
                    </div>
                    <div class="invalid-feedback" v-if="textfieldUsername">
                      {{ $t('message.notavailablecandidate', {candidate: this.textfieldUsername}) }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group row">
                  <div class="col-md-12">
                    <label>{{ $t('message.password') }} *</label>
                    <input type="password"
                           autocomplete="off"
                           class="form-control"
                           ref="password"
                           v-bind:class="[class_.password]"
                           v-model="textfieldPassword"
                           @change="onChangedPassword"
                           disabled>
                     <div class="valid-feedback">
                       {{ $t('message.availablepassword') }}
                     </div>
                     <div class="invalid-feedback" v-if="textfieldPassword">
                       {{ $t('message.notavailablepassword') }}
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div class="col-md-12 no-padding">
            <section-header :title="$t('message.permissions')"></section-header>
            <div class="form-row" v-for="(item, index) in apps">
              <div class="form-group col-6 col-md-6 col-lg-9 mb-1" style="padding-right: 0;">
                <div class="box-input">
                  <vs-checkbox vs-color="success"
                               v-model="item.active"
                               style="float: left;position: relative;top: -5px;left: -5px;">
                    {{ getAppInfo($t, item.app_id).title }}
                  </vs-checkbox>
                </div>
              </div>
              <div class="form-group col-6 col-md-6 col-lg-3 mb-1" style="padding-left: 0;">
                <select class="custom-select"
                        style="border-radius: 0 .25rem .25rem 0;"
                        :disabled="!item.active"
                        v-model="item.role">
                  <option value="" disabled>{{ $t('placeholder.selectrole') }}</option>
                  <option value="manager">{{ $t('message.manager') }}</option>
                  <option value="user">{{ $t('message.user') }}</option>
                  <option value="viewer">{{ $t('message.viewer') }}</option>
                </select>
              </div>
            </div>
          </div>
        </section>
        <section class="mt-2">
          <div class="col-md-12 no-padding">
            {{ $t('message.learnmoreaboutuserpermission') }}
            <a href="#" target="_blank">
              {{ $t('button.learnmore') }}
              <i class="fas fa-external-link-alt"></i>
            </a>
          </div>
        </section>
        <section class="action-bar">
          <div class="col-md-12" v-if="!$store.state.app.loading">
            <button class="btn btn-web" @click="save()">{{ $t('button.save') }}</button>
            <button class="btn btn-light" @click="cancel()">{{ $t('button.cancel') }}</button>
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
  name: 'SettingsUserPermissionNew',
  data () {
    return {
      ready: false,

      apps: [],

      textfieldUsername: '',
      textfieldPassword: '',

      class_: {
        username: null,
        password: null
      },

      edited: false
    }
  },
  computed: Object.assign(mapGetters({
    loading: 'getLoading',
    error: 'getError',
    sidebar: 'getSidebar',
    employee: 'getEmployee'
  }),{
    newEmp () {
      let permissions = []
      for(let i in this.apps) {
        let item = this.apps[i]
        if(item.active) {
          permissions.push({
            app_id: item.app_id,
            role: item.role
          })
        }
      }
      return {
        user_id: this.employee.user_id,
        emp_id: this.employee.emp_id,
        permissions: permissions
      }
    },
    IsValidform () {
      // check username
      if(!this.textfieldUsername || this.class_.username == 'is-invalid') {
        this.class_.username = 'is-invalid'
        this.$refs.username.focus()
      }
      // check password
      if(!this.textfieldPassword || this.class_.password == 'is-invalid') {
        this.class_.password = 'is-invalid'
        this.$refs.password.focus()
      }

      return this.class_.username == 'is-valid' && this.class_.password == 'is-valid'
    },
    userPermissions () {
      return this.employee.permissions
    }
  }),
  methods: {
    getPermissionInfo (app_id) {
      for(let i in this.userPermissions) {
        let item = this.userPermissions[i]
        if(item.app_id == app_id) {
          return item
        }
      }
      return null
    },
    setPermissionForm () {
      this.apps = []
      for(var i = 1; i <= 11; i++) {
        let app_id = i
        let permissionInfo = this.getPermissionInfo(app_id)
        let found = permissionInfo != null
        if(found) {
          this.apps.push({
            app_id: permissionInfo.app_id,
            role: permissionInfo.role,
            active: true
          })
        } else {
          this.apps.push({
            app_id: app_id,
            role: '',
            active: false
          })
        }
      }
    },
    clearPermissionForm () {
      for(let i in this.apps) {
        this.apps[i].active = false
      }
    },
    async save () {

      // console.log(this.newEmp)
      // return

      let res = await this.$store.dispatch('api', {
        'module': 'Employee',
        'action': {
          'name': 'updateEmployee',
          'data': this.newEmp
        }
      })

      console.log(res)

      if(res.success) {
        // get employee
        await this.$store.dispatch('api', {
          'module': 'Employee',
          'action': {
            'name': 'getEmployee',
            'data': {
              'emp_id': this.$route.query.emp_id
            }
          }
        })
        // show notify
        this.notify(this.$vs, {
          text: this.$t('message.hasbeenupdated', { msg: this.employee.username }),
          color:'success',
          icon: 'cloud'
        })
        // clear form permission
        this.clearPermissionForm()
        // set form permission
        this.setPermissionForm()
        // set edited
        this.edited = false
        // loading finish
        this.showFinish(this.$Progress)
        // scroll to top
        $("html, body").animate({ scrollTop: 0 }, "slow")
      }
    },
    async del () {
      let data = {
          user_id: this.employee.user_id,
	        emp_id: this.employee.emp_id
      }

      // console.log(data)
      // return

      const res = await this.$store.dispatch('api', {
        'module': 'Employee',
        'action': {
          'name': 'deleteEmployee',
          'data': data
        }
      })

      console.log(res)

      if(res.success) {
        // show notify
        this.notify(this.$vs, {
          text: this.$t('message.hasbeendeleted', { msg: this.employee.username }),
          color:'danger',
          icon: 'delete'
        })
        // close modal
        this.closeConfirmdeleteModal()
        // go to GoodsIssueAll page
        return this.$router.push({ name: "SettingsUserPermissionAll"})
      }
    },
    cancel () {
      // clear form permission
      this.clearPermissionForm()
      // set form permission
      this.setPermissionForm()
      // set edited
      this.edited = false
      // scroll to top
      $("html, body").animate({ scrollTop: 0 }, "slow")
    },
    async onChangedUsername ()
    {
      let candidate = this.textfieldUsername
      let data = {
        candidate: candidate
      }

      let res = await this.$store.dispatch('api', {
        'module': 'Auth',
        'action': {
          'name': 'checkCandidate',
          'data': {
            candidate: this.textfieldUsername
          }
        }
      })

      let isAvailable = res.data.is_available

      // loading finish
      this.showFinish(this.$Progress)

      if(isAvailable) {
        this.class_.username = 'is-valid'
      } else {
        this.class_.username = 'is-invalid'
      }
    },
    onChangedPassword () {
      if(this.textfieldPassword.trim().length >= 6)
      {
        this.class_.password = 'is-valid'
      }
      else {
        this.class_.password = 'is-invalid'
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
    ready: function () {
      // loading finish
      this.showFinish(this.$Progress)
    },
    apps: {
      handler: function(value) {
        for(let i in this.apps) {
          let item = this.apps[i]
          if(!item.active) {
            item.role = ''
          } else {
            if(item.role == '') {
              item.role = 'manager'
            }
          }
        }
      },
      deep: true
    },
    textfieldUsername: function () {
      this.class_.username = null
    },
    textfieldPassword: function (newVal) {
      this.class_.password = null
    },
  },
  beforeCreate: function () {

  },
  created: async function () {
    /**
     *  validation
     */
    if(!this.$route.query.emp_id) {
      return this.$router.push({ name: "SettingsUserPermissionAll"})
    }
    // get employee
    const res = await this.$store.dispatch('api', {
      'module': 'Employee',
      'action': {
        'name': 'getEmployee',
        'data': {
          'emp_id': this.$route.query.emp_id
        }
      }
    })
    if(!res.success || res.data.length == 0) {
      return this.$router.push({ name: "SettingsUserPermissionAll"})
    }
    /**
     *  validation success
     */

    // set form
    this.textfieldUsername = this.employee.username
    this.textfieldPassword = "******"

    // set apps
    this.setPermissionForm()
    // set ready
    this.ready = true
  },
  beforeMount: function () {
    // init page
    this.initPage({
      section: 'app',
      name: this.$t('app.products.title')
    })
    // set sidebar ui
    sidebarModule.init(this.getObject(require('../sidebar.json')))
    sidebarModule.update(this.sidebar, 1, [{
      "name": this.$route.query.username,
      "router": {
        "name": 'SettingsUserPermissionEdit',
        "query": {
          emp_id: this.$route.query.emp_id,
          username: this.$route.query.username
        }
      },
      "activeClass": 'active'
    }], {
      sidebarAtIdx: 1,
      submenuAtIdx: 2
    })
  },
  mounted: function () {
    // set popup modal
    this.setModal('#confirmdeleteModal')
  },
  destroyed: function() {
    this.leavePage(this.$Progress, ['clearEmployee'])
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
    border-right: none;
    color: #495057;
    line-height: 38px;
    border-radius: .25rem 0 0 .25rem;
    display: inline-block;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .box-input.active {
    background: #e9ecef;
  }
</style>
