import Api from '@/api/Api'

export default {

	getAll () {
		return Api().get('goodsreceipts')
	},

	getSingle (data) {
		return Api().get('goodsreceipt?gr_id='+data.gr_id)
	},

	insert (data) {
		return Api().post('goodsreceipt', data, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
	},

	update (data) {
		return Api().put('goodsreceipt', data, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
	},

	done (data) {
		return Api().put('goodsreceipt/done', data, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
	},

	delete (data) {
		return Api().delete('goodsreceipt', {data: data}, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
	},

	getLatestCode (data) {
		let param = '?warehouse_id='+data.warehouse_id+
								'&short_name='+data.short_name
		return Api().get('goodsreceipt/latest_code'+param)
	}

}
