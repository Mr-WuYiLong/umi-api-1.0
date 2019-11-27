'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, oAuth2Server } = app;
  // 前端获得token,通过curl
  router.all('/api/token', oAuth2Server.token());
  // 登录
  router.post('/api/login/index', 'login.index');
  // 根据名字获得管理员信息
  router.get('/api/admin/getAdmin', 'admin.getAdmin');
  // 获得管理员的列表
  router.get('/api/admin/getAdminList', oAuth2Server.authenticate(), 'admin.getAdminList');
};
