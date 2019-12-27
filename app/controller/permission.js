'use strict';

const Controller = require('egg').Controller;
class PermissionController extends Controller {

  // 查询权限管理分页
  async getPermissionPage() {
    const { ctx } = this;
    const current = ctx.query.current;
    const pageSize = ctx.query.pageSize;
    const result = await ctx.app.mysql.select('permission', { where: { status: 0 } });
    const data = await ctx.app.mysql.select('permission', {
      where: { status: 0 },
      // orders: [[ 'id', 'desc' ]],
      limit: pageSize,
      offset: current,
    });

    // 获得排序后的数组  (待优化)
    const newData = [];
    data.forEach(v => {
      let temp = null;
      if (v.pid === 0) {
        newData.push(v);
        temp = v.id;
        data.forEach(item => {
          if (item.pid === temp) {
            newData.push(item);
          }
        });
      }
    });


    if (result && result.length > 0) {
      const permissionList = {
        data: newData,
        pagination: {
          pageSize: Number(pageSize),
          current: Number(current),
          total: result.length,
        },
      };
      ctx.body = {
        code: 0,
        data: permissionList,
      };
    }
  }


  // 添加权限
  async addPermission() {
    const { ctx } = this;
    const data = ctx.request.body;
    if (data.pid === undefined) {
      data.pid = 0;
    }
    const result = await ctx.app.mysql.insert('permission', data);
    if (result.affectedRows === 1) {
      ctx.body = {
        code: 0,
      };
    }
  }

  // 查询权限列表
  async getPermissionList() {
    const { ctx } = this;
    const result = await ctx.app.mysql.select('permission', { where: { status: 0, type: 1 }, columns: [ 'id', 'name' ] });
    ctx.body = {
      code: 0,
      data: result,
    };
  }

  // 删除权限
  async deletePermission() {
    const { ctx } = this;
    const del = await this.app.enforcer.deletePermissionForUser('管理员', 'ddd', 'get');

    ctx.body = {
      code: 0,
    };
  }
}

module.exports = PermissionController;
