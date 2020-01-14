'use strict';

// 访问控制
module.exports = options => {

  return async function rbac(ctx, next) {

    // 请求的处理
    const { method, url } = ctx.request;
    let path = '';
    if (url.indexOf('?') !== -1) {
      path = url.slice(0, url.indexOf('?'));
    } else {
      path = url;
    }
    // 获得用户具有的角色id
    const roleId = ctx.state.oauth.token.user.roleId;
    // 判断对应角色是否具有权限
    const result = await ctx.app.enforcer.enforce(roleId, path, method); // 分别是角色id,访问路径，请求方法
    if (!result) {
      ctx.body = {
        code: 403,
        url,
      };
      return;
    }
    await next();

  };
};
