var express = require('express');
var router = express.Router();
var request = require('request');

var host = '';
var r = request.defaults({proxy: false});


//proxy
router.all('*', function (req, res) {
    'use strict';
    //modify the url in any way you want
    console.log('proxy', host + req.originalUrl);
    req.pipe(r(host + req.originalUrl)).pipe(res);
});

module.exports = function(options){
    host = options.host;
    return router;
};
