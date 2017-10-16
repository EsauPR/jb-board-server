/**
 * Http Errors handle by de system
 * @type {Object}
 */
module.exports = {
    codes: {
        SUCCESS: { name: 'Success', httpCode: 200 },
        CREATED: { name: 'Created', httpCode: 201 },
        VALIDATION_ERROR: { name: 'ValidationError', httpCode: 422 },
        DB_ERROR: { name: 'InternalError', httpCode: 500 },
        NOT_FOUND_ERROR: { name: 'NotFound', httpCode: 422 },
        UNAUTHORIZED_ERROR: { name: 'Unauthorized', httpCode: 401 },
        FORBIDDEN_ERROR: { name: 'Forbidden', httpCode: 403 },
    },
    /**
     * Handler for error responses of the requests
     * @param  {Object}           ctx   Koa context
     * @param  {Int}              type  Error code
     * @param  {Object | String}  error Object Error or error message
     */
    responseError: (ctx, type, error) => {
        if (type.httpCode === 500) {
            ctx.logger.error(error);
        } else {
            ctx.logger.warn(error);
        }
        const messageError = error.message || error;
        ctx.throw(type.httpCode, `${type.name}:: ${messageError}`);
    },
    /**
     * Handler for success responses of the requests
     * @param  {Object}           ctx   Koa context
     * @param  {Int}              type  Error code
     * @param  {Object | String}  error Object Error or error message
     */
    responseSuccess(ctx, response) {
        ctx.logger.debug(response);
        ctx.message = response.message || 'OK';
        ctx.status = response.status || 200;
        ctx.body = {
            data: response.data || {},
        };
    },
};
