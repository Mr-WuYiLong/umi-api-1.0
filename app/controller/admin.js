'use strict';
/**
 * 管理员
 */
const Controller = require('egg').Controller;
class AdminController extends Controller {

  // 根据名字查询管理员的信息
  async getAdmin() {
    const { ctx } = this;
    const username = ctx.query.username;
    const result = await ctx.app.mysql.get('admin', { account: username });
    if (!result) {
      ctx.body = {
        code: 404,
        msg: '数据不存在',
      };
    }
    ctx.body = {
      code: 0,
      data: result,
    };
  }

  // 获得管理员的分页
  async getAdminList() {
    const { ctx } = this;
    const current = ctx.query.current;
    const pageSize = ctx.query.pageSize;
    const result = await ctx.app.mysql.select('admin', { where: { status: 0 } });
    const data = await ctx.app.mysql.select('admin', {
      where: { status: 0 },
      orders: [[ 'id', 'desc' ]],
      limit: pageSize,
      offset: current,
    });
    if (result && result.length > 0) {
      const adminList = {
        data,
        pagination: {
          pageSize: Number(pageSize),
          current: Number(current),
          total: result.length,
        },
      };
      ctx.body = {
        code: 0,
        data: adminList,
      };
    }
  }

  // 为管理员添加角色
  async addRoleForAdmin() {
    const { ctx } = this;
    // const add = await this.app.enforcer.addRoleForUser('admin', '管理员');
    // console.log(add);
    const a = await this.app.enforcer.enforce('admin', 'ddd', 'post');
    console.log(a);
    ctx.body = {
      code: 0,
    };
  }
}

module.exports = AdminController;
