<template>
  <div id="content">
    <div class="header col-md-12">
      <div class="header-inner row align-items-center">
        <div class="col left">
          <div class="title">
            {{ $t('sidebar.products') }} > {{ $t('sidebar.all') }}
          </div>
        </div>
      </div>
    </div>

    <div class="content col-md-12">
      <p v-if="!ready">{{ $t('message.loading') }}</p>
      <!-- <pre>{{ products }}</pre> -->
      <table id="dataTable" class="table table-bordered" v-if="ready" style="width: 100%">
        <thead>
          <tr>
            <th v-if="tableopts.image">{{ $t('message.image') }}</th>
            <th v-if="tableopts.pcode">{{ $t('message.pcode') }}</th>
            <th v-if="tableopts.barcode">{{ $t('message.barcode') }}</th>
            <th v-if="tableopts.sku">{{ $t('message.sku') }}</th>
            <th v-if="tableopts.brand">{{ $t('message.brand') }}</th>
            <th v-if="tableopts.category">{{ $t('message.category') }}</th>
            <th v-if="tableopts.modifier">{{ $t('message.modifier') }}</th>
            <th>{{ $t('message.item') }}</th>
            <th>{{ $t('message.price') }}</th>
            <th v-if="tableopts.cost">{{ $t('message.cost') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in products">
            <td v-if="tableopts.image">
              <!-- <router-link :to="{name: 'ProductEdit', query: {
                'pid': item.product_id,
                'pname': item.product_name
                }}">
                <img src="./../../../../assets/images/items/no-image.png" width="68" height="68">
              </router-link> -->
            </td>
            <td align="center" v-if="tableopts.pcode"></td>
            <td align="center" v-if="tableopts.barcode"></td>
            <td align="center" v-if="tableopts.sku"></td>
            <td v-if="tableopts.brand">
              <router-link :to="{name: 'Home'}" class="badge badge-secondary" v-if="item.brand_name">
                {{ item.brand_name }}
              </router-link>
            </td>
            <td v-if="tableopts.category">
              <router-link :to="{
                  name: 'CategoryEdit',
                  query: {
                    cat_id: item.category_id,
                    cat_name: item.category_name
                  }
                }" class="badge badge-secondary" v-if="item.category_name">
                {{ item.category_name }}
              </router-link>
            </td>
            <td v-if="tableopts.modifier">
              <router-link :to="{
                  name: 'ModifierEdit',
                  query: {
                    modi_id: modifier.modifier_id,
                    modi_name: modifier.modifier_name
                  }
                }"
                class="badge badge-secondary"
                style="margin-right: 5px;"
                v-for="(modifier, index) in item.modifiers"
                :key="modifier.modifier_id">
                {{ modifier.modifier_name }}
              </router-link>
            </td>
            <td>
              <div v-for="price in item.prices">
                <router-link :to="{name: 'ProductEdit', query: {
                  'pid': item.product_id,
                  'pname': item.product_name
                  }}">
                  {{ getProductFullName(item.product_name, price.attributes) }}
                </router-link>
              </div>
            </td>
            <td>
              <div v-for="price in item.prices">
                <template v-if="price.price">
                  {{ currency }} {{ getNumber(price.price) }}
                </template>
                <template v-else>
                  {{ $t('message.variable') }}
                </template>
              </div>
            </td>
            <td v-if="tableopts.cost">
              <div v-for="price in item.prices">
                <template v-if="price.cost">
                  {{ currency }} {{ getNumber(price.cost) }}
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import sidebarModule from './../../sidebarModule'

export default {
  name: 'ProductAll',
  data () {
    return {
      ready: false
    }
  },
  computed: mapGetters({
    loading: 'getLoading',
    error: 'getError',
    products: 'getProducts',
    tableopts: 'getTableopts',
    currency: 'getCurrency'
  }),
  methods: {
    updateUIDataTable () {
      $('#datatable tbody tr').each(function(idx) {
        var maxHeight = 0
        var div = $(this).find('td > div')
        div.each(function() {
          if($(this).height() > maxHeight) maxHeight = $(this).height()
        })
        div.each(function() {
          $(this).css({
            height: maxHeight + 'px',
          })
        })
      })
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
    ready: function() {
      // loading finish
      this.showFinish(this.$Progress)
      // dataTable option
      let option = this.dataTableOption()
      // set dataTable
      setTimeout(()=>{$('#dataTable').DataTable(option)}, 1)
    }
  },
  beforeCreate: function () {

  },
  created: async function () { // call api to get data and set state
    // get products
    await this.$store.dispatch('getProducts')
    // set ready
    this.ready = true
  },
  beforeMount: function() { // set states ui
    // init page
    this.initPage({
      section: 'app',
      name: this.$t('app.products.title')
    })
    // set sidebar ui
    sidebarModule.init(this.getObject(require('../sidebar.json')), {
      sidebarAtIdx: 0,
      submenuAtIdx: 0
    })
  },
  mounted: function () { // run script

  },
  updated: function () { // re-rendered html
    this.updateUIDataTable()
  },
  destroyed: function() { // leave this page
    this.leavePage(this.$Progress, ['clearProducts'])
  }
}
</script>

<style scoped>
	#datatable tbody tr td, #datatable tbody tr td a {
		/* font-size: 15px; */
	}
	#datatable tbody tr td, #datatable tbody tr td a.badge {
		/* font-size: 85%; */
	}
	#datatable tbody tr td > div {
		/* margin-bottom: 15px; */
	}
	#datatable tbody tr td > div:last-of-type {
		margin-bottom: 0;
	}
  #datatable a.badge {
    color: #FFF !important;
  }
</style>
