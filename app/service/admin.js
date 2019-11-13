'use strict';

const BaseService = require('./base');
class AdminService extends BaseService {

  async getAdmin() {
    const { app } = this;
    const admin = await app.mysql.get;
  }
}

module.exports = AdminService;
