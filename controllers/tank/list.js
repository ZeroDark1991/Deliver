'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

const list = function*() {

	let params = this.query
  let query = new AV.Query('Tank')
  // check.equalTo('signId', data.signId)
  let result 
  try {
  	result = yield query.find()
  } catch(e) {
    throw new APIError('DB Error', e.message)
    return
  }

  this.body = {
  	success: true,
  	message: '成功',
  	list: result
  }
}

module.exports = list
