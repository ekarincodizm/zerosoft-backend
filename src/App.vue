<template>
  <div id="app">

    <template v-if="$store.state.app.section == 'login'">
      <router-view/>
    </template>

    <template v-if="$store.state.app.section == 'home'">
      <router-view/>
    </template>

    <template v-if="$store.state.app.section == 'app'">
      <header-view />
      <sidebar-view />
      <router-view/>
    </template>

  </div>
</template>

<script>
import HeaderView from '@/components/apps/common/Header.vue'
import SidebarView from '@/components/apps/common/SideBar.vue'

export default {
  name: 'App',
  components: {
    HeaderView,
    SidebarView
  }
}
</script>
