const Base = require('./base.js');

const fs = require('fs');
const path = require('path');

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
    // const user = await this.session('data');
    const file = think.extend({}, this.file('avatar'));

    const filepath = file.path;

    // 文件上传后，需要将文件移动到项目其他地方，否则会在请求结束时删除掉该文件
    const uploadPath = think.RESOURCE_PATH;
    think.mkdir(uploadPath);
    const basename = path.basename(filepath);
    fs.renameSync(filepath, uploadPath + '/' + basename);

    file.path = uploadPath + '/' + basename;

    think.logger.info(file.path);

    return this.success();
  }
};
