import request from '@/utils/request'



const mail = {

	mailMessage: function (data) {
		return request({
			url: '/api/mail/all',
			method: 'get',
			data
		})

		
	},

	addMailMessage: function (data) {
		return request({
			url: '/api/mail',
			method: 'post',
			data
		})
	},
	alterMailMessage: function (data) {
		return request({
			url: '/api/mail',
			method: 'put',
			data
		})
	},

	delMailMessage: function (params) {
		return request({
			url: '/api/mail',
			method: 'delete',
			params
		})
	}

}

export default mail
