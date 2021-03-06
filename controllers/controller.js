const Joi = require('joi');
const Mongoose = require('mongoose');
const HttpCodes = require('../config/system/httpCodes');

/**
 * Controller class
 *
 * Provide methods to validate input
 * Provide methods to handle responses
 */
class Controller {
    constructor() {
        this.httpCodes = HttpCodes.codes;
        this.responseSuccess = HttpCodes.responseSuccess;
        this.responseError = HttpCodes.responseError;
    }

    /**
     * Set the default permissions to each method
     * @param  {String} entity       Entity that the permissions belongs
     * @param  {Object} extraMethods Object with extra methods to protect in te format
     *                               { method: permission }
     * @return {[type]}              [description]
     */
    protectMethods(entity, extraMethods) {
        this.entity = entity;
        this.protectedMethods = {
            fetch: `${entity}:see`,
            show: `${entity}:see`,
            create: `${entity}:create`,
            update: `${entity}:update`,
            delete: `${entity}:delete`,
        };
        if (extraMethods) {
            const methods = Object.keys(extraMethods);
            methods.forEach((method) => {
                this.protectedMethods[method] = `${entity}:${extraMethods[method]}`;
            });
        }
    }

    /**
     * Returns the protected methods object
     */
    getProtectedMethods() {
        const self = this;
        return {
            methods: self.protectedMethods,
            entity: self.entity,
        };
    }

    /**
     * Validate the user input data for the incomming request
     * @param  {Object} ctx    Koa context object
     * @param  {Object} schema Joi Schema
     * @return {Object}        Object with user input data validated
     *
     * @throws {Response Error} If validation fails
     */
    validator(ctx, schema) {
        const attributes = ctx.request.body;
        const validation = Joi.validate(attributes, schema, {
            convert: true,
        });

        if (validation.error) {
            ctx.logger.debug(validation.error.toString());
            let message = validation.error.toString();
            const index = message.indexOf('[');
            message = message.slice(index + 1, -1);
            const error = new Error(message);
            this.responseError(ctx, this.httpCodes.VALIDATION_ERROR, error);
        }

        return attributes;
    }

    /**
     * Validate a set of id's
     * @param  {Object} ctx [description]
     * @param  {Array} id's MongoDB Id
     *
     * @throws {Response Error} If a id is invalid
     */
    validateIds(ctx, input, ids) {
        const body = input;

        ids.forEach((id) => {
            if (!body[id]) {
                const message = `Field "${id}" is required`;
                this.responseError(ctx, this.httpCodes.VALIDATION_ERROR, message);
            }
            if ((typeof body[id]) !== 'string' || !Mongoose.Types.ObjectId.isValid(body[id])) {
                const message = `Field "${id}" is invalid`;
                this.responseError(ctx, this.httpCodes.VALIDATION_ERROR, message);
            }
        });
    }

    /**
     * Find a document by id
     * @param  {Object} ctx   Koa context
     * @param  {Object} Model Mongoose model
     * @param  {String} _id   Document id
     * @return {Object}       Document finded
     *
     * @throws {Response Error} If the document is not founded
     */
    async findById(ctx, Model, _id) {
        let document;
        try {
            document = await Model.findOne({ _id }, ['-__v']);
        } catch (error) {
            this.responseError(ctx, this.httpCodes.DB_ERROR, error);
        }

        if (!document) {
            const message = `${Model.modelName} with id ${_id} not founded`;
            this.responseError(ctx, this.httpCodes.NOT_FOUND_ERROR, message);
        }

        return document;
    }

    /**
     * [saveDocument description]
     * @param  {Object} ctx      Koa context
     * @param  {Object} document Document to save
     * @return {Object}          Document saved
     *
     * @throws {Response Error} If there is a error saving into MongoDB
     */
    async saveDocument(ctx, document) {
        let documentSaved;

        try {
            documentSaved = await document.save();
        } catch (error) {
            this.responseError(ctx, this.httpCodes.DB_ERROR, error);
        }

        return documentSaved;
    }
}

/**
 * Load the method requested for the controller if the request have the permissions
 * @param  {object} controller Controller instance
 * @return {function}          Method to execute
 *
 * @throws {Response Error} There are not permissions to access to the method
 */
function controllerLoader(controller) {
    return method => (ctx) => {
        const entity = controller.entity;
        const protectedMethods = controller.protectedMethods;
        if (protectedMethods) {
            const permissionRequired = protectedMethods[method];
            if (permissionRequired) {
                const permissionsAuthorized = (ctx.user && ctx.user.permissions) ?
                    ctx.user.permissions[entity] || [] : [];
                if (!permissionsAuthorized.find(permission => permission === permissionRequired)) {
                    ctx.logger.warn(`Permission required: ${permissionRequired}`);
                    ctx.logger.warn('Permissions autorized:', permissionsAuthorized);
                    const message = 'User not have permissions required';
                    HttpCodes.responseError(ctx, HttpCodes.codes.FORBIDDEN_ERROR, message);
                }
            }
        }
        return (controller[method])(ctx);
    };
}

module.exports = { Controller, controllerLoader };
