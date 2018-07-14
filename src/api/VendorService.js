import Api from '@/api/Api'

export default {

	getAll () {
    return Api().get('vendors')
	},

	getSingle (data) {
    return Api().get('vendor?vendor_id='+data.vendor_id)
	},

	update (data) {
		return Api().put('vendor', data, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
	},

	delete (data) {
		return Api().delete('vendor', {data: data}, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
	}

}
