import Api from '@/api/Api'

export default {

	getStock (data) {
		return Api().get('stock?warehouse_id='+data.warehouse_id)
	},

	updateStock (data) {
		return Api().put('stock', data, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
	},

	updateStockWarning (data) {
		return Api().put('stock/warning', data, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
	},

	getActivities () {
		return Api().get('stock/activities')
	},

	getTodo () {
		return Api().get('stock/todo')
	},

	getCurrentstocks () {
		return Api().get('stock/current')
	}

}
