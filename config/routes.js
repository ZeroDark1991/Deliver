'use strict'
const Router = require('koa-router')
const router = new Router({ prefix: '/api' })
const APIError = require('./apiError')
const App = require('../controllers/app/')
const User = require('../controllers/user/')
const Deliver = require('../controllers/deliver/')

router.get('/app/orderOption', App.orderOption)

// deliver
router.post('/d/create', Deliver.create)
router.post('/d/logIn', Deliver.logIn)
router.post('/d/signOut', Deliver.signOut)

// user
router.post('/u/logIn', User.logIn)
router.get('/u/verifyCode', User.verifyCode)

// 404 not found
router.all('*', function*() {
	throw new APIError('not found', '未找到匹配的接口')
})
module.exports = router