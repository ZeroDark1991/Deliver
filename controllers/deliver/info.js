'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

const info = function*() {
  let params = this.query
  if( !params.id ) {
  	throw new APIError('Incomplete Information', '请传入正确的参数')
  	return
  }

  let query = new AV.Query('Deliver')
  let result
  try {
  	result = yield query.get(params.id)
  } catch(e) {
  	throw new APIError('DB Error', e.message)
  	return
  }

  this.body = {
  	success: true,
  	info: {
  		id: result.id,
  		phoneNumber: result.get('phoneNumber'),
  		name: result.get('name')
  	}
  }
}

module.exports = info
