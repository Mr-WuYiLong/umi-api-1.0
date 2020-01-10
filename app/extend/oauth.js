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
      if (!user) { // 根据业务需要return 错误标识
        return false;
      }
      if (username !== user.account || password !== user.password) {
        return false;// 根据业务需要return 错误标识
      }
      // 查询用户角色， 获得角色具有的权限
      const result = await app.mysql.get('role', { id: user.role_id });
      const result1 = await app.mysql.select('permission', { where: { status: 0 }, columns: [ 'code' ] });
      const arr = result.codes != null ? result.codes.split(',') : [];
      const newArr = [];
      result1.forEach(e => {
        if (arr.includes(e.code)) {
          newArr.push(e.code);
        }
      });
      return { userId: user.id, codes: newArr };
    }

    // access_token的验证
    async getAccessToken(bearerToken) {
      const result = await app.mysql.get('access_token', { access_token: bearerToken });
      // 根据用户id查找对应的角色id
      const user = await app.mysql.get('admin', { id: result.user_id });
      const token = {
        accessToken: result.access_token,
        accessTokenExpiresAt: new Date(result.expires_at),
        user: { id: result.user_id, roleId: user.role_id },
        client: { id: result.client_id },
      };
      return token;
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

    // 取消刷新token
    async revokeToken(token) {
      try {
        return await app.mysql.delete('refresh_token', { refresh_token: token.refreshToken });
      } catch (err) {
        return false;
      }
    }

    // 通过refreshToken刷新token
    async getRefreshToken(refreshToken) {
      try {
        const refToken = await app.mysql.get('refresh_token', { refresh_token: refreshToken });
        if (!refToken) return;
        const user = await app.mysql.get('admin', { id: refToken.user_id });
        if (!user) return;
        return {
          refreshToken: refToken.refresh_token,
          refreshTokenExpiresAt: new Date(refToken.expires_at),
          client: { clientId: refToken.client_id }, // with 'id' property
          user: { userId: user.id },
        };
      } catch (err) {
        return false;
      }
    }
  }

  return Model;
};
