
var debug = require('debug')('githooks:pkgjson'),
    colors = require('colors');

exports = module.exports = pkgjson = function (options) {
    return function pkgjsonHook (req, res, next) {
        debug('called from %s', req.url.red);
        next();
    };
};

exports.config = {
    some: "value"
};
