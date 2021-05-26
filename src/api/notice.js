import request from '@/utils/request'



const notice = {

	publicMessage: function (data) {
		return request({
			url: '/api/notice/all',
			method: 'post',
			data
		})

		
	},

	addPublicMessage: function (data) {
		return request({
			url: '/api/notice',
			method: 'post',
			data
		})
	},
	alterPublicMessage: function (data) {
		return request({
			url: '/api/notice',
			method: 'put',
			data
		})
	},

	delPublicMessage: function (params) {
		return request({
			url: '/api/notice',
			method: 'delete',
			params
		})
	}

}

export default notice
// export function notice(params) {
//   return request({
//     url: '/api/notice',
//     method: 'get',
//     params,
//   })
// }