module.exports = function(fn) {
    return (res, req, next) => {
        fn(res, req, next).catch(next);
    };
};