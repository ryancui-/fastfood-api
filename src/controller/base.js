module.exports = class extends think.Controller {
  async __before() {
    this.header('Access-Control-Allow-Origin', '*');
    this.header('Access-Control-Allow-Headers', 'content-type, authorization');

    if (this.method === 'OPTIONS') {
      this.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT,PATCH,OPTIONS');
      this.header('Access-Control-Allow-Credentials', 'true');
      return this.success();
    }

    // 对 auth 的 API 不检查 JWT token
    if (this.ctx.controller === 'auth') {
      return true;
    }

    try {
      const userId = await this.session('data');
      if (!userId) {
        this.fail(500, '未登录');
        return false;
      }
    } catch (err) {
      this.fail(500, '未登录');
      return false;
    }
  }
};
