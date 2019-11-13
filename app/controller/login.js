'use strict';

/**
 * 登录
 */
const Controller = require('egg').Controller;
class LoginController extends Controller {

  async index() {
    const { ctx } = this;
    const data = ctx.request.body;
    const result = await ctx.service.login.login(data);
    ctx.body = result;
  }
}

module.exports = LoginController;
