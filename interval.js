var AV = require('leanengine')

const interval = function() {
  setInterval(() => {
    var query = new AV.Query('Order')
    query.lessThanOrEqualTo('status', 0)
    query.lessThan('createdAt', new Date(Date.now() - 2*3600*1000))
    console.log('Checking Expired Orders')
    // 清理2小时未接的订单
    query.destroyAll()
    .then(function(){
      console.log('Expired Orders Deleted')
    })
    .catch(function(error){
      console.log('Error Occurs While Deleting Expired Orders')
    })    
  }, 5*60*1000)
}

module.exports = interval