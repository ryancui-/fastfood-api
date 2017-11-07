module.exports = class extends think.Controller {
  async __before() {
    if (this.ctx.action === 'login') {
      return true;
    }

    try {
      const userInfo = await this.session('data');
      if (userInfo) {
        think.user = userInfo;
      } else {
        this.fail(500, '未登录');
        return false;
      }
    } catch (err) {
      this.fail(500, '未登录');
      return false;
    }
  }
};
