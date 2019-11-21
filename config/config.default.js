/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1570517776492_5725';
  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: 'localhost',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: 'mysqlpwd',
      // 数据库名
      database: 'umi',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };

  config.casbin = {
    // mysql
    typeORM: {
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'mysqlpwd',
      database: 'umi',

    },
    // mongodb
    // typeORM: {
    //   type: 'mongodb',
    //   host: 'localhost',
    //   port: 27017,
    //   database: 'blog',
    // },
  };


  config.redis = {
    client: {
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
      password: '',
      db: 0,
    },
  };

  // 跨域处理
  config.cors = {
    origin: 'http://localhost:8000',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  // oauth2
  config.oAuth2Server = {
    debug: appInfo.env === 'local',
    grants: [ 'password' ], // grants: ['password', 'authorization_code', 'refresh_token']
    clientId: 'umi', // 客户端id
    clientSecret: '11111', // 客户端密码,
    // accessTokenLifetime: 7200, // 自定义访问token的有效时间，默认一个小时有效期
    // refreshTokenLifetime: 86400, // 自定义刷新token的有效时间，默认15天有效期
  };


  return {
    ...config,
    ...userConfig,
  };
};
