'use strict'
const create = require('./create')
const logIn = require('./logIn')
const signOut = require('./signOut')
const info = require('./info')
const list = require('./list')
const remove = require('./remove')
const edit = require('./edit')

module.exports = {
	create,
	logIn,
	signOut,
	info,
	list,
	edit,
	remove
}