<template>
  <div id="content">
    <div class="header col-md-12">
      <div class="header-inner row align-items-center">
        <div class="col left">
          <div class="title">
            {{ $t('sidebar.modifiers') }} > {{ $t('sidebar.all') }}
          </div>
        </div>
      </div>
    </div>

    <div class="content col-md-12">
      <p v-if="!ready">{{ $t('message.loading') }}</p>

      <!-- <pre>{{ modifiers }}</pre> -->

      <div class="col-md-12 no-padding" v-if="ready">
        <table id="dataTable" class="table table-bordered" style="width: 100%;">
          <thead>
            <tr>
              <th>{{ $t('message.modifiers') }}</th>
              <th class="text-center" style="width: 15%;">{{ $t('message.assignitems') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in modifiers">
              <td>
                <router-link :to="{
                    name: 'ModifierEdit',
                    query: {
                      modi_id: item.modifier_id,
                      modi_name: item.modifier_name
                    }
                  }">
                  {{ item.modifier_name }}
                </router-link>
              </td>
              <td class="text-center" style="width: 15%;">
                {{ item.assign.length }}
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
  name: 'ModifierAll',
  data () {
    return {
      ready: false
    }
  },
  computed: mapGetters({
    loading: 'getLoading',
    error: 'getError',
    modifiers: 'getModifiers'
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
    }
  },
  beforeCreate: function () { // clear states

  },
  created: async function () { // call api to get data and set state
    // get modifiers
    await this.$store.dispatch('getModifiers')
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
      sidebarAtIdx: 2,
      submenuAtIdx: 0
    })
  },
  mounted: function () { // run script

  },
  updated: function () { // re-rendered html

  },
  destroyed: function() { // leave this page
    this.leavePage(this.$Progress, ['clearModifiers'])
  }
}
</script>
