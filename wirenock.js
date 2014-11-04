var express = require('express');
var path = require('path');

var filestub = require('./routes/filestub');
var proxy = require('./routes/proxy');


var app = express();
var host = 'http://127.0.0.1:9001';
var stubDir = path.join(__dirname, './stubs');

//app.use(logger('dev'));
app.use('*', filestub({dir: stubDir}));
app.use('*', proxy({host: host}));


app.listen(9003, function () {
    console.log('Started WireNock');
});


module.exports = app;
