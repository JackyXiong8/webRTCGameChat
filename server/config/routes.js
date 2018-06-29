const mongoose = require('mongoose')


var basic = require('../controllers/basic.js')

module.exports = function(app){

    app.get('/showEjs', basic.index)

    }