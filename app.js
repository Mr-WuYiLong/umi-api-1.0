'use strict';
const casbin = require('casbin');
// const TypeORMAdapter = require('./app/lib/adapter').default;
const TypeORMAdapter = require('typeorm-adapter').default;
// const MongooseAdapter = require('@elastic.io/casbin-mongoose-adapter');

const path = require('path');
class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  // 应用已经启动完毕
  async didReady() {
    // 加载数据库链接
    const adapter = await TypeORMAdapter.newAdapter(this.app.config.casbin.typeORM);
    // // 加载cashbin.conf
    // this.app.enforcer = await casbin.newEnforcer(path.join(this.app.config.baseDir, 'app/rabc_model.conf'), typeORMAdapter);
    // console.log(typeORMAdapter);
    // const adapter = await MongooseAdapter.newAdapter('mongodb://localhost:27017/blog');
    this.app.enforcer = await casbin.newEnforcer(path.join(this.app.config.baseDir, 'app/rabc_model.conf'), adapter);
    this.app.enforcer.loadPolicy();
    // this.app.enforcer.EnableAutoSave(true);
    console.log('链接成功');

  }

}
module.exports = AppBootHook;
