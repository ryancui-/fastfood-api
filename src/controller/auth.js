const Base = require('./base.js');
const Utils = require('../util/utils');
const rp = require('request-promise');

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

    if (inviteCode !== think.config('inviteCode')) {
      return this.fail(12002, '邀请码错误');
    }

    this.model('user').add({
      username,
      password,
      register_time: Utils.formatDateTime(),
      last_login_time: Utils.formatDateTime()
    });

    return this.success();
  }

  // 获取绑定的用户信息
  async fetchBindAction() {
    const code = this.post('code');

    // 获取openid
    const options = {
      method: 'GET',
      url: 'https://api.weixin.qq.com/sns/jscode2session',
      qs: {
        grant_type: 'authorization_code',
        js_code: code,
        secret: think.config('weixinMini.secret'),
        appid: think.config('weixinMini.appid')
      }
    };

    let sessionData = await rp(options);
    sessionData = JSON.parse(sessionData);
    if (!sessionData.openid) {
      return this.fail('换取 openid 失败');
    }

    // 检查是否已绑定
    const user = await this.model('user')
      .field(['id', 'nickname', 'username', 'gender', 'avatar_url'])
      .where({
        openid_mini: sessionData.openid
      }).find();

    if (think.isEmpty(user)) {
      // 未绑定
      return this.success({
        openid: sessionData.openid
      });
    } else {
      // 已绑定
      const token = await this.session('data', user);
      return this.success({
        openid: sessionData.openid,
        user,
        token
      });
    }
  }

  // 绑定微信小程序 openid
  async bindAction() {
    const username = this.post('username');
    const password = this.post('password');
    const openid = this.post('openid');
    const userInfo = this.post('userInfo').userInfo;

    let user = await this.model('user')
      .field('password')
      .where({
        username: username
      })
      .find();

    if (think.isEmpty(user)) {
      return this.fail('找不到该用户');
    }
    if (user.password !== password) {
      return this.fail('密码错误');
    }

    await this.model('user').where({id: user.id})
      .update({
        openid_mini: openid,
        avatar_url: userInfo.avatarUrl || '',
        nickname: userInfo.nickname,
        gender: userInfo.gender
      });

    user = await this.model('user')
      .field(['id', 'nickname', 'username', 'gender', 'avatar_url'])
      .where({
        openid_mini: openid
      })
      .find();

    const token = await this.session('data', user);

    return this.success({
      token, user
    });
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
