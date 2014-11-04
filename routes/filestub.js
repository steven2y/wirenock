var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

var dir = '',
    mappingsFile = [],
    mappings = [];



router.all('*', function(req, res, next) {

    var match = _.filter(mappings, function (map) {
        return _.where([map.request], { url: req.originalUrl, method: req.method }).length > 0;
    });

    if (match.length > 0) {
        console.log('matched', req.originalUrl );
        var response = match[0].response;
        res.status(response.status)
            .set(response.headers)
            .sendFile(path.resolve(path.join(dir, '__files', response.bodyFileName)));
    } else {
        next();
    }
});

module.exports = function(options){
    dir = options.dir;
    mappingsFile = fs.readdirSync(path.join(dir, 'mappings'));
    mappingsFile.forEach(function(map){
        mappings.push(require(path.resolve(path.join(dir, 'mappings', map))));
    });
    return router;
};