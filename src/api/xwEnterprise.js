import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/xwEnterprise',
    method: 'post',
    data
  })
}

export function del(enterpriseId) {
  return request({
    url: 'api/xwEnterprise/' + enterpriseId,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/xwEnterprise',
    method: 'put',
    data
  })
}

export function downloadXwEnterprise(params) {
  return request({
    url: 'api/xwEnterprise/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
