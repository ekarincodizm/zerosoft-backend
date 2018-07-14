import Api from '@/api/Api'
import qs from 'qs'

export default {

	getSingle (data) {
		return Api().get('product?product_id='+data.product_id)
	},

	getAll () {
		return Api().get('products')
	},

	insert (data) {
		return Api().post('product', data, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
	},

	assignInventory (data) {
		return Api().put('product/assign_inventory', data, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
	}

}
