<template>
  <div class="main container">
    <div class="logo col-md-12 text-center">
      <img src="./../../assets/logo-10.png">
    </div>
    <div class="col-md-12 text-center">
      <p class="highlight-color">{{ $t('message.intro1') }}</p>
    </div>
    <div class="col-md-6 form">
      <div class="alert alert-danger" role="alert" v-if="$store.state.app.error_message">
        {{ $store.state.app.error_message }}
      </div>
      <div class="form-group">
        <input type="text" class="form-control" :placeholder="$t('placeholder.usernameoremail')" v-model="email">
      </div>
      <div class="form-group">
        <input type="password" class="form-control" :placeholder="$t('placeholder.password')" v-model="password">
      </div>
      <button type="submit" class="btn btn-web btn-block" @click="login()" v-if="!$store.state.app.loading">
        {{ $t('message.login') }}
      </button>
      <button type="submit" class="btn btn-web btn-block disabled" v-if="$store.state.app.loading">
        <i class="fas fa-spinner spin"></i>
      </button>
    </div>
    <div class="col-md-12 text-center">
      <p class="txt-white">
        {{ $t('message.donthaveaccount') }}
        <router-link :to="{ name: 'SignUp' }" class="txt-white">
          {{ $t('message.registerhere') }}
        </router-link>
      </p>
    </div>
  </div>
</template>

<script>
import AuthService from '@/api/AuthService'

export default {
  name: 'SignIn',
  data () {
    return {
      email: 'testing@gmail.com',
      password: '123456',
      loading: false
    }
  },
  methods: {
    login () {
      this.$store.dispatch('Login', {
        email: this.email,
        password: this.password
      })
    }
  },
  mounted: function () {
    // set section
    this.$store.dispatch('setSection', 'login')
    // set title
    this.setTabTitle(this.$t('message.app_name') + ' - ' + this.$t('message.title_signin'))
  }
}
</script>
<style scoped>
.main {

}
.logo {
  margin: 25px 0 25px 0;
}
.form {
  padding: 25px 25px 20px 25px;
  max-width: 400px;
  margin: 25px auto;
  background: #FFF;
  border-radius: 2px;
}
.text {
  color: #282D35;
}
.txt-white {
  color: #FFF;
}
a {
  text-decoration: underline;
}
</style>
