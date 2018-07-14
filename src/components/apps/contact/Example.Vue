<template>
  <div id="content">
    <div class="header col-md-12">
      <div class="header-inner row align-items-center">
        <div class="col left">
          <div class="title">
              {{ $t('sidebar.test') }} > {{ $t('sidebar.test') }}
          </div>
        </div>
      </div>
    </div>

    <div class="content col-md-12">
      <p v-if="!ready">{{ $t('message.loading') }}</p>
      <div class="col-md-12 no-padding no-margin row">
        Page Example
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
    error: 'getError'
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
    },
  },
  beforeCreate: function () {

  },
  created: function () {
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
    this.leavePage(this.$Progress, [])
  }
}
</script>
