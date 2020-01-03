'use strict';

/**
 * 递归处理 分页
 */
let newData = [];
function digui(data, id = 0) {
  data.forEach(e => {
    if (id === e.pid) {
      newData.push(e);
      digui(data, e.id);
    }
  });
}

const Controller = require('egg').Controller;
class PermissionController extends Controller {

  // 查询权限管理分页
  async getPermissionPage() {
    const { ctx } = this;
    const current = ctx.query.current;
    const pageSize = ctx.query.pageSize;
    const result = await ctx.app.mysql.select('permission');
    const data = await ctx.app.mysql.select('permission', {
      // orders: [[ 'id', 'desc' ]],
      limit: pageSize,
      offset: current,
    });

    // 递归
    digui(data);

    if (result && result.length > 0) {
      const permissionList = {
        data: newData,
        pagination: {
          pageSize: Number(pageSize),
          current: Number(current),
          total: result.length,
        },
      };
      newData = [];
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

  // 菜单权限
  async getMenuPermissionList() {
    const { ctx } = this;
    const result = await ctx.app.mysql.select('permission', { where: { status: 0, type: 1, pid: 0 }, columns: [ 'code', 'name', 'pid', 'id' ] });
    const result1 = await ctx.app.mysql.query('select code,name,id,pid from permission where status = 0 and pid not in (0) ');
    result.forEach((v, k) => {
      const child = [];
      result1.forEach(i => {
        if (v.id === i.pid) {
          child.push(i);
        }
      });
      if (child.length > 0) {
        result[k].children = child;
      }
    });

    ctx.body = {
      code: 0,
      data: result,
    };
  }

  // 查询所有权限列表
  async getPermissionList() {
    const { ctx } = this;
    const result = await ctx.app.mysql.select('permission', { where: { status: 0, type: 1 } });
    ctx.body = {
      code: 0,
      data: result,
    };
  }

  // 改变状态
  async changeStatus() {
    const { ctx } = this;
    const data = ctx.request.body;
    if (data.status === 0) {
      data.status = 1;
    } else {
      data.status = 0;
    }
    const result = await ctx.app.mysql.update('permission', data);
    if (result.affectedRows === 1) {
      ctx.body = {
        code: 0,
      };
    }

  }

  // 删除权限
  async deletePermissionById() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    const result = await ctx.app.mysql.delete('permission', { id });
    if (result.affectedRows === 1) {
      ctx.body = {
        code: 0,
      };
    }
  }


}

module.exports = PermissionController;
