const Base = require('./base.js');
const qiniu = require('qiniu');

module.exports = class extends Base {
  constructor(ctx) {
    super(ctx);
    this.userFields = ['id', 'nickname', 'username', 'gender',
      'avatar_url', 'is_admin', 'register_time', 'last_login_time'];
  }

  // 根据已登录的 token 获取用户数据
  async indexAction() {
    const userId = await this.session('data');
    const newUser = await this.model('user')
      .field(this.userFields)
      .where({
        id: userId
      })
      .find();

    return this.success(newUser);
  }

  // 修改用户数据
  async modifyAction() {
    const params = this.post();
    const userId = await this.session('data');

    // TODO 参数校验

    await this.model('user').where({id: userId}).update(params);

    return this.success();
  }

  // 上传头像
  async uploadAvatarAction() {
    // 这里的 key 需要和 form 表单里的 name 值保持一致
    const userId = await this.session('data');
    const file = think.extend({}, this.file('avatar'));

    const filepath = file.path;
    think.logger.info(filepath);

    const qconfig = this.config('qiniu');
    const mac = new qiniu.auth.digest.Mac(qconfig.access_key, qconfig.secret_key);
    const options = {
      scope: qconfig.bucket
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);

    const uploadToken = putPolicy.uploadToken(mac);
    const config = new qiniu.conf.Config();
    config.zone = qiniu.zone.Zone_z2;

    var formUploader = new qiniu.form_up.FormUploader(config);
    var putExtra = new qiniu.form_up.PutExtra();
    const key = 'fastfood_' + think.uuid().replace(/-/g, '');

    const uploadSuccess = await new Promise((resolve, reject) => {
      formUploader.putFile(uploadToken, key, filepath, putExtra,
        function (respErr, respBody, respInfo) {
          if (respErr) {
            resolve(false);
          }

          if (respInfo.statusCode === 200) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
    });

    if (uploadSuccess) {
      const avatarUrl = '//' + qconfig.domain + '/' + key + '-small';
      await this.model('user').where({id: userId}).update({avatar_url: avatarUrl});
      return this.success();
    } else {
      return this.fail('上传失败了');
    }
  }
};
