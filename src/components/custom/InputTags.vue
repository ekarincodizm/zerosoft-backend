<template>
  <div>
    <input type="text" :id="id" class="input-tags" :placeholder="placeholder" v-model="input" @value="tags">
  </div>
</template>

<script>
import { uuid } from 'vue-uuid'

export default {
  props: {
    value: {
      type: Array
    },
    placeholder: {
      type: String,
      default: ''
    },
    delimiter: {
      type: String,
      default: ','
    }
  },
  data() {
    return {
      id: uuid.v1(),
      input: this.value,
      tags: [],
      $selectize: null
    }
  },
  methods: {
    convertArray2String (arr) {
      let str = ''
      for(let i in arr) {
        str += arr[i]
        if(i < arr.length-1) {
          str += this.delimiter
        }
      }
      return str
    },
    clearOptions () {
      this.$selectize[0].selectize.clearOptions()
    },
    addOptions (values) {
      for(let i in values) {
        this.$selectize[0].selectize.addOption({
          item: values[i]
        })
      }
    },
    setValue (value) {
      this.$selectize[0].selectize.setValue(value)
    }
  },
  watch: {
    tags() {
      // console.log('tags changed')
      this.$emit('input', this.tags)
    },
    input() {
      // console.log('input changed')
      // this.clearOptions()
      // this.addOptions(this.input)
      // this.setValue(this.input)
    }
  },
  mounted: function () {
    let t = this
    this.$selectize = $('#'+this.id).selectize({
        create: true,
        labelField:  'item',
        valueField:  'item',
        delimiter: this.delimiter,
        persist: false,
        create: function(input) {
          return {
              item: input
          }
        },
        onChange: function(value) {
          let values = value.split(t.delimiter)
          t.tags = values
        }
    })
  }
}
</script>
