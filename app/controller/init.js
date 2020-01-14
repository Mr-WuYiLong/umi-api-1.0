'use strict';

/**
 * 系统初始化
 */

const Controller = require('egg').Controller;
class InitController extends Controller {

  async init() {
    const { ctx } = this;
    // 清空permission,role,admin
    await ctx.app.mysql.delete('permission');
    await ctx.app.mysql.delete('role');
    await ctx.app.mysql.delete('admin');
    // 添加所有路由
    const arr = ctx.app.router.stack;
    const newRoutes = arr.filter(item => item.name !== null);
    for (const item of newRoutes) {
      await ctx.app.mysql.insert('permission', { path: item.path, action: item.methods.length >= 2 ? item.methods[1] : item.methods[0], description: item.name, type: 3 });
    }
    const data1 = {
      name: '系统管理',
      pid: 0,
      type: 1,
      code: 'T2000',
    };
    await ctx.app.mysql.insert('permission', data1);

    // 添加管理员
    const data = {
      account: 'admin',
      password: '123456',
    };
    await ctx.app.mysql.insert('admin', data);

    // 添加角色
    const name = '管理员';
    await ctx.app.mysql.insert('role', { name });
    ctx.body = {
      code: 0,
      msg: '初始化成功',
    };

  }

  // 初始化管理员
  async initAdmin() {
    const { ctx } = this;
    // 权限
    const permissions = await ctx.app.mysql.select('permission');
    // 角色
    const role = await ctx.app.mysql.get('role', { name: '管理员' });

    // 把角色拥有的权限全部删除
    await this.app.enforcer.deletePermissionsForUser(role.id.toString());
    const accessCodes = [];
    // 把权限插入casbin表，实现真正的访问控制
    for (const item of permissions) {
      await this.app.enforcer.addPermissionForUser(role.id, item.path, item.action);
      accessCodes.push(item.id);
    }
    const data = await ctx.app.mysql.get('permission', { code: 'T2000' });
    const temp = [{
      name: '用户管理',
      pid: data.id,
      type: 2,
      code: '2001',
    }, {
      name: '角色管理',
      pid: data.id,
      type: 2,
      code: '2002',
    }, {
      name: '权限管理',
      pid: data.id,
      type: 2,
      code: '2003',
    }];

    for (const item of temp) {
      await ctx.app.mysql.insert('permission', item);
    }

    // 前端管理的code，依次填写
    const codes = 'T2000,2001,2002,2003';
    // 为角色赋予权限
    await ctx.app.mysql.update('role', { access_codes: accessCodes.join(','), codes }, { where: { name: '管理员' } });

    // 为管理员赋予角色
    await ctx.app.mysql.update('admin', { role_id: role.id }, { where: { account: 'admin' } });
    ctx.body = {
      code: 0,
      msg: '初始化管理员成功',
    };
  }
}

module.exports = InitController;
