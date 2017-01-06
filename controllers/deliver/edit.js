'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

const edit = function*(){
	let data = this.request.body
	
  if(!data.id) {
  	throw new APIError('Incompelete Information', '请传入员工ID')
  	return
  }
  let result
	try {
		let query = new AV.Query('Deliver')
		result = yield query.get(data.id)
	} catch(e) {
    throw new APIError('DB Error', e.message)
    return
	}

	if(!result) {
		throw new APIError('Invalid','当前员工不存在')
		return
	}
	try {
		data.phoneNumber && result.set('phoneNumber', data.phoneNumber)
		data.passWord && result.set('passWord', data.passWord)
		data.name && result.set('name', data.name)
		yield result.save()	
	} catch(e) {
		throw new APIError('DB Error', e.message)
		return
	}

  this.body = {
  	success: true,
  	message: '保存成功'
  }
}

module.exports = edit
