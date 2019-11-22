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
}

module.exports = AdminController;
