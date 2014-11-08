var express = require('express');
var router = express.Router();

var allMatches = require('./filestub/allMatches');
var loadMappings = require('./filestub/loadMappings');


module.exports = function (options) {
    dir = options.dir;
    router.all('*', allMatches(loadMappings(dir)));
    return router;
};