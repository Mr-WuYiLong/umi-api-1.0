'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, oAuth2Server } = app;
  // 前端获得token,通过curl
  router.all('/api/token', oAuth2Server.token(), 'login.token');
  // 登录
  router.post('/api/login/index', 'login.index');
  // 刷新访问token
  router.post('/api/login/refreshToken', 'login.refreshToken');
  // // 获得登录访问token的过期时间
  // router.get('/api/login/getAccessTokenOverTime', oAuth2Server.authenticate(), 'login.getAccessTokenOverTime');
  // 根据名字获得管理员信息
  router.get('/api/admin/getAdmin', 'admin.getAdmin');
  // 获得管理员的列表
  router.get('/api/admin/getAdminList', oAuth2Server.authenticate(), 'admin.getAdminList');

};
