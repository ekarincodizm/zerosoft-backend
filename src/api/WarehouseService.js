import Api from '@/api/Api'

export default {

	getAll (data) {
		return Api().get('warehouses')
	},

	insert (data) {
		return Api().post('warehouse', data, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
	},

	update (data) {
		return Api().put('warehouse', data, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
	},

	delete (data) {
		return Api().delete('warehouse', {data: data}, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
	}

}
