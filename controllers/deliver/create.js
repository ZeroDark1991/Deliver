'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')
const Deliver = AV.Object.extend('Deliver')

const create = function*() {
	let data = this.request.body
	if(!data.phoneNumber || !data.name){
		throw new APIError('Incompelete Information','请完整填写信息')
		return
	}
	
	const deliverModel = new Deliver()
	deliverModel.set('phoneNumber', data.phoneNumber)
	deliverModel.set('name', data.name)
	deliverModel.set('passWord', data.passWord || '#123456')

	try {
		let query = new AV.Query('Deliver')
		query.equalTo('phoneNumber', data.phoneNumber)
    let checkDup = yield query.first()
    if(!checkDup){
    	yield deliverModel.save()
    }else {
    	throw new APIError('duplicated deliver', '手机号已存在')
    	return
    }
	} catch(e) {
    throw new APIError('DB error', e.message)
    return
	}

  this.body = {
  	success: true,
  	message: '新员工添加成功'
  }	
}

module.exports = create