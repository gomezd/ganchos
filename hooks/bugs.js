
var debug = require('debug')('githooks:bugs');

exports = module.exports = function bugs (options) {
    //console.log("bugs hook:\n" + JSON.stringify(options, null, 2));
    return function bugsHook (req, res, next) {
        debug('called from %s', req.url);
        next();
    };
};

exports.config = {
    exported: "config for test"
};