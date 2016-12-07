'use strict'
const APIError = require('../../config/apiError')

module.exports = function*() {
	if(this.session.deliverId){
		this.session.deliverId = ''
		this.body = {
			success: true,
			message: '成功退出登录'
		}
	}else {
		throw new APIError('session lost', '当前是未登录状态')
		return
	}
}