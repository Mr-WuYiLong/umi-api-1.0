'use strict';

const Controller = require('egg').Controller;
class PermissionController extends Controller {

  // 查询权限管理分页
  async getPermissionPage() {
    const { ctx } = this;
    const current = ctx.query.current;
    const pageSize = ctx.query.pageSize;
    const result = await ctx.app.mysql.select('permission', { where: { status: 0 } });
    const data = await ctx.app.mysql.select('permission', {
      where: { status: 0 },
      orders: [[ 'id', 'desc' ]],
      limit: pageSize,
      offset: current,
    });
    if (result && result.length > 0) {
      const permissionList = {
        data,
        pagination: {
          pageSize: Number(pageSize),
          current: Number(current),
          total: result.length,
        },
      };
      ctx.body = {
        code: 0,
        data: permissionList,
      };
    }
  }

  // 为用户或角色添加权限
  async addPermission() {
    const { ctx } = this;
    const add = await this.app.enforcer.addPermissionForUser('管理员', 'ddd', 'post');
    console.log(add);
    ctx.body = {
      code: 0,

    };
  }

  // 为用户或角色删除权限
  async deletePermission() {
    const { ctx } = this;
    const del = await this.app.enforcer.deletePermissionForUser('管理员', 'ddd', 'get');
    console.log(del);
    ctx.body = {
      code: 0,
    };
  }
}

module.exports = PermissionController;
