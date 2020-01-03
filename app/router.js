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
  // 获得登录访问token的过期时间
  // router.get('/api/login/getAccessTokenOverTime', oAuth2Server.authenticate(), 'login.getAccessTokenOverTime');
  // 根据名字获得管理员信息
  router.get('/api/admin/getAdmin', 'admin.getAdmin');
  // 获得管理员分页
  router.get('/api/admin/getAdminList', oAuth2Server.authenticate(), 'admin.getAdminList');
  // 为管理员添加角色
  router.post('/api/admin/addRoleForAdmin', 'admin.addRoleForAdmin');
  // 角色分页
  router.get('/api/role/getRolePage', oAuth2Server.authenticate(), 'role.getRolePage');
  // 角色列表
  router.get('/api/role/getRoleList', oAuth2Server.authenticate(), 'role.getRoleList');
  // 根据id查询角色信息
  router.get('/api/role/getRoleById', oAuth2Server.authenticate(), 'role.getRoleById');
  // 分配权限
  router.put('/api/role/assignPermissionById', oAuth2Server.authenticate(), 'role.assignPermissionById');
  // 添加权限
  router.post('/api/permission/addPermission', oAuth2Server.authenticate(), 'permission.addPermission');
  // 权限分页
  router.get('/api/permission/getPermissionPage', oAuth2Server.authenticate(), 'permission.getPermissionPage');
  // 权限列表
  router.get('/api/permission/getPermissionList', oAuth2Server.authenticate(), 'permission.getPermissionList');
  // 改变权限状态
  router.put('/api/permission/changeStatus', oAuth2Server.authenticate(), 'permission.changeStatus');
  // 根据id删除权限
  router.delete('/api/permission/deletePermissionById', oAuth2Server.authenticate(), 'permission.deletePermissionById');
  // 菜单权限
  router.get('/api/permission/getMenuPermissionList', oAuth2Server.authenticate(), 'permission.getMenuPermissionList');


};
