
var debug = require('debug')('githooks:packaged');

exports = module.exports = packaged = function (options) {
    return function packagedHook (req, res, next) {
        debug('called from %s', req.url);
        next();
    };
};

exports.config = {
    some: "value"
};
