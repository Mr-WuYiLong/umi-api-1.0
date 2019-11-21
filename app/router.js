'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, oAuth2Server } = app;
  // 前端获得token
  router.all('/api/login', oAuth2Server.token(), controller.login.index);
};
