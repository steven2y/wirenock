var express = require('express');
var router = express.Router();
var request = require('request');
var host = '';
var r = request.defaults({proxy: false});
var recorder = require('./recorder').recorder;
var bodyRawParser = require('./recorder').bodyRawParser;
var args = require('../support/args');


if(args.record) {
    router.all('*', bodyRawParser);
}



//proxy
router.all('*', function (req, res) {

    'use strict';
    var stream;
    //modify the url in any way you want
    console.log('proxy', host + req.originalUrl);


    stream = req.pipe(r(host + req.originalUrl));
    if(args.record) {
        stream.on('response', recorder);
    }
    stream.pipe(res);
});

module.exports = function (options) {
    host = options.host;
    return router;
};
