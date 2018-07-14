<template>
  <div>
    <div class="row" id="modifier-wrapper">
      <div class="col-md-12">
        <div class="form-group row">
          <div class="col-md-12">
            <label>{{ $t('message.modifier_name') }} *</label>
            <input type="text"
                   class="form-control modifier-name"
                   v-bind:class="[data.is_invalid]"
                   @keyup="keyupName()"
                   v-model="data.name"
                   :disabled="disabled">
          </div>
        </div>
      </div>
      <div class="col-md-12 container-label">
        <label>{{ $t('message.options') }}</label>
      </div>
      <div class="col-md-12 container-items">
        <div class="item row no-margin"
             v-bind:class="[item.is_invalid]"
             v-for="(item, index) in data.options">
          <div class="col no-padding">
            <input type="text"
                   class="form-control"
                   :placeholder="$t('placeholder.option_name')"
                   @keyup="keyupOption(index)"
                   @click="inputClick(index)"
                   v-model="item.option"
                   :disabled="disabled">
            <div class="wall"></div>
          </div>
          <div class="col no-padding">
            <input type="text"
                   class="form-control text-select-all"
                   :placeholder="$t('placeholder.price')"
                   @click="inputClick(index)"
                   v-model="item.price"
                   :disabled="disabled">
            <button class="btn-delete"
                    @click="del(index)"
                    v-if="data.options.length > 1 && index < data.options.length-1 && !disabled">
                <i class="far fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object
    },
    data: {
      type: Object
    },
    validation: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      is_invalid: false
    }
  },
  methods: {
    inputClick (index) {
      let isLast = index == this.data.options.length-1
      if(isLast) {
        this.add()
      }
    },
    add () {
      this.data.options.push({
        option: null,
        price: null,
        is_invalid: ''
      })
    },
    del (index) {
      this.data.options.splice(index, 1)
    },
    keyupName () {
      if(!this.data.name) {
        this.data.is_invalid = 'is-invalid'
      } else {
        this.data.is_invalid = false
      }
    },
    keyupOption (index) {
      if(this.data.options[index].option)
      {
        this.data.options[index].is_invalid = false
      }
      else {
        this.data.options[index].is_invalid = 'is-invalid'
      }
    },
    isValid () {
      /*
       *  validation
       */
      const data = this.getData(this.data)
      var isInValidName = false
      var isInValidOptions = false
      var foundAtIdxs = []

      if(this.data.name == null)
      {
        isInValidName = true
      }
      else if (typeof this.data.name == 'string') {
        if(this.data.name.trim().length == 0) {
          isInValidName = true
        }
      }

      if(isInValidName) {
        this.data.is_invalid = 'is-invalid'
      } else {
        this.data.is_invalid = false
      }

      for(let i in data.options) {
        let opt = data.options[i]
        if(!opt.option) {
          isInValidOptions = true
          foundAtIdxs.push(parseInt(i))
        }
      }

      if( data.options.length == 0) foundAtIdxs.push(0)

      for(let i in foundAtIdxs) {
        let index = foundAtIdxs[i]
        this.data.options[index].is_invalid = 'is-invalid'
      }

      if(isInValidName || isInValidOptions || data.options.length == 0) {
        return false
      }

      return true
    },
    getData (modifier) {
      var data = {
        modifier_name: modifier.name,
        options: this.getObject(modifier.options)
      }

      var newOptions = []

      // remove key, data we don't need
      for(let i in data.options) {
        if(data.options[i].option || data.options[i].price) {
          delete data.options[i].is_invalid
          newOptions.push(data.options[i])
        }
      }

      data.options = newOptions

      // parse float
      for(let i in data.options) {
        data.options[i].price = parseFloat(data.options[i].price) || 0
      }

      return data
    },
    validateform () {
      var data = null
      var isValid = false
      if(this.isValid())
      {
        data = this.getData(this.data)
        isValid = true
      }
      this.$emit('data', isValid, data)
    }
  },
  watch: {
    validation (after) {
      this.validateform()
    }
  },
  mounted: function () {
    if(!this.disabled)
    {
      this.add()
    }
  }
}
</script>

<style scoped>
.item {
  background: #FFF;
  height: 40px;
  border: 1px solid #ced4da;
  border-bottom: none;
  position: relative;
}
.item.is-invalid {
  border: solid 1px #dc3545;
  border-bottom: solid 1px #dc3545 !important;
}
.item input[type="text"] {
  border: none;
  height: 100%;
  border-radius: 0;
}
.item:last-of-type {
  border-bottom: 1px solid #ced4da;
}
.item .wall {
  position: absolute;
  top: 12px;
  right: 0;
  width: 1px;
  height: 16px;
  background: #ced4da;
}
.item .btn-delete {
  position: absolute;
  top: 0px;
  right: 0px;
  color: #BBBBBB;
  background: none;
  border: none;
  padding: 7px 10px 5px 10px;
}
button:focus {
  outline: none;
}
</style>
