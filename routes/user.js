const UserController = require('../controllers/user_controller');

/**
 * Set the routes defined inside
 * @param {object}  router  koa router object
 */
function routeSetter(router) {
    router.get('/v1/users', UserController('fetch'));
    router.get('/v1/users/:userId', UserController('get'));
    router.post('/v1/users', UserController('create'));
}

module.exports = routeSetter;
