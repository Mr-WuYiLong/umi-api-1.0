'use strict';
/**
 * 管理员
 */
const Controller = require('egg').Controller;
class AdminController extends Controller {

  // 根据名字查询管理员的信息
  async getAdmin() {
    const { ctx } = this;
    const username = ctx.query.username;
    const result = await ctx.app.mysql.get('admin', { account: username });
    if (!result) {
      ctx.body = {
        code: 404,
        msg: '数据不存在',
      };
    }
    ctx.body = {
      code: 0,
      data: result,
    };
  }

  // 获得管理员的分页
  async getAdminList() {
    const { ctx } = this;
    const current = Number(ctx.query.current);
    const pageSize = Number(ctx.query.pageSize);
    const result = await ctx.app.mysql.select('admin', { where: { status: 0 } });
    const sql = 'select * from admin  where status = 0 ';
    const offset = (current - 1) * pageSize;
    const data = await ctx.app.mysql.query(`${sql} order by id desc limit ${offset},${pageSize} `);
    if (result && result.length > 0) {
      const adminList = {
        data,
        pagination: {
          pageSize,
          current,
          total: result.length,
        },
      };
      ctx.body = {
        code: 0,
        data: adminList,
      };
    }
  }

  // 新增管理员
  async addAdmin() {
    const { ctx } = this;
    const data = ctx.request.body;
    const result = await ctx.app.mysql.insert('admin', { ...data });
    if (result.affectedRows === 1) {
      const record = await ctx.app.mysql.get('admin', { id: result.insertId });
      ctx.body = {
        code: 0,
        data: record,
      };
    }
  }

  // 更新管理员
  async updateAdmin() {
    const { ctx } = this;
    const { record } = ctx.request.body;
    const result = await ctx.app.mysql.update('admin', { ...record });
    if (result.affectedRows === 1) {
      ctx.body = {
        code: 0,
      };
    }
  }

  // 删除管理员
  async deleteAdminById() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    const result = await ctx.app.mysql.delete('admin', { id });
    if (result.affectedRows === 1) {
      ctx.body = {
        code: 0,
      };
    }
  }
}

module.exports = AdminController;
