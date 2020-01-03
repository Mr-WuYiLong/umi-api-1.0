'use strict';

/**
 * 角色管理
 */
const Controller = require('egg').Controller;
class RoleController extends Controller {

  // 查询角色分页
  async getRolePage() {
    const { ctx } = this;
    const current = ctx.query.current;
    const pageSize = ctx.query.pageSize;
    const result = await ctx.app.mysql.select('role', { where: { status: 0 } });
    const data = await ctx.app.mysql.select('role', {
      where: { status: 0 },
      orders: [[ 'id', 'desc' ]],
      limit: pageSize,
      offset: current,
    });
    if (result && result.length > 0) {
      const roleList = {
        data,
        pagination: {
          pageSize: Number(pageSize),
          current: Number(current),
          total: result.length,
        },
      };
      ctx.body = {
        code: 0,
        data: roleList,
      };
    }
  }

  // 查询角色列表
  async getRoleList() {
    const { ctx } = this;
    const result = await ctx.app.mysql.select('role', { where: { status: 0 } });
    if (result.length >= 0) {
      ctx.body = {
        code: 0,
        data: result,
      };
    }
  }

  // 根据id查询角色拥有的权限
  async getRoleById() {
    const { ctx } = this;
    const id = ctx.query.id;
    const result = await ctx.app.mysql.get('role', { id });
    const result1 = await ctx.app.mysql.select('permission', { where: { status: 0 }, columns: [ 'code' ] });
    const arr = result.codes != null ? result.codes.split(',') : [];
    const newArr = [];
    result1.forEach(e => {
      if (arr.includes(e.code)) {
        newArr.push(e.code);
      }
    });

    ctx.body = {
      code: 0,
      data: newArr,
    };
  }

  // 根据角色id分配权限
  async assignPermissionById() {
    const { ctx } = this;
    const { checkedKeys, roleId } = ctx.request.body;
    const result = await ctx.app.mysql.update('role', { codes: checkedKeys.length > 0 ? checkedKeys.join(',') : null, id: roleId });
    if (result.affectedRows === 1) {
      ctx.body = {
        code: 0,
        msg: '分配成功',
      };
    }
  }
}

// const add = await this.app.enforcer.addPermissionForUser('管理员', 'ddd', 'post');
// console.log(add);

module.exports = RoleController;
