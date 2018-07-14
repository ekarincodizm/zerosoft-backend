<template>
  <div class="main container">
    <div class="logo col-md-12 text-center">
      <img src="./../../assets/logo-10.png">
    </div>
    <div class="col-md-12 text-center">
      <h4 class="highlight-color">{{ $t('message.title_choosestore') }}</h4>
    </div>
    <p class="text-center mt-4" v-if="$store.state.app.loading && shops.length == 0">Loading...</p>
    <div class="col-md-6 form no-padding" v-for="(item, index) in shops">
      <div class="col-md-12 text-center header">
        <strong>{{ item.shop_name }}</strong>
      </div>
      <div class="col-md-12 content">
        <p>-</p>
        <button type="submit" class="btn btn-web btn-block" @click="loginShop(item.shop_id)" v-if="!$store.state.app.loading">
          {{ $t('message.loginshop') }}
        </button>
        <button type="submit" class="btn btn-web btn-block disabled" v-if="$store.state.app.loading">
          <i class="fas fa-spinner spin"></i>
        </button>
      </div>
    </div>
    <!-- <div class="col-md-6 form no-padding">
      <div class="col-md-12 text-center header">
        <strong>บังเว้ยเห้ย สาขามีนบุรี</strong>
      </div>
      <div class="col-md-12 content">
        <p>ตลาดมีนบุรี มีนบุรี กรุงเทพมหานคร 10530</p>
        <button type="submit" class="btn btn-web btn-block" @click="loginShop()">เข้าใช้งาน</button>
      </div>
    </div> -->
    <div class="col-md-12 text-center mb-4" v-if="shops.length > 0">
      <router-link :to="{ name: 'CreateShop' }" class="txt-white">
        {{ $t('message.title_createstore') }}
      </router-link>
    </div>
  </div>
</template>

<script>
import AuthService from '@/api/AuthService'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ChooseShop',
  computed: mapGetters({
    shops: 'getShops'
  }),
  methods: {
    loginShop (shop_id) {
      this.$store.dispatch('LoginShop', {
        shop_id: shop_id
      })
    }
  },
  mounted: function () {
    // set section
    this.$store.dispatch('setSection', 'login')
    // set title
    this.setTabTitle(this.$t('message.app_name') + ' - ' + this.$t('message.title_choosestore'))

    // clear shops
    this.$store.dispatch('clearShops')
    // get shops
    this.$store.dispatch('getShops')
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
.header {
  padding: 20px 0 15px 0;
  border-bottom: solid 1px #F2F2F2;
}
.content {
  padding: 20px;
}
</style>
