'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

const editAddress = function*(){
	let data = this.request.body

	if(!data.id) {
		throw new APIError('Incompelete Information', '传入地址id')
		return
	}

  // 验证用户是否登录
  let currentUser = AV.User.current()
  if (!currentUser) {
  	throw new APIError('Unlogged', '用户未登录')
  	return
  }

	let query = new AV.Query('_User')
	let result
	try{
		result = yield query.get(currentUser.id)
	} catch(e) {
		throw new APIError('DB Error', e.message)
		return
	}

	let addressList = result.get('addressList')
	if(!addressList || addressList.length == 0){
		throw new APIError('Invalid','当前无地址信息')
		return
	}

	let targetAddr = addressList.find(addr => addr.id === data.id)
	if(!targetAddr){
		throw new APIError('Invalid','目标地址不存在')
		return
	}

	let resolveAddr = addressList.map(addr => {
		if(addr.id === data.id){
			data.areaCode && (addr.areaCode = data.areaCode)
			data.address && (addr.address = data.address)
			data.userName && (addr.userName = data.userName)
		}
		return addr
	})

	try {
		result.set('addressList', resolveAddr)
		yield result.save()
	} catch(e) {
		throw new APIError('DB Error', e.message)
		return
	}

	this.body = {
		success: true,
		message: '修改成功',
		addressList: resolveAddr
	}
}

module.exports = editAddress
