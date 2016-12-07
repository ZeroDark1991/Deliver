'use strict'

/**
 * 路由配置表
 */

const Router = require('koa-router')
const router = new Router({ prefix: '/api' })

const APIError = require('./apiError')
const App = require('../controllers/app/')
const User = require('../controllers/user/')
const Deliver = require('../controllers/deliver/')
const Order = require('../controllers/order/')

// global
router.get('/app/orderOption', App.orderOption)

// order
router.get('/order/deliverList', Order.deliverList)
router.post('/order/create', Order.create)
router.post('/order/cancel', Order.cancel)
router.post('/order/confirm', Order.confirm)
router.post('/order/recieveTank', Order.recieveTank)

// deliver
router.post('/d/logIn', Deliver.logIn)
router.post('/d/create', Deliver.create)
router.post('/d/signOut', Deliver.signOut)

// user
router.post('/u/logIn', User.logIn)
router.post('/u/verifyCode', User.verifyCode)

// 404 not found
router.all('*', function*() {
	throw new APIError('not found', '未找到匹配的接口')
})

module.exports = router
