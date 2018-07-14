<template>
  <div id="home" class="col-md-12 no-padding">
    <div class="header row no-margin">
      <div class="left col-3 col-sm-6 col-md-6 row align-items-center no-margin">
        <div class="col no-padding">
          <button class="btn-back" @click="goback()" v-if="$store.state.app.last_router">
            <i class="fas fa-arrow-left"></i>
          </button>
          <span class="name">{{ auth.shop_info.shop_name }}</span>
        </div>
      </div>
      <div class="right col-9 col-sm-6 col-md-6 row align-items-center no-margin text-right">
        <div class="col no-padding">

          <div class="dropdown no-padding mr-2" style="float: right;">
            <button class="btn no-bg dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span class="name">
                {{ auth.user_info.email || auth.user_info.username || auth.user_info.user_id }}
              </span>
              <i class="fas fa-user-circle"></i>
            </button>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
              <a class="dropdown-item" v-if="auth.user_info.type == 'owner'">
                <i class="fas fa-user-circle"></i> {{ $t('message.my_account') }}
              </a>
              <a class="dropdown-item" @click="gotoShops()" v-if="auth.user_info.type == 'owner'">
                <i class="fas fa-store-alt"></i> {{ $t('message.switch_store') }}
              </a>
              <a class="dropdown-item">
                <i class="fas fa-question"></i> Help
              </a>
              <a class="dropdown-item" @click="logout()">
                <i class="fas fa-power-off"></i> {{ $t('message.logout') }}
              </a>
            </div>
          </div>

          <div class="dropdown no-padding mr-4" style="float: right;">
            <button class="btn no-bg dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span v-if="$store.state.app.lang == 'en'">English</span>
              <span v-if="$store.state.app.lang == 'th'">ภาษาไทย</span>
            </button>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
              <a class="dropdown-item" @click="switchLang('en')"><img src="https://lipis.github.io/flag-icon-css/flags/4x3/gb.svg" height="16" style="position: relative;left: -7px;border-radius: 2px;"> English</a>
              <a class="dropdown-item" @click="switchLang('th')"><img src="https://lipis.github.io/flag-icon-css/flags/4x3/th.svg" height="16" style="position: relative;left: -7px;border-radius: 2px;"> ภาษาไทย</a>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div class="apps row">
      <div
        class="col-4 col-sm-3 col-md-2 item"
        v-if="checkAuth({app_id: 10})">
        <router-link :to="{ name: 'Home'}">
          <div class="wraper" :style="'background:' + $t('app.ecommerce.bgcolor')">
            <i :class="$t('app.ecommerce.icon')"></i>
          </div>
          <span>{{ $t('app.ecommerce.title') }}</span>
        </router-link>
      </div>
      <div
        class="col-4 col-sm-3 col-md-2 item"
        v-if="checkAuth({app_id: 1})  ">
        <router-link :to="{ name: 'Home'}">
          <div class="wraper" :style="'background:' + $t('app.pos.bgcolor')">
            <i :class="$t('app.pos.icon')"></i>
          </div>
          <span>{{ $t('app.pos.title') }}</span>
        </router-link>
      </div>
      <div
        class="col-4 col-sm-3 col-md-2 item"
        v-if="checkAuth({app_id: 5})">
        <router-link :to="{ name: 'Home'}">
          <div class="wraper" :style="'background:' + $t('app.sales.bgcolor')">
            <i :class="$t('app.sales.icon')"></i>
          </div>
          <span>{{ $t('app.sales.title') }}</span>
        </router-link>
      </div>
      <div
        class="col-4 col-sm-3 col-md-2 item"
        v-if="checkAuth({app_id: 4})">
        <router-link :to="{ name: 'PurchaseAll'}">
          <div class="wraper" :style="'background:' + $t('app.purchases.bgcolor')">
            <i :class="$t('app.purchases.icon')"></i>
          </div>
          <span>{{ $t('app.purchases.title') }}</span>
        </router-link>
      </div>
      <div
        class="col-4 col-sm-3 col-md-2 item"
        v-if="checkAuth({app_id: 6})  ">
        <router-link :to="{ name: 'Home'}">
          <div class="wraper" :style="'background:' + $t('app.expenses.bgcolor')">
            <i :class="$t('app.expenses.icon')"></i>
          </div>
          <span>{{ $t('app.expenses.title') }}</span>
        </router-link>
      </div>
      <div
        class="col-4 col-sm-3 col-md-2 item"
        v-if="checkAuth({app_id: 3})">
        <router-link :to="{ name: 'InventoryTodo'}">
          <div class="wraper" :style="'background:' + $t('app.inventory.bgcolor')">
            <i :class="$t('app.inventory.icon')"></i>
            <div class="loading" v-if="$store.state.app.loading && warehouses.length == 0">
              <i class="fas fa-spinner spin"></i>
          </div>
        </div>
        <span>{{ $t('app.inventory.title') }}</span>
      </router-link>
      </div>
      <div
        class="col-4 col-sm-3 col-md-2 item"
        v-if="checkAuth({app_id: 7})">
        <router-link :to="{ name: 'Home'}">
          <div class="wraper" :style="'background:' + $t('app.crm.bgcolor')">
            <i :class="$t('app.crm.icon')"></i>
          </div>
          <span>{{ $t('app.crm.title') }}</span>
        </router-link>
      </div>
      <div
        class="col-4 col-sm-3 col-md-2 item"
        v-if="checkAuth({app_id: 8})">
        <router-link :to="{ name: 'Home'}">
          <div class="wraper" :style="'background:' + $t('app.reports.bgcolor')">
            <i :class="$t('app.reports.icon')"></i>
          </div>
          <span>{{ $t('app.reports.title') }}</span>
        </router-link>
      </div>
      <div
        class="col-4 col-sm-3 col-md-2 item"
        v-if="checkAuth({app_id: 9})">
        <router-link :to="{ name: 'Home'}">
          <div class="wraper" :style="'background:' + $t('app.bi.bgcolor')">
            <i :class="$t('app.bi.icon')"></i>
          </div>
          <span>{{ $t('app.bi.title') }}</span>
        </router-link>
      </div>
      <div
        class="col-4 col-sm-3 col-md-2 item"
        v-if="checkAuth({app_id: 11})  ">
        <router-link :to="{ name: 'ContactListAll'}">
          <div class="wraper" :style="'background:' + $t('app.contacts.bgcolor')">
            <i :class="$t('app.contacts.icon')"></i>
          </div>
          <span>{{ $t('app.contacts.title') }}</span>
        </router-link>
      </div>
      <div
        class="col-4 col-sm-3 col-md-2 item"
        v-if="checkAuth({app_id: 2})">
        <router-link :to="{ name: 'ProductAll'}">
          <div class="wraper" :style="'background:' + $t('app.products.bgcolor')">
            <i :class="$t('app.products.icon')"></i>
          </div>
          <span>{{ $t('app.products.title') }}</span>
        </router-link>
      </div>
      <div
        class="col-4 col-sm-3 col-md-2 item"
        v-if="
        auth.user_info.type == 'owner'
        ">
        <router-link :to="{ name: 'AppsCategoryAll'}">
          <div class="wraper" :style="'background:' + $t('app.installapp.bgcolor')">
            <i :class="$t('app.installapp.icon')"></i>
          </div>
          <span>{{ $t('app.installapp.title') }}</span>
        </router-link>
      </div>
      <div
        class="col-4 col-sm-3 col-md-2 item"
        v-if="
        auth.user_info.type == 'owner'
        ">
        <router-link :to="{ name: 'SettingsCompany'}">
          <div class="wraper" :style="'background:' + $t('app.settings.bgcolor')">
            <i :class="$t('app.settings.icon')"></i>
          </div>
          <span>{{ $t('app.settings.title') }}</span>
        </router-link>
      </div>
    </div>

    <div class="footer col-md-12 text-center">
        <img src="./../../assets/logo-10.png">
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  computed: mapGetters({
    auth: 'getAuth',
    warehouses: 'getWarehouses',
  }),
  methods: {
    goback () {
      this.$router.go(-1)
    },
    gotoShops () {
      this.$store.dispatch('LogoutShop')
      this.$router.push({ name: "ChooseShop"})
    },
    logout() {
      this.$router.push({ name: "Logout"})
    },
    switchLang (lang) {
      // change lang
      this.$i18n.locale = lang
      // switch lang
      this.$store.dispatch('switchLang', lang)
    }
  },
  watch: {
    warehouses: function (newVal, oldVal) {
      //console.log('warehouses Changed')
    }
  },
  created: function () {

  },
  beforeMount: function () {
    // set section
    this.$store.dispatch('setSection', 'home')
    // set title
    this.setTabTitle(this.auth.shop_info.shop_name)
  },
  mounted: function () {

  },
  beforeDestroy: function () {

  },
  destroyed: function() {

  }
}
</script>
