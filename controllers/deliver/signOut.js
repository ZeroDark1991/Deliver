'use strict'

module.exports = function*() {
	if(this.session.deliverId){
		this.session.deliverId = ''
		this.body = {
			success: true,
			message: '成功退出登录'
		}
	}else {
		this.body = {
			success: false,
			message: '当前已是未登录状态'
		}
	}
}