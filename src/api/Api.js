import axios from 'axios'
import store from '../store'

export default () => {

	const instance = axios.create({
		baseURL: 'http://localhost:3000/v1/'
		//baseURL: 'https://api.smartsme.io:3000/v1/'
	})

	instance.defaults.headers.common['Authorization'] = store.state.auth.auth.access_token
	instance.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'

	return instance
}
