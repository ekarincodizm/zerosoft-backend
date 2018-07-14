import Api from '@/api/Api'

export default {

	getAll () {
		return Api().get('modifiers')
	},

	getSingle (data) {
		let param = 'modifier_id='+data.modifier_id
		return Api().get('modifier?'+param)
	},

	insert (data) {
		return Api().post('modifier', data, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
	},

	update (data) {
		return Api().put('modifier', data, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
	},

	delete (data) {
		return Api().delete('modifier', {data: data}, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
	}

}
