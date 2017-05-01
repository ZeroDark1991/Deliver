'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

const fill = function*() {
  const data = this.request.body.data
  if(!data) {
  	throw new APIError('Incompelete Information', '请传入合法的数据')
  	return
  }

	// 批量写入气罐
	let objects = []
	try {
		for(let i=0; i<data.length; i++) {
  		let item = data[i]
			let query = new AV.Query('Tank')
	  	query.equalTo('signId', item.signId)
	  	let tank = yield query.first()
	  	if(tank) {
	  		tank.add('fill', {
	  			fillDate: item.fillDate,
	  			gunId: item.gunId,
	  			bodyCode: item.bodyCode
	  		})
	  		objects.push(tank)
	  	}
		}
	} catch(e) {
  	throw new APIError('Error Occurs', e.message)
  	return		
	}

  let result
  try {
  	result = yield AV.Object.saveAll(objects)
  } catch(e) {
  	throw new APIError('Error Occurs', e.message)
  	return
  }

  this.body = {
  	success: true,
  	message: '气罐信息录入成功'
  }
}

module.exports = fill
