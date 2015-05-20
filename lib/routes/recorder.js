var fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
    templateMap;


templateMap = ['{',
    '"request" : {',
    '  "url" : "<%=url%>",',
    '  "method" : "<%=method%>"',
    '},',
    '"response" : {',
    '  "status" : 200,',
    '  "bodyFileName" : "<%=bodyFileName%>",',
    '  "headers" : <%=headers%>',
    '}',
    '}'].join('');

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

        data = {
            url: response.request.uri.path,
            headers: JSON.stringify(response.headers),
            bodyFileName: bodyFileName,
            method: response.request.method
        }

        fs.writeFileSync(path.join(dirTemp, mappingFileName), _.template(templateMap)(data));
        fs.writeFileSync(path.join(dirTemp, bodyFileName), body);

        console.log('recorded ', mappingFileName);
        console.log('recorded ', bodyFileName);
    });

};



module.exports = recorder;


