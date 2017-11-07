const Base = require('../base.js');
const Utils = require('../../util/utils');
const rp = require('request-promise');
const md5 = require('js-md5');

module.exports = class extends Base {
  // 传统登录获取 jwt token
  async loginAction() {
    const user = await this.model('user')
      .field(['id', 'nickname', 'gender', 'avatar_url'])
      .where({
        nickname: this.post('nickname')
      })
      .find();

    if (!user) {
      return this.fail('找不到该用户');
    }

    if (user.password !== md5(this.post('password'))) {
      return this.fail('密码错误');
    }

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
    let userId = await this.model('user').where({openid: sessionData.openid}).getField('id', true);
    if (think.isEmpty(userId)) {
      // 注册
      userId = await this.model('user').add({
        openid: sessionData.openid,
        avatar_url: userInfo.avatarUrl || '',
        nickname: userInfo.nickName,
        password: md5('111111'),
        gender: userInfo.gender || 1,
        register_time: Utils.formatDateTime(),
        last_login_time: Utils.formatDateTime()
      });
    } else {
      // 更新
      userId = await this.model('user').where({id: userId}).update({
        avatar_url: userInfo.avatarUrl || '',
        nickname: userInfo.nickName,
        gender: userInfo.gender || 1, // 性别 0：未知、1：男、2：女
        last_login_time: Utils.formatDateTime()
      });
    }

    // 查询用户信息
    const newUserInfo = await this.model('user')
      .field(['id', 'nickname', 'gender', 'avatar_url']).where({id: userId}).find();

    const jwtToken = await this.session('data', newUserInfo);

    if (think.isEmpty(newUserInfo) || think.isEmpty(jwtToken)) {
      return this.fail('登录失败');
    }

    return this.success({token: jwtToken, userInfo: newUserInfo});
  }
};
