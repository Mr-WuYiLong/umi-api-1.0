'use strict';
/**
 * 登录服务
 */
const Service = require('egg').Service;
class LoginService extends Service {
  async login({ account, password }) {
    const { app } = this;
    const data = await app.mysql.get('admin', { account });
    if (data && password === data.password) {
      return {
        code: 0,
        msg: '登录成功',
      };
    }
    return {
      code: -1,
      msg: '登录失败',
    };
  }
}

module.exports = LoginService;
