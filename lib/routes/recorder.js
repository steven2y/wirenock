var fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
    templateMap;


templateMap = {
    request: {},
    response: {
        status:200
    }
};

function recorder (response) {
    var body = '',
        mappingFileName = '',
        bodyFileName = '',
        dirTemp = path.join(__dirname, 'temp'),
        data;

    if(!fs.existsSync(dirTemp)){
        fs.mkdirSync(dirTemp)
    }

    response.on('data', function (chunk) {
        body += chunk;
    });
    response.on('end', function () {

        mappingFileName = 'mapping-' + response.request.uri.pathname.replace(/\//g, '-') + '.json';
        bodyFileName = 'body-' + response.request.uri.pathname.replace(/\//g, '-') + '.json';

        templateMap.request.url = response.request.uri.path;
        templateMap.request.method = response.request.method;

        templateMap.response.bodyFileName = bodyFileName;
        templateMap.response.headers = response.headers;
        templateMap.response.status = response.statusCode;

        if(response.request.headers.authorization){
            templateMap.request.headers = {
                authorization: {
                    equalTo: response.request.headers.authorization
                }
            };
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



module.exports = recorder;


