'use strict';

const Controller = require('egg').Controller;
class RightController extends Controller {

  async index() {

    const add = await this.app.enforcer();
  }
}

module.exports = RightController;
