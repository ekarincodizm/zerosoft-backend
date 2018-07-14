import Api from '@/api/Api'
import qs from 'qs'

export default {

	register (data) {
		let json = {
			email: data.email,
			password: data.password,
			first_name: data.first_name,
			last_name: data.last_name,
			shop_name: data.shop_name,
			business_id: data.business_id
		}
		return Api().post('user/register', json)
	},

	login (data) {
		let json = {
			email: data.email,
			password: data.password
		}
		return Api().post('user/login', qs.stringify(json))
	},

	loginShop (data) {
		let json = {
			shop_id: data.shop_id
		}
		return Api().post('user/login/shop', qs.stringify(json))
	},

	getMe() {
		return Api().get('user/me')
	},

	checkCandidate (data) {
		return Api().post('check/candidate', data, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
	}

  /*
  login(data) {
		return Api().post('login-local', qs.stringify(data), {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    });
	},
  */
}
