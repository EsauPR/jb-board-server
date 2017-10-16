/**
 * Load environment variables
 */
const LoadEnv = require('./utils/envLoader');

/**
 * laod init db function
 */
const { init } = require('./config/system/mongoose');

/**
 * Load init koa function
 */
const koa = require('./config/system/koa');

/**
 * Load logger util
 */
const Logger = require('./utils/logger');

const logger = new Logger();

/**
 * Load environment variables
 */
const parsedObject = LoadEnv.load({
    path: process.argv[2] ? process.argv[2] : './config/production_variables.env',
});

if (parsedObject.error) {
    logger.error(parsedObject.error);
}

/**
 * Init the server
 */
init(() => koa());
