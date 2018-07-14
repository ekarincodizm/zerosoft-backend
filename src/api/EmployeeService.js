import Api from '@/api/Api'

export default {

  getAll () {
    return Api().get('employees')
	},

	getSingle (data) {
    return Api().get('employee?emp_id='+data.emp_id)
	},

	insert (data) {
		return Api().post('employee', data, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
	},

  update (data) {
		return Api().put('employee', data, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
	},

	delete (data) {
		return Api().delete('employee', {data: data}, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
	}

}
