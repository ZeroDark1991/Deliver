'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

const list = function*() {

	let params = this.query
	if(!params.id){
		throw new APIError('Incompelete Information', '传入气罐ID')
		return
	}
  let result
  let owner = null
  try {
  	let query = new AV.Query('Tank')
  	result = yield query.get(params.id)

  	let ownerQuery = new AV.Query('_User')
  	ownerQuery.equalTo('tank', result)
  	ownerQuery.select(['username', 'mobilePhoneNumber', 'areaCode', 'nickname','createdAt'])
  	owner = yield ownerQuery.first()	
  } catch(e) {
    throw new APIError('DB Error', e.message)
    return
  }

  this.body = {
  	success: true,
  	message: '成功',
  	info: result,
  	owner: owner
  }
}

module.exports = list
