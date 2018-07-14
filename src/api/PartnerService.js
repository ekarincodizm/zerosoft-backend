import Api from '@/api/Api'

export default {

	getAll () {
    return Api().get('partners')
	}

}
