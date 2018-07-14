import Api from '@/api/Api'

export default {

  getAll () {
    return Api().get('customers')
	},

	getSingle (data) {
    return Api().get('customer?customer_id='+data.customer_id)
	},

	insert (data) {
		return Api().post('customer', data, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
	},

  update (data) {
		return Api().put('customer', data, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
	},

	delete (data) {
		return Api().delete('customer', {data: data}, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
	}

}
