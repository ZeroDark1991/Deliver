'use strict'
const AV = require('leanengine');
const Test = AV.Object.extend('Test')
const test = new Test()

exports.test = function*() {
	test.set('name','Arron Rogers')
	test.set('age', '30')
	try {
		yield test.save()
	} catch (e) {
    console.log(e)
    return
	}
	console.log(test.get('age'))
	this.body = {
		success: true,
		result: {
			age: test.get('age'),
			name: test.get('name')
		}
	}
}