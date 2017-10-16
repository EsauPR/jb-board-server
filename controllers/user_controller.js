const Joi = require('joi');
const { Controller, controllerLoader } = require('./controller');
const UserModel = require('../models/user_model');

class UserController extends Controller {

    /**
     * Fetch all the users
     * @param  {Object} ctx Koa context
     */
    async fetch(ctx) {
        let users;

        try {
            users = await UserModel.find({}, [
                '-__v',
                '-updated_at',
                '-created_at',
            ]).populate('scores', [
                '-__v',
                '-user_id',
                '-updated_at',
                '-created_at',
            ]);
        } catch (error) {
            this.responseError(ctx, this.httpCodes.DB_ERROR, error);
        }

        this.responseSuccess(ctx, {
            status: this.httpCodes.CREATED.httpCode,
            data: { users },
        });
    }

    /**
     * Create a user
     * @param  {Object} ctx Koa context
     */
    async create(ctx) {
        const input = this.validator(ctx, Joi.object().keys({
            name: Joi.string().trim().required(),
            avatar: Joi.string().trim().required(),
        }));

        const user = await this.saveDocument(ctx, UserModel(input));

        return this.responseSuccess(ctx, {
            data: user,
        });
    }

}

const userController = new UserController();

module.exports = controllerLoader(userController);
