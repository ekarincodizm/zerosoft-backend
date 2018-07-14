import Api from '@/api/Api'

export default {

  getAll () {
		return Api().get('goodsissues')
	},

	getSingle (data) {
		return Api().get('goodsissue?gi_id='+data.gi_id)
	},

	insert (data) {
		return Api().post('goodsissue', data, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
	},

	update (data) {
		return Api().put('goodsissue', data, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
	},

	done (data) {
		return Api().put('goodsissue/done', data, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
	},

	delete (data) {
		return Api().delete('goodsissue', {data: data}, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
	},

	getLatestCode (data) {
		let param = '?warehouse_id='+data.warehouse_id+
								'&short_name='+data.short_name
		return Api().get('goodsissue/latest_code'+param)
	}

}
