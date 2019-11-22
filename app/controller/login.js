'use strict';


/**
 * 登录
 */
const Controller = require('egg').Controller;
class LoginController extends Controller {

  // ctx.state.oauth.token
  async index() {
    const { ctx } = this;
    const { data } = ctx.request.body;
    // 生成token
    const token = await ctx.curl('http://localhost:7002/api/token', {
      method: 'post',
      data,
      dataType: 'json',
      timeout: 10000,
    });
    ctx.body = token;
  }
}

module.exports = LoginController;
