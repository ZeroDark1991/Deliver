'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

const create = function*() {
	let data = this.request.body
	if(!data.fillers) {
		throw new APIError('Incompelete Information', '未传入fillers')
		return
	}
	const Filler = AV.Object.extend('Filler')
	try {
		let objects = data.fillers.map(item => {
			let filler = new Filler()
			filler.set('name', item.name)
			filler.set('phoneNumber', item.phoneNumber)
			filler.set('identity', item.identity)
			return filler
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
