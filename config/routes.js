'use strict'
/**
 * 路由配置表
 */
const Router = require('koa-router')
const router = new Router({ prefix: '/api' })

const APIError = require('./apiError')
const App = require('../controllers/app/')
const User = require('../controllers/user/')
const Tank = require('../controllers/tank/')
const Order = require('../controllers/order/')
const Deliver = require('../controllers/deliver/')

// global
router.get('/app/areaCodes', App.areaCodes)
router.get('/app/timeSlots', App.timeSlots)

// order
router.get('/order/info', Order.info)
router.get('/order/userList', Order.userList)
router.get('/order/deliverList', Order.deliverList)

router.post('/order/audit', Order.audit)
router.post('/order/create', Order.create)
router.post('/order/cancel', Order.cancel)
router.post('/order/finish', Order.finish)
router.post('/order/confirm', Order.confirm)
router.post('/order/receiveTank', Order.receiveTank)

// deliver
router.get('/d/info', Deliver.info)
router.post('/d/logIn', Deliver.logIn)
router.post('/d/create', Deliver.create)
router.post('/d/signOut', Deliver.signOut)

// user
router.get('/u/info', User.info)
router.get('/u/currentTank', User.currentTank)

router.post('/u/logIn', User.logIn)
router.post('/u/setAddress', User.setAddress)
router.post('/u/verifyCode', User.verifyCode)

// tank
router.post('/t/create', Tank.create)

// 404 not found
router.all('*', function*() {
	throw new APIError('not found', '未找到匹配的接口')
	return
})

module.exports = router
