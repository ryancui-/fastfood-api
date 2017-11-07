const Base = require('./base.js');

module.exports = class extends Base {
  indexAction() {
    return this.display();
  }

  async testAction() {
    const users = await this.model('user').select();

    return this.success(users);
  }

  async loginAction() {
    if (this.post('name') === think.config('admin.name') &&
      this.post('password') === think.config('admin.password')) {
      const userInfo = {
        id: 12,
        nickname: 'ggg'
      };
      const jwtToken = await this.session('data', userInfo);

      return this.success({
        token: jwtToken,
        userInfo: userInfo
      });
    } else {
      return this.fail('cannot login');
    }
  }
};
