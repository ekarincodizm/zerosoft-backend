<template>
  <div class="main container">
    <div class="logo col-md-12 text-center">
      <img src="./../../assets/logo-10.png">
    </div>
    <div class="col-md-12 text-center">
      <h4 class="highlight-color">{{ $t('message.title_createstore') }}</h4>
    </div>
    <div class="col-md-6 form">
      <div class="form-group">
        <label>{{ $t('placeholder.shopname') }}</label>
        <input type="email" class="form-control">
      </div>
      <div class="form-group">
        <label>{{ $t('placeholder.businesstype') }}</label>
        <input type="text" class="form-control">
      </div>
      <button type="submit" class="btn btn-web btn-block">{{ $t('message.create') }}</button>
    </div>
    <div class="col-md-12 text-center">
      <router-link :to="{ name: 'ChooseShop' }" class="txt-white">
        {{ $t('message.title_choosestore') }}
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateShop',
  mounted: function () {
    // set section
    this.$store.dispatch('setSection', 'login')
    // set title
    this.setTabTitle(this.$t('message.app_name') + ' - ' + this.$t('message.title_createstore'))
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
.header {
  padding: 20px 0 15px 0;
  border-bottom: solid 1px #F2F2F2;
}
.content {
  padding: 20px;
}
</style>
