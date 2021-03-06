'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

const list = function *(){
	let query = new AV.Query('Deliver')
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
