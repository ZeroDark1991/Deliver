'use strict'
const AV = require('leanengine')

exports.login = function*() {
  console.log(this.query)
  try{
  	yield AV.User.requestLoginSmsCode('13588277370')
  }
}