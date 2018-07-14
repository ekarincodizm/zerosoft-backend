<template>
  <div id="content">
    <div class="header col-md-12">
      <div class="header-inner row align-items-center">
        <div class="col left">
          <div class="title">
              {{ $t('sidebar.userpermission') }} > {{ $t('sidebar.all') }}
          </div>
        </div>
      </div>
    </div>

    <div class="content col-md-12">
      <p v-if="!ready">{{ $t('message.loading') }}</p>

      <!-- <pre>{{ employees }}</pre> -->

      <div class="col-md-12 no-padding" v-if="ready">
        <table id="dataTable" class="table table-bordered" style="width: 100%;">
          <thead>
            <tr>
              <th>{{ $t('message.username') }}</th>
              <th class="text-center">{{ $t('message.permissions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in employees">
              <td>
                <router-link :to="{
                    name: 'SettingsUserPermissionEdit',
                    query: {
                      emp_id: item.emp_id,
                      username: item.username
                    }
                  }">
                  {{ item.username }}
                </router-link>
              </td>
              <td class="text-center">
                <span class="badge badge-secondary"
                      :style="'margin-right: 5px;background:'+getAppInfo($t, permission.app_id).bgcolor"
                      v-for="(permission, index) in item.permissions">
                  <i :class="getAppInfo($t, permission.app_id).icon"></i>
                  {{ getAppInfo($t, permission.app_id).title }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import sidebarModule from './../../sidebarModule'

export default {
  name: 'SettingsUserPermissionAll',
  data () {
    return {
      ready: false
    }
  },
  computed: mapGetters({
    loading: 'getLoading',
    error: 'getError',
    employees: 'getEmployees'
  }),
  methods: {

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
  created: async function () {
    // get employees all
    await this.$store.dispatch('api', {
      'module': 'Employee',
      'action': {
        'name': 'getEmployees'
      }
    })
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
    sidebarModule.init(this.getObject(require('../sidebar.json')), {
      sidebarAtIdx: 1,
      submenuAtIdx: 0
    })
  },
  mounted: function () {

  },
  destroyed: function() {
    this.leavePage(this.$Progress, ['clearEmployees'])
  }
}
</script>
