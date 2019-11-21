'use strict';

const path = require('path');
module.exports = app => {

  // // Mock Data
  // nconf.use('file', {
  //   file: path.join(app.config.baseDir, 'app/mock/db.json'),
  // });

  class Model {
    constructor(ctx) {
      this.ctx = ctx;
    }

    // 传过来实参必须格式：client_id,client_secret,接收的形参可以是随意格式的变量
    async getClient(clientId, clientSecret) {
      const client = app.config.oAuth2Server;
      if (clientId !== client.clientId || clientSecret !== client.clientSecret) {
        return;
      }
      return client;
    }

    async getUser(username, password) {
      // 从数据库中获得登录者的账号和密码
      const user = await app.mysql.get('admin', { account: username });
      if (username !== user.account || password !== user.password) {
        return;
      }
      return { userId: user.id };
    }

    async getAccessToken() {
      // const token = nconf.get('token');
      // token.accessTokenExpiresAt = new Date(token.accessTokenExpiresAt);
      // token.refreshTokenExpiresAt = new Date(token.refreshTokenExpiresAt);
      // const user = nconf.get('user');
      // const client = nconf.get('client');
      // token.user = user;
      // token.client = client;
      console.log(2222);
      return 'tok';
    }

    async saveToken(token, client, user) {
      // 合并对象
      const _token = Object.assign({}, token, { user }, { client });
      // console.log(_token);
      return _token;
    }
  }

  return Model;
};
