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
  if(!data.address || !data.areaCode) {
    throw new APIError('Incompelete Information', '完整填写address和areaCode')
    return
  }

  let user = AV.Object.createWithoutData('_User', currentUser.id)
  try {
    user = yield user.fetch()
  } catch(e) {
    console.log(e.message)
  }

  if(user.get('addressList') && user.get('addressList').length > 0){
    // 地址存在记录
    user.add('addressList', {
      id: (Date.now()).toString(),
      areaCode: data.areaCode,
      address: data.address,
      current: false
    })
  } else {
    // 地址无记录
    user.add('addressList', {
      id: (Date.now()).toString(),
      areaCode: data.areaCode,
      address: data.address,
      current: true
    })
  }
  try{
  	yield user.save()
  } catch(e) {
  	throw new APIError('DB Error', e.message)
  	return
  }

  this.body = {
  	success: true,
  	message: '地址信息保存成功',
    addressList: user.get('addressList')
  }
}

module.exports = setAddress
