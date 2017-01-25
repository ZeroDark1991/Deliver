'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

const create = function*() {
	const data = this.request.body
	if(!data.records) {
		throw new APIError('Incompelete Information', '未传入records')
		return
	}

	try {
		const Record = AV.Object.extend('Record')
		let objects = data.records.map(item => {
			let record = new Record()
			record.set('tank', item.tank)
			record.set('equip', item.equip)
			record.set('filler', item.filler)
			record.set('filledAt', item.date)
			record.set('checker', item.checker)
			return record
		})

		yield AV.Object.saveAll(objects)
	} catch(e) {
		throw new APIError('DB Error', e.message)
		return
	}

	this.body = {
		success: true,
		message: '记录录入成功'
	}
}

module.exports = create
