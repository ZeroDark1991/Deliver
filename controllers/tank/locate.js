'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')
const ScanRecord = AV.Object.extend('ScanRecord')

const locate = function*() {

	let data = this.request.body
	if(!data.longitude || !data.latitude){
		throw new APIError('Incompelete Information', '传入经纬度')
		return
	}

	if(!data.deliver) {
		throw new APIError('Incompelete Information', '传入员工id')
		return
	}

	if(!data.id) {
		throw new APIError('Incompelete Information', '传入气瓶id')
		return
	}

	let userIdCard = data.userIdCard ? JSON.parse(data.userIdCard) : null

	let query = new AV.Query('Tank')
	let tarTank
  try {
  	if(data.id) {
			query.equalTo('signId', data.id)
			tarTank = yield query.first()
			if(tarTank) {
				tarTank.set('longitude', data.longitude)
				tarTank.set('latitude', data.latitude)
				if(userIdCard) {
					tarTank.set('idnumber', userIdCard.idnumber)
					tarTank.set('realname', userIdCard.realname)
				}
				let queryD = new AV.Query("Deliver")
				let tarDeliver = yield queryD.get(data.deliver)
				tarTank.set('deliverName', tarDeliver.get('name'))
				tarTank.set('deliverPhone', tarDeliver.get('phoneNumber'))
				tarTank.set('deliveredAt', new Date())
				yield tarTank.save()
			}
			else {
				throw new APIError('Tank not Found', '未找到气瓶')
				return
			}
  	}

		let scanRecord = new ScanRecord()
		let deliver = AV.Object.createWithoutData('Deliver', data.deliver)
		scanRecord.set('deliver', deliver)
		if(tarTank) scanRecord.set('tank', tarTank)
		scanRecord.set('longitude', data.longitude)
		scanRecord.set('latitude', data.latitude)
		// 身份证号
		if(userIdCard) {
			console.log(userIdCard.idnumber)
			scanRecord.set('idnumber', userIdCard.idnumber)
			scanRecord.set('realname', userIdCard.realname)
		}
		// 气瓶备注
		if(data.description) scanRecord.set('description', data.description)
		// 报障
		if(data.report) scanRecord.set('report', data.report)

		yield scanRecord.save()

  } catch(e) {
    throw new APIError('DB Error', e.message)
    return
  }

  this.body = {
  	success: true,
  	message: '成功'
  }
}

module.exports = locate
