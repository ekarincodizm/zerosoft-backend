<template>
  <div id="content">
    <div class="header col-md-12">
      <div class="header-inner row align-items-center">
        <div class="col left">
          <div class="title">
              {{ $t('sidebar.configuration') }} > {{ $t('sidebar.warehouses') }}
          </div>
        </div>
        <div class="col right">
          <div class="action">
            <button class="btn btn-web btn-sm" @click="openCreateModal">
              <i class="fas fa-plus-circle"></i>
              {{ $t('button.createnewwarehouse') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="content col-md-12">
      <p v-if="!ready">{{ $t('message.loading') }}</p>
      <div class="col-md-12 no-padding no-margin row">
        <div class="col-md-12 col-lg-6 " v-for="(item, index) in warehouses">
          <div class="col-md-12 card">
            <div class="primary" v-if="item.primary" v-tooltip="{text:$t('message.useprimarywarehouse'),position:'top'}">
              <i class="fas fa-key text-primary"></i>
            </div>
            <section-title :title="item.warehouse_name" fontweight="bold"></section-title>
            <div class="col-md-12 mb-2 no-padding body">
              <p v-if="item.info.address">{{ item.info.address }}</p>
              <p v-if="!item.info.address">{{ $t('message.noaddress') }}</p>
            </div>
            <div class="col-md-12 mb-2 no-padding footer">
              <button class="btn btn-sm" @click="openEditModal(item)">
                {{ $t('button.edit') }}
              </button>
              <button class="btn btn-sm btn" @click="openConfirmdeleteModal(item)" v-if="!item.primary">
                {{ $t('button.delete') }}
              </button>
              <button class="btn btn-sm btn" disabled v-if="item.primary">
                {{ $t('button.delete') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade bd-example-modal-lg" id="createModal" tabindex="-1" role="dialog" aria-labelledby="pricesModalTitle" aria-hidden="true" data-keyboard="false" data-backdrop="static">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ $t('message.createnewwarehouse') }}</h5>
            <button type="button" class="close" @click="closeCreateModal()" aria-label="Close" v-if="!$store.state.app.loading">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <section>
  						<section-title :title="$t('message.warehosename') + ' *'"></section-title>
  						<div class="col-md-12 no-padding">
                <input type="text"
                       class="form-control"
                       v-bind:class="[bindClass.inputCreateWhName]"
                       :placeholder="$t('placeholder.required')"
                       v-model="newData.warehouse_name"
                       @keyup="onKeyupInputCreateWhName">
                 <div class="valid-feedback">
                   {{ $t('message.availablewarehousename', {string: newData.warehouse_name}) }}
                 </div>
                 <div class="invalid-feedback" v-if="newData.warehouse_name">
                   {{ $t('message.notavailablewarehousename', {string: newData.warehouse_name}) }}
                 </div>
  						</div>
  					</section>
            <section>
  						<section-title :title="$t('message.warehouseshortname') + ' *'"></section-title>
  						<div class="col-md-12 no-padding">
                <input type="text"
                       class="form-control text-uppercase"
                       v-bind:class="[bindClass.inputCreateWhShortName]"
                       maxlength="6"
                       :placeholder="$t('placeholder.maximumlength6char')"
                       v-model="newData.short_name"
                       @keyup="onKeyupInputCreateWhShortName">
                 <div class="valid-feedback">
                   {{ $t('message.availablshortname', {string: newData.short_name}) }}
                 </div>
                 <div class="invalid-feedback" v-if="newData.short_name">
                   {{ $t('message.notavailablshortname', {string: newData.short_name}) }}
                 </div>
  						</div>
  					</section>
            <section>
  						<section-title :title="$t('message.address')"></section-title>
  						<div class="col-md-12 no-padding">
                <textarea class="form-control" v-model="newData.address"></textarea>
  						</div>
  					</section>
            <section style="float: left;width: 100%;margin: 5px 0 0 0;">
              <vs-checkbox style="float: left;margin: 0 5px 0 0;" v-model="newData.primary">{{ $t('message.useprimarywarehouse') }}</vs-checkbox>
              <div style="float: left;width: 100%;margin: 15px 0 0 0;" v-if="newData.primary">
                <p class="no-margin">
                  - {{ $t('message.useprimarywarehouse_detail1') }}
                  <a href="#" target="_blank">
                    {{ $t('button.learnmore') }}
                    <i class="fas fa-external-link-alt"></i>
                  </a>
                </p>
                <!-- <p class="no-margin">- ระบบจะเลือกคลังสินค้าหลักอัตโนมัติเมื่อสร้างใบเสนอราคา ใบสั่งซื้อ และ ใบนำเข้าสินค้า</p> -->
              </div>
            </section>
          </div>
          <div class="modal-footer" v-if="!$store.state.app.loading">
            <button type="button" class="btn btn-light" @click="closeCreateModal()">{{ $t('button.cancel') }}</button>
            <button type="button" class="btn btn-web" @click="save()">{{ $t('button.ok') }}</button>
          </div>
          <div class="modal-footer" v-if="$store.state.app.loading">
            <button type="button" class="btn btn-light" disabled>{{ $t('button.cancel') }}</button>
            <button type="button" class="btn btn-web" disabled>
              <i class="fas fa-spinner spin"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade bd-example-modal-lg" id="editModal" tabindex="-1" role="dialog" aria-labelledby="pricesModalTitle" aria-hidden="true" data-keyboard="false" data-backdrop="static">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ textheaderEdit }}</h5>
            <button type="button" class="close" @click="closeEditModal()" aria-label="Close" v-if="!$store.state.app.loading">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <section>
  						<section-title :title="$t('message.warehosename') + ' *'"></section-title>
  						<div class="col-md-12 no-padding">
                <input type="text"
                       class="form-control"
                       v-bind:class="[bindClass.inputEditWhName]"
                       :placeholder="$t('placeholder.required')"
                       v-model="editData.warehouse_name"
                       @keyup="onKeyupInputEditWhName">
                 <div class="valid-feedback">
                   {{ $t('message.availablewarehousename', {string: editData.warehouse_name}) }}
                 </div>
                 <div class="invalid-feedback" v-if="editData.warehouse_name">
                   {{ $t('message.notavailablewarehousename', {string: editData.warehouse_name}) }}
                 </div>
  						</div>
  					</section>
            <section>
  						<section-title :title="$t('message.warehouseshortname') + ' *'"></section-title>
  						<div class="col-md-12 no-padding">
                <input type="text"
                       class="form-control text-uppercase"
                       v-bind:class="[bindClass.inputEditWhShortName]"
                       maxlength="6"
                       :placeholder="$t('placeholder.maximumlength6char')"
                       v-model="editData.short_name"
                       @keyup="onKeyupInputEditWhShortName">
                 <div class="valid-feedback">
                   {{ $t('message.availablshortname', {string: editData.short_name}) }}
                 </div>
                 <div class="invalid-feedback" v-if="editData.short_name">
                   {{ $t('message.notavailablshortname', {string: editData.short_name}) }}
                 </div>
  						</div>
  					</section>
            <section>
  						<section-title :title="$t('message.address')"</section-title>
  						<div class="col-md-12 no-padding">
                <textarea class="form-control" v-model="editData.address"></textarea>
  						</div>
  					</section>
            <section style="float: left;width: 100%;margin: 5px 0 0 0;">
              <vs-checkbox style="float: left;margin: 0 5px 0 0;" :disabled="disabledEditPrimary" v-model="editData.primary">{{ $t('message.useprimarywarehouse') }}</vs-checkbox>
              <div style="float: left;width: 100%;margin: 15px 0 0 0;" v-if="editData.primary">
                <p class="no-margin">
                  - {{ $t('message.useprimarywarehouse_detail1') }}
                  <a href="#" target="_blank">
                    {{ $t('button.learnmore') }}
                    <i class="fas fa-external-link-alt"></i>
                  </a>
                </p>
                <!-- <p class="no-margin">- ระบบจะเลือกคลังสินค้าหลักอัตโนมัติเมื่อสร้างใบเสนอราคา ใบสั่งซื้อ และ ใบนำเข้าสินค้า</p> -->
              </div>
            </section>
          </div>
          <div class="modal-footer" v-if="!$store.state.app.loading">
            <button type="button" class="btn btn-light" @click="closeEditModal()">{{ $t('button.cancel') }}</button>
            <button type="button" class="btn btn-web" @click="edit()">{{ $t('button.edit') }}</button>
          </div>
          <div class="modal-footer" v-if="$store.state.app.loading">
            <button type="button" class="btn btn-light" disabled>{{ $t('button.cancel') }}</button>
            <button type="button" class="btn btn-web" disabled>
              <i class="fas fa-spinner spin"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade " id="confirmdeleteModal" tabindex="-1" role="dialog" aria-labelledby="pricesModalTitle" aria-hidden="true" data-keyboard="false" data-backdrop="static">
      <div class="modal-dialog " role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ $t('message.areyousuretodeletethis') }}</h5>
            <button type="button" class="close" @click="closeConfirmdeleteModal()" aria-label="Close" v-if="!$store.state.app.loading">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <template v-if="stocks.length == 0">
              <div class="col-md-12 no-padding">
                {{ $t('message.loading') }}
              </div>
            </template>
            <template v-if="stocks.length > 0">
              <div class="col-md-12 no-padding">
                <p class="no-margin">
                  <span class="text-danger">{{ $t('message.alldatainstockwillbedeleted') }} ({{ stocks.length }})</span>
                </p>
              </div>
              <div class="col-md-12 no-padding mt-2">
                <p class="no-margin" v-for="(item, index) in stocks">
                  {{ index+1 }}. {{ getProductFullName(item.product_name, item.attributes) }}
                  <!-- <span class="text-lowercase">{{ $t('message.quantity') }}</span> -->
                  "{{ $t('message.instock') }} {{ item.instock }}"
                </p>
              </div>
            </template>
            <div class="col-md-12 no-padding mt-2">
              <label>
                {{ $t('message.typedeletetoconfirm') }}
                <a href="#" target="_blank">
                  {{ $t('button.learnmore') }}
                  <i class="fas fa-external-link-alt"></i>
                </a>
              </label>
              <input type="text"
                     class="form-control"
                     v-bind:class="[bindClass.inputdelete]"
                     placeholder="delete"
                     ref="inputdelete"
                     v-model="textFieldConfirmDelete">
            </div>
          </div>
          <div class="modal-footer" v-if="!$store.state.app.loading">
            <button type="button" class="btn btn-light" @click="closeConfirmdeleteModal()">{{ $t('button.cancel') }}</button>
            <button type="button" class="btn btn-danger" @click="del()">{{ $t('button.delete') }}</button>
          </div>
          <div class="modal-footer" v-if="$store.state.app.loading">
            <button type="button" class="btn btn-light" disabled>{{ $t('button.cancel') }}</button>
            <button type="button" class="btn btn-danger" disabled>
              <i class="fas fa-spinner spin"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import sidebarModule from './../../sidebarModule'
import submenuModule from '../submenuModule'

export default {
  name: 'WarehouseManagement',
  data () {
    return {
      ready: false,
      editData: {
        warehouse_id: null,
        warehouse_name: '',
        short_name: '',
        address: '',
        primary: false
      },
      disabledEditPrimary: false,

      newData: {
        warehouse_name: '',
        short_name: '',
        address: '',
        primary: false
      },

      deleteData: {
        warehouse_id: null
      },
      textFieldConfirmDelete: '',

      textheaderEdit: '',
      textheaderDelete: '',

      bindClass: {
        inputdelete: null,

        inputCreateWhName: null,
        inputCreateWhShortName: null,

        inputEditWhName: null,
        inputEditWhShortName: null
      }
    }
  },
  computed: Object.assign(mapGetters({
    loading: 'getLoading',
    error: 'getError',
    warehouses: 'getWarehouses',
    sidebar: 'getSidebar',
    stocks: 'getStocks'
  }),{
    IsValidCreateForm () {
      if(this.newData.warehouse_name.length == 0) {
        this.bindClass.inputCreateWhName = 'is-invalid'
      } else {
        var found = false
        for(let i in this.warehouses) {
          let item = this.warehouses[i]
          if(item.warehouse_name == this.newData.warehouse_name) {
            found = true
          }
        }
        if(!found) {
          this.bindClass.inputCreateWhName = 'is-valid'
        } else {
          this.bindClass.inputCreateWhName = 'is-invalid'
        }
      }
      if(this.newData.short_name.length == 0) {
        this.bindClass.inputCreateWhShortName = 'is-invalid'
      } else {
        var found = false
        for(let i in this.warehouses) {
          let item = this.warehouses[i]
          if(item.short_name == this.newData.short_name) {
            found = true
          }
        }
        if(!found) {
          this.bindClass.inputCreateWhShortName = 'is-valid'
        } else {
          this.bindClass.inputCreateWhShortName = 'is-invalid'
        }
      }
      return this.bindClass.inputCreateWhName == 'is-valid' && this.bindClass.inputCreateWhShortName == 'is-valid'
    },
    IsValidEditForm () {
      if(this.editData.warehouse_name.length == 0) {
        this.bindClass.inputEditWhName = 'is-invalid'
      } else {
        var found = false
        for(let i in this.warehouses) {
          let item = this.warehouses[i]
          if(item.warehouse_name == this.editData.warehouse_name && item.warehouse_id != this.editData.warehouse_id) {
            found = true
          }
        }
        if(!found) {
          this.bindClass.inputEditWhName = 'is-valid'
        } else {
          this.bindClass.inputEditWhName = 'is-invalid'
        }
      }
      if(this.editData.short_name.length == 0) {
        this.bindClass.inputEditWhShortName = 'is-invalid'
      } else {
        var found = false
        for(let i in this.warehouses) {
          let item = this.warehouses[i]
          if(item.short_name == this.editData.short_name && item.warehouse_id != this.editData.warehouse_id) {
            found = true
          }
        }
        if(!found) {
          this.bindClass.inputEditWhShortName = 'is-valid'
        } else {
          this.bindClass.inputEditWhShortName = 'is-invalid'
        }
      }
      return this.bindClass.inputEditWhName == 'is-valid' && this.bindClass.inputEditWhShortName == 'is-valid'
    },
    IsValidDeleteForm () {
      if(this.textFieldConfirmDelete.trim().toLowerCase() != 'delete') {
        this.bindClass.inputdelete = 'is-invalid'
        return false
      }
      this.bindClass.inputdelete == 'is-valid'
      return true
    }
  }),
  methods: {
    async save () {
      /**
       ** validation
       **/
      if(!this.IsValidCreateForm) {
        return
      }
      /**
       ** validation success
       **/

      // save
      let res = await this.$store.dispatch('insertWarehouse', this.newData)

      if(res.success) {
        // set loading
        this.$store.dispatch('Loading', true)
        // get warehouses
        await this.$store.dispatch('getWarehouses')
        // loading finish
        this.showFinish(this.$Progress)
        // close modal
        this.closeCreateModal()
        // show notify
        this.notify(this.$vs, {
          text: this.$t('message.hasbeencreated', { msg: res.data.warehouse_name }),
          color:'success',
          icon: 'cloud'
        })
      }
    },
    async edit () {
      /**
       ** validation
       **/
      if(!this.IsValidEditForm) {
        return
      }
      /**
       ** validation success
       **/

      // save
      let res = await this.$store.dispatch('updateWarehouse', this.editData)

      if(res.success) {
        // set loading
        this.$store.dispatch('Loading', true)
        // get warehouses
        await this.$store.dispatch('getWarehouses')
        // loading finish
        this.showFinish(this.$Progress)
        // close modal
        this.closeEditModal()
        // show notify
        this.notify(this.$vs, {
          text: this.$t('message.hasbeenupdated', { msg: this.editData.warehouse_name }),
          color:'success',
          icon: 'save'
        })
      }
    },
    async del () {
      // check
      if(!this.IsValidDeleteForm) {
        this.$refs.inputdelete.focus()
        return
      }

      let res = await this.$store.dispatch('deleteWarehouse', this.deleteData)

      if(res.success) {
        // set loading
        this.$store.dispatch('Loading', true)
        // get warehouses
        await this.$store.dispatch('getWarehouses')
        // loading finish
        this.showFinish(this.$Progress)
        // close modal
        this.closeConfirmdeleteModal()
        // show notify
        this.notify(this.$vs, {
          text: this.$t('message.hasbeendeleted', { msg: this.editData.warehouse_name }),
          color:'danger',
          icon: 'delete'
        })
      }
    },
    openCreateModal () {
      this.newData = {
        warehouse_name: '',
        short_name: '',
        address: '',
        primary: false
      }

      // clear valid form
      this.bindClass.inputCreateWhName = null
      this.bindClass.inputCreateWhShortName = null

      $('#createModal').modal('show')
    },
    closeCreateModal () {
      $('#createModal').modal('hide')
    },
    openEditModal (warehouse) {

      // disable checkbox primary if this warehouse is primary
      this.disabledEditPrimary = warehouse.primary

      // set text header
      this.textheaderEdit = warehouse.warehouse_name+'/'+warehouse.short_name

      this.editData = {
        warehouse_id: warehouse.warehouse_id,
        warehouse_name: warehouse.warehouse_name,
        short_name: warehouse.short_name,
        address: warehouse.info.address,
        primary: warehouse.primary
      }

      // clear valid form
      this.bindClass.inputEditWhName = null
      this.bindClass.inputEditWhShortName = null

      $('#editModal').modal('show')
    },
    closeEditModal () {
      $('#editModal').modal('hide')
    },
    openConfirmdeleteModal (warehouse) {
      // set id
      this.deleteData.warehouse_id = warehouse.warehouse_id
      // clear text field
      this.textFieldConfirmDelete = ''
      // get stocks
      this.$store.dispatch('getStocks', warehouse.warehouse_id)
      // set text header
      this.textheaderDelete = warehouse.warehouse_name+'/'+warehouse.short_name
      // clear valid form
      this.bindClass.inputdelete = null

      $('#confirmdeleteModal').modal('show')
    },
    closeConfirmdeleteModal () {
      let that = this

      $('#confirmdeleteModal')
        .modal('hide')
        .on('hidden.bs.modal', function ()
        {
          // clear stocks
          that.$store.dispatch('clearStock')
        })
    },
    onKeyupInputCreateWhName () {
      if(this.newData.warehouse_name.length == 0) {
        this.bindClass.inputCreateWhName = 'is-invalid'
      } else {
        var found = false
        for(let i in this.warehouses) {
          let item = this.warehouses[i]
          if(item.warehouse_name == this.newData.warehouse_name) {
            found = true
          }
        }
        if(!found) {
          this.bindClass.inputCreateWhName = 'is-valid'
        } else {
          this.bindClass.inputCreateWhName = 'is-invalid'
        }
      }
    },
    onKeyupInputCreateWhShortName () {
      if(this.newData.short_name.length == 0) {
        this.bindClass.inputCreateWhShortName = 'is-invalid'
      } else {
        var found = false
        for(let i in this.warehouses) {
          let item = this.warehouses[i]
          if(item.short_name == this.newData.short_name) {
            found = true
          }
        }
        if(!found) {
          this.bindClass.inputCreateWhShortName = 'is-valid'
        } else {
          this.bindClass.inputCreateWhShortName = 'is-invalid'
        }
      }
    },
    onKeyupInputEditWhName () {
      if(this.editData.warehouse_name.length == 0) {
        this.bindClass.inputEditWhName = 'is-invalid'
      } else {
        var found = false
        for(let i in this.warehouses) {
          let item = this.warehouses[i]
          if(item.warehouse_name == this.editData.warehouse_name && item.warehouse_id != this.editData.warehouse_id) {
            found = true
          }
        }
        if(!found) {
          this.bindClass.inputEditWhName = 'is-valid'
        } else {
          this.bindClass.inputEditWhName = 'is-invalid'
        }
      }
    },
    onKeyupInputEditWhShortName () {
      if(this.editData.short_name.length == 0) {
        this.bindClass.inputEditWhShortName = 'is-invalid'
      } else {
        var found = false
        for(let i in this.warehouses) {
          let item = this.warehouses[i]
          if(item.short_name == this.editData.short_name && item.warehouse_id != this.editData.warehouse_id) {
            found = true
          }
        }
        if(!found) {
          this.bindClass.inputEditWhShortName = 'is-valid'
        } else {
          this.bindClass.inputEditWhShortName = 'is-invalid'
        }
      }
    }
  },
  watch: {
    loading: function (isLoading) {
      this.showLoading(this.$Progress, isLoading)
    },
    error: function (msg) {
      this.showError(this.$Progress, this.$vs, msg, {
        title: this.$t('message.message'),
        text: this.$t('message.somethingwentwrong')
      })
    },
    ready: function () {
      // loading finish
      this.showFinish(this.$Progress)
    },
    warehouses: function (newVal, oldVal) {
      sidebarModule.init(this.getObject(require('../sidebar.json')))
      sidebarModule.update(this.sidebar, 1, submenuModule.getWarehouses(this.warehouses))
      sidebarModule.active({
        sidebarAtIdx: 5,
        submenuAtIdx: 2
      })

      // set ready
      this.ready = true
    },
    newData: {
      handler: function(after, before) {
        // convert text to uppercase
        if(after.short_name) this.newData.short_name = after.short_name.toUpperCase()
        // valid form
        // this.IsValidCreateForm
      },
      deep: true
    },
    editData: {
      handler: function(after, before) {
        if(after.short_name) this.editData.short_name = after.short_name.toUpperCase()
      },
      deep: true
    },
    stocks () {
      // loading finish
      this.showFinish(this.$Progress)
    }
  },
  beforeCreate: function () {

  },
  created: async function () {
    // get warehouses
    if(this.warehouses.length == 0) {
      await this.$store.dispatch('getWarehouses')
    }
    // set ready
    this.ready = true
  },
  beforeMount: function () {
    // init page
    this.initPage({
      section: 'app',
      name: this.$t('app.inventory.title')
    })
    // set sidebar stockcontrols ui
    sidebarModule.init(this.getObject(require('../sidebar.json')))
    sidebarModule.update(this.sidebar, 1, submenuModule.getWarehouses(this.warehouses))
    sidebarModule.active({
      sidebarAtIdx: 5,
      submenuAtIdx: 2
    })
  },
  mounted: function () {
    // set popup modal
    this.setModal('#createModal')
    this.setModal('#editModal')
    this.setModal('#confirmdeleteModal')
  },
  destroyed: function() {
    this.leavePage(this.$Progress, [])
  }
}
</script>

<style scoped>
  #content .content {
    padding-top: 18px;
    padding-left: 15px;
    padding-right: 15px;
  }
  .card {
    background: #FFF;
    border: solid 1px #D8E2E7;
    border-radius: 2px;
    padding: 15px 15px 7px 15px;
    margin: 10px 0 15px 0;
    position: relative;;
  }
  .card .primary {
    position: absolute;
    top: 13px;
    right: 15px;
    font-size: 13px;
    z-index: 1;
  }
  .card p {
    margin: 0;
  }
  .card .footer {
    text-align: right;
  }
  .card .footer button {
    /* float: right; */
  }
  .btn-web {
    min-width: 92px;
  }
  @media (max-width: 575.98px) {
    .card .footer button {
      width: 100%;
      margin-top: 8px;
    }
  }
</style>
