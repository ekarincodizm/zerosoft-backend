<template>
  <div id="content">
    <div class="header col-md-12">
      <div class="header-inner row align-items-center">
        <div class="col left">
          <div class="title">
              {{ $t('sidebar.customer') }} > {{ $t('sidebar.all') }}
          </div>
        </div>
      </div>
    </div>

    <div class="content col-md-12">
      <p v-if="!ready">{{ $t('message.loading') }}</p>

      <div class="col-md-12 no-padding" v-if="ready">
        <table id="dataTable" class="table table-bordered" style="width: 100%;">
          <thead>
            <tr>
              <th>{{ $t('message.name') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in customers">
              <td>
                <router-link :to="{
                    name: 'ContactCustomerEdit',
                    query: {
                      cus_id: item.customer_id,
                      cus_name: item.customer_name
                    }
                  }">
                  {{ item.customer_name }}
                </router-link>
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
  name: 'Test',
  data () {
    return {
      ready: false
    }
  },
  computed: mapGetters({
    loading: 'getLoading',
    error: 'getError',
    customers: 'getCustomers'
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
    // get customers
    await this.$store.dispatch('getCustomers')
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
      sidebarAtIdx: 1,
      submenuAtIdx: 0
    })
  },
  mounted: function () {

  },
  destroyed: function() {
    this.leavePage(this.$Progress, ['clearCustomers'])
  }
}
</script>
