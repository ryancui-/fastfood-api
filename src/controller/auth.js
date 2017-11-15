const Base = require('./base.js');
const Utils = require('../util/utils');
const rp = require('request-promise');

module.exports = class extends Base {
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

    const jwtToken = await this.session('data', user);
    return this.success({
      token: jwtToken,
      userInfo: user
    });
  }

  // 微信小程序登录
  async loginwxAction() {
    const code = this.post('code');
    const fullUserInfo = this.post('userInfo');
    const userInfo = fullUserInfo.userInfo;

    // 获取openid
    const options = {
      method: 'GET',
      url: 'https://api.weixin.qq.com/sns/jscode2session',
      qs: {
        grant_type: 'authorization_code',
        js_code: code,
        secret: think.config('weixin.secret'),
        appid: think.config('weixin.appid')
      }
    };

    let sessionData = await rp(options);
    sessionData = JSON.parse(sessionData);
    if (!sessionData.openid) {
      return this.fail('登录失败');
    }

    // 根据openid查找用户是否已经注册
    let userId = await this.model('user').where({openid_mini: sessionData.openid}).getField('id', true);
    if (think.isEmpty(userId)) {
      // TODO 检查密码是否正确

      userId = await this.model('user').where({username: this.post('username')}).update({
        openid_mini: sessionData.openid,
        avatar_url: userInfo.avatarUrl || '',
        nickname: userInfo.nickName,
        gender: userInfo.gender || 1,
        last_login_time: Utils.formatDateTime()
      });
    } else {
      // 更新
      userId = await this.model('user').where({id: userId}).update({
        avatar_url: userInfo.avatarUrl || '',
        nickname: userInfo.nickName,
        gender: userInfo.gender || 1,
        last_login_time: Utils.formatDateTime()
      });
    }

    // 查询用户信息
    const newUserInfo = await this.model('user')
      .field(['id', 'nickname', 'username', 'gender', 'avatar_url']).where({id: userId}).find();

    const jwtToken = await this.session('data', newUserInfo);

    if (think.isEmpty(newUserInfo) || think.isEmpty(jwtToken)) {
      return this.fail('登录失败');
    }

    return this.success({token: jwtToken, userInfo: newUserInfo});
  }
};
