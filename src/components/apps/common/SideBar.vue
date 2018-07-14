<template>
  <nav id="sidebar">
    <ul class="col-md-12 no-padding sidebar-menu">

      <li id="btn-expand-sidebar-toggle" @click="sidebarToggle()">
        <a>
          <i class="icon fas fa-arrow-left"></i>
          <i class="icon fas fa-arrow-right"></i>
          <span>{{ $t('message.short_menu') }}</span>
          <i class="fas fa-angle-left"></i>
        </a>
      </li>

      <template v-for="(item, index) in $store.state.app.sidebar">
        <template v-if="item.submenus !== undefined">
          <li :class="'sub-menu ' +  item.activeClass">
            <a>
              <i :class="'icon ' + item.icon"></i>
              <span>{{ $t(item.name) }}</span>
              <i class="fas fa-circle current"></i>
              <i class="fas fa-angle-left"></i>
              <i class="line-left"></i>
              <i class="line-bottom"></i>
            </a>
            <ul>
              <li v-for="(item_, index_) in item.submenus"
              :class="item_.activeClass"
              >
                <router-link :to="{
                  name: item_.router.name,
                  query: item_.router.query || null
                  }">
                  <span>{{ $t(item_.name) }}</span>
                  <i class="fas fa-circle"></i>
                  <i class="line-left"></i>
                  <i class="line-bottom"></i>
                </router-link>
              </li>
            </ul>
          </li>
        </template>

        <template v-if="item.submenus === undefined">
          <li :class="'no-sub-menu ' + item.activeClass">
            <router-link :to="{
              name: item.router.name,
              query: item.router.query
              }">
              <i :class="'icon ' + item.icon"></i>
              <span>{{ $t(item.name) }}</span>
              <i class="fas fa-circle current"></i>
              <i class="line-left"></i>
            </router-link>
          </li>
        </template>
      </template>

      <!-- <li class="sub-menu" data-name="Items">
        <a href="javascript:;">
          <i class="icon far fa-file-alt"></i>
          <span>ใบสั่งซื้อ</span>
          <i class="fas fa-circle current"></i>
          <i class="fas fa-angle-left"></i>
          <i class="line-left"></i>
          <i class="line-bottom"></i>
        </a>
        <ul>
          <li data-name="ProductAll">
            <a href="#">
              <span>ทั้งหมด</span>
              <i class="fas fa-circle"></i>
              <i class="line-left"></i>
              <i class="line-bottom"></i>
            </a>
          </li>
          <li>
            <a href="#">
              <span>สร้าง</span>
              <i class="fas fa-circle"></i>
              <i class="line-left"></i>
              <i class="line-bottom"></i>
            </a>
          </li>
        </ul>
      </li>

      <li data-name="" class="sub-menu">
        <a href="javascript:;">
          <i class="icon far fa-file-alt"></i>
          <span>ใบรับสินค้า</span>
          <i class="fas fa-circle current"></i>
          <i class="fas fa-angle-left"></i>
          <i class="line-bottom"></i>
        </a>
        <ul>
          <li data-name="">
            <router-link :to="{ name: 'Products' }">
              <span>ทั้งหมด</span>
              <i class="fas fa-circle"></i>
              <i class="line-left"></i>
              <i class="line-bottom"></i>
            </router-link>
          </li>
        </ul>
      </li>

      <li data-name="" v-for="index in 2">
        <a href="javascript:;">
          <i class="icon fas fa-home"></i>
          <span>{{ index }}</span>
          <i class="fas fa-circle current"></i>
          <i class="line-left"></i>
        </a>
      </li> -->
    </ul>

    <div class="overlay"></div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: mapGetters({
    uiOptions: 'getUIOptions'
  }),
  methods: {
    sidebarToggle () {
      let t = this
      setTimeout(()=>{
        let sidebarVal = ''
        let isSidebarRegular = $('body').attr('class').indexOf('sidebar-regular') >= 0
        if(isSidebarRegular) {
          sidebarVal = 'regular'
        } else {
          sidebarVal = 'expanded'
        }
        // dispatch
        t.$store.dispatch('updateUIOptions', {
          sidebar: sidebarVal
        })
      }, 10)
    },
    updateUI () {
      let md = new MobileDetect(window.navigator.userAgent)

      // set ui from local stoage
      $('body').removeClass('sidebar-regular sidebar-expanded')
      if(this.uiOptions.sidebar == 'expanded') {
        $('body').addClass('sidebar-expanded')
      } else {
        $('body').addClass('sidebar-regular')
      }

      // update active class
      let isSidebarRegular = $('body').attr('class').indexOf('sidebar-regular') >= 0
      if(isSidebarRegular && !md.phone()) {
        $('#sidebar ul > li.opened')
        .removeClass('opened')
        .addClass('active')
      }

      // set sidebar to expanded if user is mobile
      if(md.phone()) {
        $('body').removeClass('sidebar-regular sidebar-expanded')
        $('body').addClass('sidebar-expanded')
      }
    }
  },
  mounted: function () {
    this.updateUI()
  },
  updated: function() {
    this.updateUI()
  }
}
</script>

<style scoped>
  #sidebar .overlay {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    right: 239px;
    background: rgba(0,0,0,.6);
    z-index: 1;
    display: none;
  }
</style>
