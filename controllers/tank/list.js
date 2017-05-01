'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

const list = function*() {

	let params = this.query
  let query = new AV.Query('Tank')
  if(params.signId) {
    query.startsWith('signId', params.signId)
  }

  if(params.map) {
    query.startsWith('longitude', '1')
  }
  query.limit(1000)

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
