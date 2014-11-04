var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

var dir = '',
    mappingsFile = [],
    mappings = [];


function handleResponse(res, responseMatch) {
    res.status(responseMatch.status)
        .set(responseMatch.headers)
        .sendFile(path.resolve(path.join(dir, '__files', responseMatch.bodyFileName)));
}


router.all('*', function (req, res, next) {

    //get the first match
    var match = _.find(mappings, function (map) {
        return _.where([map.request], { url: req.originalUrl, method: req.method }).length > 0;
    });

    if (match === undefined) {
        //if no match and there is a urlPattern then use that as regex against the incoming request
        match = _.find(mappings, function (map) {
            var mapRequest = map.request;
            var result = false;

            if (mapRequest.urlPattern) {
                var reg = new RegExp(mapRequest.urlPattern);

                if(req.method === mapRequest.method && reg.test(req.originalUrl)){
                    result = true;
                }
            }
            return result;
        });

    }

    if (match !== undefined) {
        console.log('matched', req.originalUrl, '-- against', match.request);
        handleResponse(res, match.response);
    } else {
        next();
    }
});

module.exports = function (options) {
    dir = options.dir;
    mappingsFile = fs.readdirSync(path.join(dir, 'mappings'));
    mappingsFile.forEach(function (map) {
        mappings.push(require(path.resolve(path.join(dir, 'mappings', map))));
    });
    return router;
};