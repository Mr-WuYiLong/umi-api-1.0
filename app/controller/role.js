'use strict';

/**
 * 角色管理
 */
const Controller = require('egg').Controller;
class RoleController extends Controller {

  // 查询角色分页
  async getRolePage() {
    const { ctx } = this;
    const current = Number(ctx.query.current);
    const pageSize = Number(ctx.query.pageSize);
    // 搜索的字段
    const { name } = ctx.query;
    const result = await ctx.app.mysql.select('role', { where: { status: 0 } });
    const params = {};
    let sql = 'select * from role where status = 0 ';
    if (name !== '' && name !== undefined) {
      sql += 'and name like :name ';
      params.name = '%' + name + '%';
    }
    const offset = (current - 1) * pageSize;
    const data = await ctx.app.mysql.query(sql + `order by id desc limit ${offset}, ${pageSize}`, params);
    if (result && result.length > 0) {
      const roleList = {
        data,
        pagination: {
          pageSize,
          current,
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

    // 菜单权限整理
    const result1 = await ctx.app.mysql.select('permission', { where: { status: 0 }, columns: [ 'code' ] });
    const arr = result.codes !== null ? result.codes.split(',') : [];
    const newArr = [];
    // 过滤掉状态为1的权限
    result1.forEach(e => {
      if (arr.filter(item => item.indexOf('T') === -1).includes(e.code)) {
        newArr.push(e.code);
      }
    });

    // 访问权限整理
    const accessArr = result.access_codes != null ? result.access_codes.split(',') : [];
    ctx.body = {
      code: 0,
      data: { newArr, accessArr },
    };
  }

  // 根据角色id分配权限
  async assignPermissionById() {
    const { ctx } = this;
    const { checkedKeys, roleId, accessCodes, accessId, menuId } = ctx.request.body;
    let result = null;
    if (accessId === 0 && menuId === 0) {
      result = await ctx.app.mysql.update('role', { codes: checkedKeys.length > 0 ? checkedKeys.join(',') : null, id: roleId, access_codes: accessCodes.length > 0 ? accessCodes.join(',') : null });
    } else if (accessId === 1 && menuId === 0) {
      result = await ctx.app.mysql.update('role', { codes: checkedKeys.length > 0 ? checkedKeys.join(',') : null, id: roleId });
    } else if (accessId === 0 && menuId === 1) {
      result = await ctx.app.mysql.update('role', { id: roleId, access_codes: accessCodes.length > 0 ? accessCodes.join(',') : null });
    }


    if (result.affectedRows === 1) {
      // 把角色拥有的权限全部删除
      await this.app.enforcer.deletePermissionsForUser(roleId.toString());
      if (accessCodes.length > 0) {
        const permissions = await ctx.app.mysql.select('permission', { where: { id: accessCodes } });
        // 把权限插入casbin表，实现真正的访问控制
        for (const item of permissions) {
          await this.app.enforcer.addPermissionForUser(roleId, item.path, item.action);
        }
      }

      ctx.body = {
        code: 0,
        msg: '分配成功',
      };
    }
  }

  // 新增角色
  async addRole() {
    const { ctx } = this;
    const { name } = ctx.request.body;
    const result = await ctx.app.mysql.insert('role', { name });
    console.log(result);
    if (result.affectedRows === 1) {
      const record = await ctx.app.mysql.get('role', { id: result.insertId });
      ctx.body = {
        code: 0,
        data: record,
      };
    }
  }

  // 更新角色
  async updateRole() {
    const { ctx } = this;
    const { record } = ctx.request.body;
    const result = await ctx.app.mysql.update('role', { ...record });
    if (result.affectedRows === 1) {
      ctx.body = {
        code: 0,
      };
    }
  }

  // 根据id逻辑删除角色
  async deleteRoleId() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    const result = await ctx.app.mysql.update('role', { id, status: 1 });
    if (result.affectedRows === 1) {
      ctx.body = {
        code: 0,
      };
    }
  }
}

module.exports = RoleController;
