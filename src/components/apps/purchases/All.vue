<template>
  <div id="content">
    <div class="header col-md-12">
      <div class="header-inner row align-items-center">
        <div class="col left">
          <div class="title">
            {{ $t('message.app_purchases') }} > {{ $t('sidebar.all') }}
          </div>
        </div>
        <!--<div class="col right">
          <div class="action">
            <router-link :to="{ name: 'NewProduct' }" class="btn btn-web">
              เพิ่มสินค้าใหม่ <i class="fas fa-plus"></i>
            </router-link>
          </div>
        </div>-->
      </div>
    </div>

    <div class="content col-md-12">
      Purchase All
    </div>
  </div>
</template>

<script>
import sidebar from './sidebar'

export default {
  name: 'ProductAll',
  mounted: function () {
    // set last router
    this.$store.dispatch('setLastRouter', this.$router.history.current.name)
    // set section
    this.$store.dispatch('setSection', 'app')
    // set title
    this.setTitle(this.$t('message.app_purchases'))

    // sidebar[0].submenus.push({
    //   "name": "PO-00000001",
    //   "router": "Home",
    //   "activeClass": 'active'
    // })

    // set sidebar menu active
    this.$store.dispatch('setSidebar', sidebar)
    // set header
    this.$store.dispatch('setHeader', this.$t('message.app_purchases'))
  }
}
</script>
