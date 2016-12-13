'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

const setAddress = function*() {
  // 验证用户是否登录
  let currentUser = AV.User.current()
  if (!currentUser) {
  	throw new APIError('Unlogged', '用户未登录')
  	return
  }

  let data = this.request.body

  let user = AV.Object.createWithoutData('_User', currentUser.id)
  if(data.address) {
    user.set('address', data.address)
  }
  if(data.areaCode) {
    user.set('areaCode', data.areaCode)
  }

  try {
  	yield user.save()
  } catch(e) {
  	throw new APIError('DB Error', e.message)
  	return
  }

  this.body = {
  	success: true,
  	message: '地址信息保存成功'
  }

}

module.exports = setAddress
