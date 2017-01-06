'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

const remove = function*() {
	let data = this.request.body
	
  if(!data.id) {
  	throw new APIError('Incompelete Information', '请传入员工ID')
  	return
  }

	try {
		let deliver = AV.Object.createWithoutData('Deliver', data.id)
		yield deliver.destroy()
	} catch(e) {
    throw new APIError('DB Error', e.message)
    return
	}

  this.body = {
  	success: true,
  	message: '删除成功'
  }
}

module.exports = remove
