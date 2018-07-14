import Api from '@/api/Api'

export default {

	getAll () {
		return Api().get('categories')
	},

	getSingle (data) {
		let param = 'category_id='+data.category_id
		return Api().get('category?'+param)
	},

	insert (data) {
		return Api().post('category', data, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
	},

	update (data) {
		return Api().put('category', data, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
	},

	delete (data) {
		return Api().delete('category', {data: data}, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
	}

}
