'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

const info = function*() {

	let params = this.query

  let user = new AV.Query('_User')
  user.include('tank')
  user.select(['username', 'mobilePhoneNumber', 'areaCode', 'nickname', 'tank', 'createdAt'])
  if(params.phoneNumber){
  	user.equalTo('mobilePhoneNumber', params.phoneNumber)
  }

  let result
  try {
    result = yield user.find()
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

module.exports = info
