'use strict';

/**
 * oauth2的model
 */
const moment = require('moment');
module.exports = app => {
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

    // 验证登录用户的账号和密码
    async getUser(username, password) {
      // 从数据库中获得登录者的账号和密码
      const user = await app.mysql.get('admin', { account: username });
      if (username !== user.account || password !== user.password) {
        return;
      }
      return { userId: user.id };
    }

    // access_token的验证
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

    // 获得token并保存到数据库
    async saveToken(token, client, user) {
      const accessToken = {
        access_token: token.accessToken,
        expires_at: moment(token.accessTokenExpiresAt).format('YYYY-MM-DD HH:mm:ss'),
        client_id: client.clientId,
        user_id: user.userId,
      };
      const refreshToken = {
        refresh_token: token.refreshToken,
        expires_at: moment(token.refreshTokenExpiresAt).format('YYYY-MM-DD HH:mm:ss'),
        client_id: client.clientId,
        user_id: user.userId,
      };
      try {
        // 保存access_token,refresh_token到数据库
        await app.mysql.insert('access_token', accessToken);
        await app.mysql.insert('refresh_token', refreshToken);
        // 合并对象
        const _token = Object.assign({}, token, { user }, { client });
        return _token;
      } catch (error) {
        throw new Error('无法保存token');
      }
    }
  }

  return Model;
};
