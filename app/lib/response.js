'use strict';

/**
 * 公共的响应结果集
 */
class Response {
  constructor(code, msg, data) {
    this.code = code;
    this.msg = msg;
    this.data = data;
  }

  setCode(code) {
    this.code = code;
  }
  getCode() {
    return this.code;
  }
  setMsg(msg) {
    this.msg = msg;
  }
  getMsg() {
    return this.msg;
  }
  setData(data) {
    this.data = data;
  }
  getData() {
    return this.data;
  }
}

module.exports = Response;
