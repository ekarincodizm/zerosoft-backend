import Api from '@/api/Api'

export default {

	getAll () {
		return Api().get('shops')
	},

	getSelf () {
		return Api().get('shop/self')
	},

	installApp (data) {
		return Api().put('shop/install_app', data, {
			headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
		})
	},

	uninstallApp (data) {
		return Api().put('shop/uninstall_app', data, {
			headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
		})
	},

	update (data) {
		return Api().put('shop', data, {
			headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
		})
	},

	updateSettings (data) {
		return Api().put('shop/settings', data, {
			headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
		})
	}

}
