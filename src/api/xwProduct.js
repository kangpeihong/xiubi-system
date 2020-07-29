import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/xwProduct',
    method: 'post',
    data
  })
}

export function del(productId) {
  return request({
    url: 'api/xwProduct/' + productId,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/xwProduct',
    method: 'put',
    data
  })
}

export function removeImage(filePath) {
  return request({
    url: 'api/xwProduct/removeImage',
    method: 'post',
    data: { filePath: filePath }
  })
}

export function downloadXwProduct(params) {
  return request({
    url: 'api/xwProduct/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
