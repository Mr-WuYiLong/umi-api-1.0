'use strict';

/**
 * redis服务
 */
const Service = require('egg').Service;
class RedisService extends Service {
  // 设置
  async set(key, value, seconds) {
    const { redis } = this.app;
    value = JSON.stringify(value);
    if (!seconds) {
      await redis.set(key, value);
    } else {
      // 设置有效时间
      // EX seconds − 设置指定的到期时间(以秒为单位) 。
      // PX milliseconds - 设置指定的到期时间(以毫秒为单位) 。
      // NX - 仅在键不存在时设置键。
      // XX - 只有在键已存在时才设置。
      await redis.set(key, value, 'EX', seconds);
    }
  }
  // 获取
  async get(key) {
    const { redis } = this.app;
    let data = await redis.get(key);
    if (!data) return;
    data = JSON.parse(data);
    return data;
  }

  // 删除
  async del(key) {
    const { redis } = this.app;
    redis.del(key);
    return;
  }
  // 清空redis
  async flushall() {
    const { redis } = this.app;
    redis.flushall();
    return;
  }
}
module.exports = RedisService;
