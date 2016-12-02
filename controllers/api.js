'use strict'
var router = require('express').Router();
var AV = require('leanengine');

router.get('/', function(req, res, next) {
  res.send('hello api')
})

module.exports = router