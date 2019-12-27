'use strict';

/**
 * 角色管理
 */
const Controller = require('egg').Controller;
class RoleController extends Controller {

  // 查询角色列表
  async getRolePage() {
    const { ctx } = this;
    const current = ctx.query.current;
    const pageSize = ctx.query.pageSize;
    const result = await ctx.app.mysql.select('role', { where: { status: 0 } });
    const data = await ctx.app.mysql.select('role', {
      where: { status: 0 },
      orders: [[ 'id', 'desc' ]],
      limit: pageSize,
      offset: current,
    });
    if (result && result.length > 0) {
      const roleList = {
        data,
        pagination: {
          pageSize: Number(pageSize),
          current: Number(current),
          total: result.length,
        },
      };
      ctx.body = {
        code: 0,
        data: roleList,
      };
    }
  }

  // 根据角色的id查询
  async getRoleList() {
    const { ctx } = this;
    const result = await ctx.app.mysql.select('role', { where: { status: 0 } });
    if (result.length >= 0) {
      ctx.body = {
        code: 0,
        data: result,
      };
    }
  }
}

// const add = await this.app.enforcer.addPermissionForUser('管理员', 'ddd', 'post');
// console.log(add);

module.exports = RoleController;
