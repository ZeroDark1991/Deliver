'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')
const Tank = AV.Object.extend('Tank')

const importTank = function*() {
  const data = this.request.body.data
  if(!data) {
  	throw new APIError('Incompelete Information', '请传入合法的数据')
  	return
  }

	// 批量写入气罐
  let objects = data.map(item => {
    let tank = new Tank()
    Object.keys(item).forEach(key => {
      tank.set(key, item[key])
    })
    return tank
  })

  let result
  try {
  	result = yield AV.Object.saveAll(objects)
  } catch(e) {
  	throw new APIError('Error Occurs', e.message)
  	return
  }

  console.log(result)

  this.body = {
  	success: true,
  	message: '气罐信息录入成功'
  }
}

module.exports = importTank
