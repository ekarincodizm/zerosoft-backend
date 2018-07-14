<template>
  <div class="main container">
    <div class="logo col-md-12 text-center">
      <img src="./../../assets/logo-10.png">
    </div>
    <div class="col-md-12 text-center">
      <h4 class="highlight-color">{{ $t('message.register') }}</h4>
      <p class="highlight-color">{{ $t('message.intro2') }}</p>
    </div>
    <div class="col-md-6 form">
      <div class="alert alert-danger" role="alert" v-if="$store.state.app.error_message">
        {{ $store.state.app.error_message }}
      </div>
      <div class="form-group">
        <label>{{ $t('message.shopname') }}</label>
        <input type="text" class="form-control" v-model="shop_name">
      </div>
      <div class="form-group">
        <label>{{ $t('message.businesstype') }}</label>
        <input type="text" class="form-control" v-model="business_id">
      </div>
      <div class="form-group">
        <label>{{ $t('message.email') }}</label>
        <input type="email" class="form-control" v-model="email">
      </div>
      <div class="form-group">
        <label>{{ $t('message.password') }}</label>
        <input type="password" class="form-control" v-model="password">
      </div>
      <button type="submit" class="btn btn-web btn-block" @click="register()" v-if="!$store.state.app.loading">
        {{ $t('message.register') }}
      </button>
      <button type="submit" class="btn btn-web btn-block disabled" v-if="$store.state.app.loading">
        <i class="fas fa-spinner spin"></i>
      </button>
    </div>
    <div class="col-md-12 text-center mb-4">
      <span class="txt-white">
        {{ $t('message.alreadyaccount') }}
        <router-link :to="{ name: 'SignIn' }" class="txt-white">
          {{ $t('message.login') }}
        </router-link>
      </span>
    </div>
  </div>
</template>

<script>
import AuthService from '@/api/AuthService'

export default {
  name: 'SignUp',
  data () {
    return {
      email: 'testing@gmail.com',
      password: '123456',
      first_name: null,
      last_name: null,
      shop_name: 'my shop',
      business_id: 1
    }
  },
  methods: {
    async register () {
      this.$store.dispatch('Register', {
        email: this.email,
        password: this.password,
        first_name: this.first_name,
        last_name: this.last_name,
        shop_name: this.shop_name,
        business_id: this.business_id
      })
      // try {
      //   let response = await AuthService.register({
      //     email: this.email,
      //     password: this.password,
      //     first_name: this.first_name,
      //     last_name: this.last_name,
      //     shop_name: this.shop_name,
      //     business_id: this.business_id
      //   })
      //   let result = response.data
      //   if(result.success) {
      //     console.log(result.data)
      //   } else {
      //     console.log(result.status_message)
      //   }
      // } catch (e) {
      //   console.log(e)
      // }
    }
  },
  mounted: function () {
    // set section
    this.$store.dispatch('setSection', 'login')
    // set title
    this.setTabTitle(this.$t('message.app_name') + ' - ' + this.$t('message.title_signup'))
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
