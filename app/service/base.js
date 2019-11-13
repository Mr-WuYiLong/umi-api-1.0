'use strict';
/**
 * 基础service
 */
const Response = require('../lib/response');
const constant = require('../lib/constant');
const Service = require('egg').Service;
class BaseService extends Service {

  /** **响应结果 */
  async resCodeAndMsg(code, msg) {
    return new Response(code, msg);
  }

  async resCodeAndMsgAndData(code, msg, data) {
    return new Response(code, msg, data);
  }
  /** **响应结果-end */

  // 返回基本的常量
  resConstant() {
    return {
      ADMIN_NOT_EXITES: constant.ADMIN_NOT_EXITES,
      PASSWORD_ERROR: constant.PASSWORD_ERROR,
      LOGIN_SUCCESS: constant.LOGIN_SUCCESS,
    };
  }

}
module.exports = BaseService;
