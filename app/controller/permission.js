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

  // 查询菜单权限管理分页
  async getPermissionPage() {
    const { ctx } = this;
    const current = Number(ctx.query.current);
    const pageSize = Number(ctx.query.pageSize);
    const result = await ctx.app.mysql.select('permission', { where: { status: 0, type: [ 1, 2 ] } });
    const data = await ctx.app.mysql.select('permission', {
      where: { status: 0, type: [ 1, 2 ] },
      columns: [ 'id', 'name', 'pid', 'type', 'code' ],
      // orders: [[ 'id', 'desc' ]],
      limit: pageSize,
      offset: (current - 1) * pageSize,
    });

    // 递归
    digui(data);

    if (result && result.length > 0) {
      const permissionList = {
        data: newData,
        pagination: {
          pageSize,
          current,
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

  // 查询访问权限管理分页
  async getAccessPermissionPage() {
    const { ctx } = this;
    const current = Number(ctx.query.current);
    const pageSize = Number(ctx.query.pageSize);

    const result = await ctx.app.mysql.select('permission', { where: { status: 0, type: 3 } });
    const data = await ctx.app.mysql.select('permission', {
      where: { status: 0, type: 3 },
      columns: [ 'id', 'action', 'path', 'description' ],
      orders: [[ 'id', 'desc' ]],
      limit: pageSize,
      offset: (current - 1) * pageSize,
    });

    if (result && result.length > 0) {
      const permissionList = {
        accessData: data,
        accessPagination: {
          pageSize,
          current,
          total: result.length,
        },
      };
      ctx.body = {
        code: 0,
        data: permissionList,
      };
    }
  }


  // 添加菜单权限
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
  // 添加访问权限
  async addAccessPermission() {
    const { ctx } = this;
    const data = ctx.request.body;
    data.type = 3;
    const result = await ctx.app.mysql.insert('permission', data);
    if (result.affectedRows === 1) {
      ctx.body = {
        code: 0,
      };
    }
  }

  // 获得菜单权限
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

  // 获得访问权限
  async getAccessPermissionList() {
    const { ctx } = this;
    const result = await ctx.app.mysql.select('permission', { where: { status: 0, type: 3 }, columns: [ 'id', 'action', 'path', 'description' ] });
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
  // async changeStatus() {
  //   const { ctx } = this;
  //   const data = ctx.request.body;
  //   if (data.status === 0) {
  //     data.status = 1;
  //   } else {
  //     data.status = 0;
  //   }
  //   const result = await ctx.app.mysql.update('permission', data);
  //   if (result.affectedRows === 1) {
  //     ctx.body = {
  //       code: 0,
  //     };
  //   }

  // }

  // 逻辑删除菜单权限
  async deletePermissionById() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    const result = await ctx.app.mysql.update('permission', { id, status: 1 });
    const result1 = await ctx.app.mysql.select('permission', { where: { pid: id, status: 0 } });

    // 把子菜单也去掉
    if (result1.length > 0) {
      for (const v of result1) {
        await ctx.app.mysql.update('permission', { id: v.id, status: 1 });
      }
    }
    if (result.affectedRows === 1) {
      // 将pid为id的权限,变为1
      ctx.body = {
        code: 0,
      };
    }
  }

  // 逻辑删除访问权限
  async deleteAccessPermissionById() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    const result = await ctx.app.mysql.update('permission', { id, status: 1 });
    console.log(result);
    if (result.affectedRows === 1) {
      const temp = await ctx.app.mysql.get('permission', { id, status: 1 });
      if (temp) {
        await this.app.enforcer.deletePermission(temp.path);
      }
      // 将pid为id的权限,变为1
      ctx.body = {
        code: 0,
      };
    }
  }

  // 自动导入访问所有权限
  async autoImportAccessPermission() {
    const { ctx } = this;
    // 删除原本的所有访问权限
    await ctx.app.mysql.delete('permission', { type: 3 });
    // 获得所有路由
    const arr = ctx.app.router.stack;
    const newRoutes = arr.filter(item => item.name !== null);
    for (const item of newRoutes) {
      await ctx.app.mysql.insert('permission', { path: item.path, action: item.methods.length >= 2 ? item.methods[1] : item.methods[0], description: item.name, type: 3 });
    }
    ctx.body = {
      code: 0,
    };
  }


}

module.exports = PermissionController;
