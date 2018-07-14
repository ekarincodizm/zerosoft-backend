<template>
  <header id="header" class="row no-margin">
    <vue-progress-bar></vue-progress-bar>
    <div class="left row no-margin align-items-center">
      <div class="col">
        <router-link class="btn-backtohome" :to="{ name: 'Home'}">
          <i class="fas fa-th"></i>
        </router-link>
      </div>
    </div>
    <div class="middle row align-items-center">
      <div class="subheader col">
        <span>{{ $store.state.app.header_title }}</span>
      </div>
    </div>
    <button id="btn-show-sidebar-toggle" class="btn-no-bg">
      <i class="fas fa-bars"></i>
    </button>
    <div style="position: absolute;top: 10px;right: 10px;">
      <button class="btn btn-web" @click="switchLang('th')">TH</button>
      <button class="btn btn-web" @click="switchLang('en')">EN</button>
      <button class="btn btn-web" @click="getToken()">Get Token</button>
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Header',
  computed: mapGetters({
    auth: 'getAuth'
  }),
  methods: {
    switchLang (lang) {
      // change lang
      this.$i18n.locale = lang
      // switch lang
      this.$store.dispatch('switchLang', lang)
    },
    getToken () {
      console.log(this.auth.access_token)
    }
  }
}
</script>
