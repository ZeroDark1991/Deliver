'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

const audit = function*() {
  let data = this.request.body
  // 校验
  if(!data.id) {
  	throw new APIError('Incompelete Information', '请完整传入参数')
  	return
  }
  
  let query = new AV.Query('Order')
  try {
    let check = yield query.get(data.id)
    if( !check || check.get('status') != 2 ) {
    	throw new APIError('', '此订单状态不支持当前操作')
    	return
    }
  } catch(e) {
  	throw new APIError('DB Error', e.message)
  	return
  }

  // 更新
  let audit = AV.Object.createWithoutData('Order', data.id)
  audit.set('audit', 1)
  try {
  	yield audit.save()
  } catch(e) {
  	throw new APIError('DB Error', e.message)
  	return
  }

  this.body = {
  	success: true,
  	message: '操作成功，订单提交人工审核'
  }	
}

module.exports = audit
