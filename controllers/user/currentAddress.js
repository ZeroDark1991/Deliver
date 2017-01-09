'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

const currentAddress = function*(){
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

	let targetAddr = addressList.find(addr => addr.id === data.id)
	if(!targetAddr){
		throw new APIError('Invalid','目标地址不存在')
		return
	}
	if(targetAddr.current){
		throw new APIError('Invalid', '当前地址已经是默认地址')
		return
	}

	let resolveAddr = addressList.map(addr => {
		if(addr.id === data.id){
			addr.current = true
		} else {
			addr.current = false
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
		message: '设置成功'
	}
}

module.exports = currentAddress
