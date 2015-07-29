var fs = require('fs'),
    path = require('path'),
    _ = require('underscore');


function recorder(response) {
    var body = '',
        mappingFileName = '',
        bodyFileName = '',
        dirTemp = path.join(__dirname, 'temp'),
        data;


    if (!fs.existsSync(dirTemp)) {
        fs.mkdirSync(dirTemp)
    }

    response.on('data', function (chunk) {
        body += chunk;
    });

    response.on('end', function () {
        var templateMap = {
                request: {},
                response: {
                    status: 200
                }
            },
            time = Date.now();

        mappingFileName = 'mapping-' + response.request.uri.pathname.replace(/\//g, '-') + '-' + time + '.json';
        bodyFileName = 'body-' + response.request.uri.pathname.replace(/\//g, '-') + '-' + time + '.json';

        templateMap.request.url = response.request.uri.path;
        templateMap.request.method = response.request.method;

        templateMap.response.bodyFileName = bodyFileName;
        templateMap.response.headers = response.headers;
        templateMap.response.status = response.statusCode;


        if (response.request.headers.authorization) {
            templateMap.request.headers = {
                authorization: {
                    equalTo: response.request.headers.authorization
                }
            };
        }

        if (response.request.src.rawBody.toString() !== '') {
            templateMap.request.bodyPatterns = {
                matches: response.request.src.rawBody.toString()
            }
        }

        data = {
            url: response.request.uri.path,
            headers: JSON.stringify(response.headers),
            bodyFileName: bodyFileName,
            method: response.request.method
        }


        fs.writeFileSync(path.join(dirTemp, mappingFileName), JSON.stringify(templateMap));
        fs.writeFileSync(path.join(dirTemp, bodyFileName), body);

        console.log('recorded ', mappingFileName);
        console.log('recorded ', bodyFileName);
    });

};

function bodyRawParser(req, res, next) {
    req.rawBody = '';
    function readableHandler() {
        req.pause()
        var chunk = req.read();
        var temp;

        while (null !== (temp = req.read())) {
            chunk += temp;
        }
        req.rawBody = chunk;
        req.unshift(chunk);
        req.resume();
        req.removeListener('end', endHandler);
        next();
    }

    function endHandler() {
        next();
    }

    req.once('readable', readableHandler);
    req.once('end', endHandler);
}

module.exports = {
    recorder: recorder,
    bodyRawParser: bodyRawParser
}


