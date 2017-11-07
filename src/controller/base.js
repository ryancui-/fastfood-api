module.exports = class extends think.Controller {
  async __before() {
    // 对 auth 的 API 不检查 JWT token
    if (this.ctx.controller === 'api/auth') {
      return true;
    }

    try {
      const userInfo = await this.session('data');
      if (!userInfo) {
        this.fail(500, '未登录');
        return false;
      }
    } catch (err) {
      this.fail(500, '未登录');
      return false;
    }
  }
};
