'use strict';


/**
 * 登录
 */
const moment = require('moment');
const Controller = require('egg').Controller;
class LoginController extends Controller {

  // ctx.state.oauth.token
  async index() {
    const { ctx } = this;
    const token = ctx.state.oauth.token;
    // console.log(moment(token.refreshTokenExpiresAt).format('YYYY-MM-DD HH:mm:ss'));
    // const result = await ctx.service.login.login(data);
    ctx.body = token;
  }
}

module.exports = LoginController;
