//parse the command line args

var minimist = require('minimist');

var knownOptions = {
    boolean: ['record', 'debug'],
    default: {'record': false, 'debug': false}
};

module.exports = minimist(process.argv.slice(2), knownOptions);
