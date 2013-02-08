
var debug = require('debug')('githooks:bugs');

exports = module.exports = function bugs (options) {
    return function bugsHook (req, res, next) {
        debug('called from %s', req.url);
        next();
    };
};

exports.config = {
    exported: "config for test"
};