import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/xwOrder',
    method: 'post',
    data
  })
}

export function del(orderId) {
  return request({
    url: 'api/xwOrder/' + orderId,
    method: 'delete'
  })
}

export function selDetail(orderId) {
  return request({
    url: 'api/xwOrder/' + orderId,
    method: 'get'
  })
}

export function edit(data) {
  return request({
    url: 'api/xwOrder',
    method: 'put',
    data
  })
}

export function downloadXwOrder(params) {
  return request({
    url: 'api/xwOrder/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
