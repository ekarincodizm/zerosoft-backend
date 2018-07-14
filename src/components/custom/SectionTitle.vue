<template>
  <div>
    <div class="col-md-12 no-padding text-header">
      <span :style="'font-weight:' + fontweight ">{{ title }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String
    },
    fontweight: {
      type: String,
      default: 'normal'
    }
  },
}
</script>

<style scoped>

</style>
