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
    // 生成token 服务端到服务端
    const token = await ctx.curl('http://localhost:7002/api/token', {
      method: 'post',
      data,
      dataType: 'json',
      timeout: 10000,
    });
    delete token.data.client;
    ctx.body = { data: token.data, status: token.status };
  }

  async refreshToken() {
    const { ctx } = this;
    const { data } = ctx.request.body;
    // 生成token 服务端到服务端
    const token = await ctx.curl('http://localhost:7002/api/token', {
      method: 'post',
      data,
      dataType: 'json',
      timeout: 10000,
    });
    delete token.data.client;
    ctx.body = { data: token.data, status: token.status };
  }

  async token() {
    const { ctx } = this;
    ctx.body = ctx.state.oauth.token;
  }
}

module.exports = LoginController;
