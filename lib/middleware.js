
var debug = require('debug')('githooks:middleware'),
    util = require('./util'),

    noContent = function (options) {
        return function noContentHandler (req, res) {
            debug('No Content handler: %s', req.url);
            res.send(204);
        };
    },

    error = function (options) {
        return function errorHandler (err, req, res, next) {
            debug("Error handler: %s", req.url);
            util.error('Failed to handle ' + req.url, e, true);
            res.send(500);
        };
    };

module.exports = {
    noContentHandler: noContent,
    errorHandler: error
};
