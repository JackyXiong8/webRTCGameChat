const mongoose = require('mongoose')



module.exports = {
    
    index : function(request, response){
        response.render('index')
    }
}