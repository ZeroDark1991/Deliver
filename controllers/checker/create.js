'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

const create = function*() {
	let data = this.request.body
	if(!data.checkers) {
		throw new APIError('Incompelete Information', '未传入checkers')
		return
	}
	const Checker = AV.Object.extend('Checker')
	try {
		let objects = data.checkers.map(item => {
			let checker = new Checker()
			checker.set('name', item.name)
			checker.set('phoneNumber', item.phoneNumber)
			checker.set('identity', item.identity)
			return checker
		})
		yield AV.Object.saveAll(objects)
	} catch(e) {
		throw new APIError('DB Error', e.message)
		return
	}

	this.body = {
		success: true,
		message: '成功创建'
	}
}

module.exports = create
