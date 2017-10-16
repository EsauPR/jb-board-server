const ScoreController = require('../controllers/score_controller');

/**
 * Set the routes defined inside
 * @param {object}  router  koa router object
 */
function routeSetter(router) {
    router.post('/v1/scores', ScoreController('create'));
}

module.exports = routeSetter;
