'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

const locate = function*() {

	let data = this.request.body
	if(!data.longitude || !data.latitude){
		throw new APIError('Incompelete Information', '传入经纬度')
		return
	}

	if(!data.id){
		throw new APIError('Incompelete Information', '传入气罐ID')
		return
	}

	let query = new AV.Query('Tank')

  try {
		let tarTank = yield query.first()
		tarTank.set('longitude', data.longitude)
		tarTank.set('latitude', data.latitude)
		yield tarTank.save()
  } catch(e) {
    throw new APIError('DB Error', e.message)
    return
  }

  this.body = {
  	success: true,
  	message: '成功'
  }
}

module.exports = locate
