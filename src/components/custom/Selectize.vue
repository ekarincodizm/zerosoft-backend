<template>
  <div class="wrapper">
    <!-- multiple="multiple" -->
    <select
    :id="id"
    v-model="input"
    :multiple="multiple"
    :disabled="disabled"
    >
      <option value="">{{ placeholder }}</option>
      <template v-for="(item, index) in options">
        <option :value="item.value">{{ item.text }}</option>
      </template>
    </select>
    <div :id="idLoading" class="loading">
      <i class="fas fa-spinner spin"></i>
    </div>
  </div>
</template>

<script>
import { uuid } from 'vue-uuid'

export default {
  props: {
    options: {
      type: Array
    },
    updateoption: {
      type: Object
    },
    default: {
      type: [String, Array],
      default: null,
    },
    multiple: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: 'select or create new one'
    },
    create: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    clear: {
      type: Number,
      default: 0
    },
    validation: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      id: uuid.v1(),
      idLoading: uuid.v1(),
      selectedVal: null,
      pickedVal: null,
      addedVal: null,
      removedVal: null,
      input: [],
      $selectize: null,
      selectize: null
    }
  },
  methods: {
    hideLoading () {
      // disable selectize
      this.selectize.enable()
      // hide loading
      $('#'+this.idLoading).hide()
    },
    showLoading () {
      // enable selectize
      this.selectize.disable()
      // show loading
      $('#'+this.idLoading).show()
    },
    isValid ()
    {
      const $el = $('#'+this.id).parent().find('.selectize-input')

      if(typeof this.selectedVal == 'object') {
        if(!this.selectedVal || !this.selectedVal.length) {
          $el.addClass('is-invalid')
          return false
        }
      } else {
        if(!this.selectedVal) {
          $el.addClass('is-invalid')
          return false
        }
      }

      $el.removeClass('is-invalid')
      return true
    }
  },
  watch: {
    selectedVal (after, before) {
      if(this.validation != null) this.isValid()
      this.$emit('input', after)
      this.$emit('change', after)
    },
    pickedVal (after, before) {
      if(after != null) this.$emit('pick', after)
    },
    addedVal (after, before) {
      this.$emit('add', after)
    },
    removedVal (after, before) {
      if(after != null) this.$emit('remove', after)
    },
    options (after, before) {
      this.selectize.addOption(after)
    },
    updateoption (after, before) {
      // update option
      this.selectize.updateOption(after.text, after)
      // if picked is set
      if(after.picked) {
        if(typeof this.selectedVal == 'object')
        {
          // set multiple values
          this.selectize.setValue(this.selectize.getValue())
        }
        else if(typeof this.selectedVal == 'string') {
          // set single value
          this.selectize.setValue(after.value)
        }
      }
    },
    default (after, before) {
      this.selectize.setValue(after)
    },
    loading (after, before) {
      if(after)
      {
        this.showLoading()
      }
      else {
        this.hideLoading()
      }
    },
    clear () {
      this.selectize.clear()
    },
    validation () {

      var data = this.selectedVal
      var isValid = false

      if(this.isValid()) {
        isValid = true
      }

      this.$emit('validation', isValid, data)
    }
  },
  mounted: function () {
    let t = this
    this.$selectize = $('#'+this.id).selectize({
      create: t.create,
      closeAfterSelect: true,
      onChange: function(value) // item changed created picked or removed
      {
        t.selectedVal = value
        this.blur()
      },
      onOptionAdd: function (value, data) // created new item
      {
        t.addedVal = value
      },
      onItemAdd: function(value, $item) // picked item
      {
        t.pickedVal = null
        // we use set timeout cuz bugs
        setTimeout(()=>{
          t.pickedVal = value
        },1)
      },
      onItemRemove: function(value) // removed item
      {
        t.removedVal = null
        // we use set timeout cuz bugs
        setTimeout(()=>{
          t.removedVal = value
        },1)
      }
    })
    // set selectize
    this.selectize = this.$selectize[0].selectize
    // check default value is set or not
    if(this.default) {
      this.selectedVal = this.default
      this.selectize.setValue(this.default)
    }
    // check loading is set or not
    if(this.loading) {
      this.showLoading()
    }
  }
}
</script>

<style scoped>
  .wrapper {
    position: relative;
  }
  .loading {
    position: absolute;
    top: 7px;
    right: 13px;
    width: 20px;
    height: 20px;
    z-index: 1;
    text-align: center;
    background: #FFF;
    display: none;
  }
</style>
