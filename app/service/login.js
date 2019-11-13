'use strict';
/**
 * 登录服务
 */
const BaseService = require('./base');
class LoginService extends BaseService {
  async login({ account, password }) {
    const { app } = this;
    const data = await app.mysql.get('admin', { account });
    if (!data) {
      return this.resCodeAndMsg(this.resConstant().ADMIN_NOT_EXITES.code, this.resConstant().ADMIN_NOT_EXITES.msg);
    }
    if (password !== data.password) {
      return this.resCodeAndMsg(this.resConstant().PASSWORD_ERROR.code, this.resConstant().PASSWORD_ERROR.msg);
    }
    return this.resCodeAndMsg(this.resConstant().LOGIN_SUCCESS.code, this.resConstant().LOGIN_SUCCESS.msg);
  }
}

module.exports = LoginService;
