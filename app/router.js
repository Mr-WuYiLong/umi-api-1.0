'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, oAuth2Server, middleware } = app;
  // 前端获得token,通过curl
  router.all('/api/login/token', oAuth2Server.token(), 'login.token');
  // 登录
  router.post('/api/login/index', 'login.index');
  // 刷新访问token
  router.post('/api/login/refreshToken', 'login.refreshToken');
  // 获得登录访问token的过期时间
  // router.get('/api/login/getAccessTokenOverTime', oAuth2Server.authenticate(), 'login.getAccessTokenOverTime');
  // 根据名字获得管理员信息
  // router.get('/api/admin/getAdmin', 'admin.getAdmin');
  router.get('获得管理员分页', '/api/admin/getAdminList', oAuth2Server.authenticate(), middleware.rbac(), 'admin.getAdminList');
  router.post('新增管理员', '/api/admin/addAdmin', oAuth2Server.authenticate(), 'admin.addAdmin');
  router.put('更新管理员', '/api/admin/updateAdmin', oAuth2Server.authenticate(), 'admin.updateAdmin');
  router.delete('删除管理员', '/api/admin/deleteAdminById', oAuth2Server.authenticate(), 'admin.deleteAdminById');
  // 为管理员添加角色
  // router.post('/api/admin/addRoleForAdmin', 'admin.addRoleForAdmin');
  router.get('获得角色分页', '/api/role/getRolePage', oAuth2Server.authenticate(), 'role.getRolePage');
  router.get('获得角色列表', '/api/role/getRoleList', oAuth2Server.authenticate(), 'role.getRoleList');
  router.post('新增角色', '/api/role/addRole', oAuth2Server.authenticate(), 'role.addRole');
  router.put('更新角色', '/api/role/updateRole', oAuth2Server.authenticate(), 'role.updateRole');
  router.delete('删除角色', '/api/role/deleteRoleId', oAuth2Server.authenticate(), 'role.deleteRoleId');
  router.get('根据id查询角色信息', '/api/role/getRoleById', oAuth2Server.authenticate(), 'role.getRoleById');
  router.put('分配权限', '/api/role/assignPermissionById', oAuth2Server.authenticate(), 'role.assignPermissionById');
  router.post('添加菜单权限', '/api/permission/addPermission', oAuth2Server.authenticate(), 'permission.addPermission');
  router.post('添加访问权限', '/api/permission/addAccessPermission', oAuth2Server.authenticate(), 'permission.addAccessPermission');
  router.get('菜单权限分页', '/api/permission/getPermissionPage', oAuth2Server.authenticate(), 'permission.getPermissionPage');
  router.get('访问权限分页', '/api/permission/getAccessPermissionPage', oAuth2Server.authenticate(), 'permission.getAccessPermissionPage');
  router.get('权限列表', '/api/permission/getPermissionList', oAuth2Server.authenticate(), 'permission.getPermissionList');
  // 改变权限状态
  // router.put('/api/permission/changeStatus', oAuth2Server.authenticate(), 'permission.changeStatus');
  router.delete('逻辑删除菜单权限', '/api/permission/deletePermissionById', oAuth2Server.authenticate(), 'permission.deletePermissionById');
  router.delete('逻辑删除访问权限', '/api/permission/deleteAccessPermissionById', oAuth2Server.authenticate(), 'permission.deleteAccessPermissionById');
  router.get('菜单权限列表', '/api/permission/getMenuPermissionList', oAuth2Server.authenticate(), 'permission.getMenuPermissionList');
  router.get('访问权限列表', '/api/permission/getAccessPermissionList', oAuth2Server.authenticate(), 'permission.getAccessPermissionList');
  router.get('自动导入访问权限列表', '/api/permission/autoImportAccessPermission', oAuth2Server.authenticate(), 'permission.autoImportAccessPermission');
};
