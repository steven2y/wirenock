var path = require('path');
var fs = require('fs');


module.exports = function (dir) {
    var mappingsFileList = [],
    mappings = [];
    mappingsFileList = fs.readdirSync(path.join(dir, 'mappings'));
    mappingsFileList.forEach(function (map) {
        //load the actual js file up
        mappings.push(require(path.resolve(path.join(dir, 'mappings', map))));
    });

    //array of mappings
    return mappings;
};