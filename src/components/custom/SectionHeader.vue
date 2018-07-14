<template>
  <div>
    <!-- <div class="col-md-12 no-padding subheader">
      <span>{{ title }}</span>
      <hr/>
    </div> -->
    <div class="col-md-12 row no-padding no-margin subheader">
      <template v-if="subtitle">
        <span class="col-md-6 no-padding">{{ title }}</span>
        <span class="col-md-6 no-padding subtitle">
          {{ subtitle }}
        </span>
      </template>
      <template v-if="!subtitle">
        <span class="col no-padding">{{ title }}</span>
      </template>
    </div>
    <hr style="margin: 5px 0 15px 0;"/>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String
    },
    subtitle: {
      type: String,
      default: null
    }
  }
}
</script>

<style scoped>
  .subheader span {
    font-size: 26px;
    color: #676767;
  }
  .subheader hr {
    border-top: solid 1px #D8E2E7;margin-top: 0;
  }
  .subtitle {
    text-align: right;
  }
  @media (max-width: 767.98px) {
    .subtitle {
      text-align: left;
      font-size: 18px;
    }
  }
</style>
