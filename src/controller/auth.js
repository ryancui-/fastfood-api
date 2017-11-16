const Base = require('./base.js');
const Utils = require('../util/utils');

module.exports = class extends Base {
  // 检查用户名是否合法
  async checkUsernameAction() {
    const username = this.post('username');

    // 不允许使用 admin
    if (username.indexOf('admin') !== -1) {
      return this.fail(12000, '不能带有 admin');
    }

    const user = await this.model('user').where({
      username
    }).find();

    if (!think.isEmpty(user)) {
      return this.fail(12001, '用户名已存在');
    }

    return this.success();
  }

  // 注册账号
  async registerAction() {
    const username = this.post('username');
    const password = this.post('password');
    const inviteCode = this.post('inviteCode');

    if (inviteCode !== think.config('inviteCode')) {
      return this.fail('邀请码错误');
    }

    this.model('user').add({
      username,
      password,
      register_time: Utils.formatDateTime(),
      last_login_time: Utils.formatDateTime()
    });

    return this.success();
  }

  // 传统登录获取 jwt token
  async loginAction() {
    let user = await this.model('user')
      .field('password')
      .where({
        username: this.post('username')
      })
      .find();

    if (think.isEmpty(user)) {
      return this.fail('找不到该用户');
    }
    if (user.password !== this.post('password')) {
      return this.fail('密码错误');
    }

    user = await this.model('user')
      .field(['id', 'nickname', 'username', 'gender', 'avatar_url'])
      .where({
        username: this.post('username')
      })
      .find();

    // 更新最后登录时间
    await this.model('user').where({id: user.id}).update({
      last_login_time: Utils.formatDateTime()
    });

    const jwtToken = await this.session('data', user);
    return this.success({
      token: jwtToken,
      userInfo: user
    });
  }
};
