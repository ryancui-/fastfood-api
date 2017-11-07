const mysql = require('think-model-mysql');
const JWTSession = require('think-session-jwt');

/**
 * model adapter config
 * @type {Object}
 */
exports.model = {
  type: 'mysql',
  common: {
    logConnect: true,
    logSql: true,
    logger: msg => think.logger.info(msg)
  },
  mysql: {
    handle: mysql,
    database: 'fastfood',
    prefix: 'fastfood_',
    encoding: 'utf8',
    host: '45.76.222.160',
    port: '3306',
    user: 'fastfood',
    password: '',
    dateStrings: true
  }
};

/**
 * session adapter config
 * @type {Object}
 */
exports.session = {
  type: 'jwt',
  common: {
    cookie: {
      name: 'thinkjs'
    }
  },
  jwt: {
    handle: JWTSession,
    secret: '',
    tokenType: 'header',
    tokenName: 'authorization',
    sign: {},
    verify: {}
  }
};
