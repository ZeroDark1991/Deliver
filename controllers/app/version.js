'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

exports.fetch = function*(){
	let result
	try {	
		let query = new AV.Query('Version')
		result = yield query.first()
	}
	catch(e) {
		throw new APIError('DB Error', e.message)
		return
	}

	this.body = {
		success: true,
		message: "获取信息成功",
		versions: result
	}
}

exports.update = function*(){
	let data = this.request.body
	  // 校验
  if(!data.url || !data.tag) {
  	throw new APIError('Incompelete Information', '请传入url和tag')
  	return
  }

	try {
		const Version = AV.Object.extend('Version')
		let version = new Version()
		version.set('url', data.url)
		version.set('tag', data.tag)
		yield version.save()
	}
	catch(e) {
		throw new APIError('DB Error', e.message)
		return
	}
	this.body = {
		success: true,
		message: '版本信息录入成功'
	}
}
