var express = require('express'),
    path = require('path'),
    filestub = require('./routes/filestub'),
    proxy = require('./routes/proxy'),
    app = express(),
    stubDir = path.join(__dirname, './stubs'),
    morgan = require('morgan'),
// create "middleware"
    logger = morgan('combined'),
    args = require('./support/args'),
    host, port, debug;


host = process.argv[2]; //the target
port = process.argv[3]; //port on localhost
debug = process.argv[4];


if (args.debug) {
    app.use(logger);
}

if (!args.record) {
    app.use('*', filestub({dir: stubDir}));
}

app.use('*', proxy({host: host}));


app.listen(port, function () {
    console.log('Started WireNock on port', port, 'forwarding to', host);
});


module.exports = app;
