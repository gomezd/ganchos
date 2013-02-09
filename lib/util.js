
require('colors');

var error = function (msg, e, full) {
        var fmt = '✘ ' + msg;
        if (e) {
            fmt += '\n' + (full && e.stack ? e.stack : e);
        }
        console.error(fmt.red);
    },

    success = function (msg) {
        console.log(('✔ ' + msg).green);
    },

    fatal = function (msg, e, code) {
        error(msg, e, true);
        process.exit(code || -1);
    };

module.exports = {
    error: error,
    success: success,
    fatal: fatal
};