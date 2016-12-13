var AV = require('leanengine')

/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('hello', function(request, response) {
  response.success('Hello world!')
})

AV.Cloud.define('orderExpired', function(request, response) {
	var query = new AV.Query('Order')
	query.lessThanOrEqualTo('status', 0)
  query.lessThan('createdAt', new Date(Date.now() - 2*3600*1000))
  // 清理2小时未接的订单
  query.destroyAll()
  .then(function(){
	  responese.success('Expired Orders Have Been Deleted')
  })
  .catch(function(error){
  	responese.error('清理失败')
  })
})

module.exports = AV.Cloud