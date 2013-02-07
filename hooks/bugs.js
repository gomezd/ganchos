
exports = module.exports;

exports.bugs = function (options) {
    return function (req, res, next) {
        console.log('Executing hook: bugs');
        next();
    };
};