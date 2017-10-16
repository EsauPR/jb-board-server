const Joi = require('joi');
const { Controller, controllerLoader } = require('./controller');
const UserModel = require('../models/user_model');
const ScoreModel = require('../models/score_model');

class ScoreController extends Controller {

    constructor() {
        super();

        this.types = {
            'attend-session': {
                done: 10,
                notDone: -10,
            },
            'problem-solved': {
                done: 15,
                notDone: -15,
            },
            'problem-attempted': {
                done: 5,
                notDone: 0,
            },
            'exposing topic': {
                done: 40,
                notDone: -40,
            },
            'contest-first-place': {
                done: 80,
                notDone: 0,
            },
            'contest-second-place': {
                done: 50,
                notDone: 0,
            },
            'contest-third-place': {
                done: 30,
                notDone: 0,
            },
            'contest-problem-solved': {
                done: 15,
                notDone: 0,
            },
        };
    }

    /**
     * Create a user
     * @param  {Object} ctx Koa context
     */
    async create(ctx) {
        const inputs = this.validator(ctx, Joi.array().items(
            Joi.object().keys({
                user_id: Joi.string().trim().required(),
                type: Joi.any().valid([
                    'attend-session',
                    'problem-solved',
                    'problem-attempted',
                    'exposing topic',
                    'contest-first-place',
                    'contest-second-place',
                    'contest-third-place',
                    'contest-problem-solved',
                ]).required(),
                done: Joi.boolean().required(),
                description: Joi.string().trim().required(),
                date: Joi.date().required(),
            }),
        ));

        inputs.forEach(input => this.findById(ctx, UserModel, input.user_id));

        let promises = [];
        inputs.forEach((input) => {
            this.validateIds(ctx, input, ['user_id']);
            input.date = new Date(input.date); // eslint-disable-line
            input.points = this.types[input.type].done; // eslint-disable-line
            if (!input.done) {
                input.points = this.types[input.type].notDone; // eslint-disable-line
            }
            promises.push(this.saveDocument(ctx, new ScoreModel(input)));
        });

        let scores;
        try {
            scores = await Promise.all(promises);
        } catch (error) {
            ctx.logger.error(error);
            this.responseError(ctx, this.httpCodes.DB_ERROR, error);
        }

        promises = [];
        scores.forEach(score => promises.push(UserModel.updateOne(
            { _id: score.user_id },
            { $push: { scores: score._id } },
        )));

        try {
            await Promise.all(promises);
        } catch (error) {
            ctx.logger.error(error);
            this.responseError(ctx, this.httpCodes.DB_ERROR, error);
        }

        return this.responseSuccess(ctx, {
            data: scores,
        });
    }
}

const scoreController = new ScoreController();

module.exports = controllerLoader(scoreController);
