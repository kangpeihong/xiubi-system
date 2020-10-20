import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/xwEmployees',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/xwEmployees/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/xwEmployees',
    method: 'put',
    data
  })
}

export function removeImage(filePath) {
  return request({
    url: 'api/xwEmployees/removeImage',
    method: 'post',
    data: { filePath: filePath }
  })
}
