'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

const removeAddress = function*(){
	let data = this.request.body

	if(!data.id) {
		throw new APIError('Incompelete Information', '传入地址id')
		return
	}

  // 验证用户是否登录
  if (!this.session.userId) {
  	throw new APIError('Unlogged', '用户未登录')
  	return
  }

	let query = new AV.Query('_User')
	let result
	try{
		result = yield query.get(this.session.userId)
	} catch(e) {
		throw new APIError('DB Error', e.message)
		return
	}

	let addressList = result.get('addressList')
	if(!addressList || addressList.length == 0){
		throw new APIError('Invalid','当前无地址信息')
		return
	}

	addressList.forEach((addr, index) => {
		if(addr.id === data.id){
			addressList.splice(index,1)
		}
	})

	try {
		result.set('addressList', addressList)
		yield result.save()
	} catch(e) {
		throw new APIError('DB Error', e.message)
		return
	}

	this.body = {
		success: true,
		message: '操作成功 已删除地址'
	}
}

module.exports = removeAddress
