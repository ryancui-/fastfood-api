const Base = require('./base.js');
const Utils = require('../util/utils');

module.exports = class extends Base {
  // 新增一个订单组
  async addAction() {
    const dueTime = this.post('dueTime');
    const groupName = this.post('groupName');

    think.logger.info(dueTime);

    if (!dueTime || !groupName) {
      return this.fail('没有提供到期时间或订单组名称');
    }

    const user = await this.session('data');
    const groupId = await this.model('group').add({
      composer_user_id: user.id,
      due_time: dueTime,
      name: groupName,
      create_time: Utils.formatDateTime(),
      update_time: Utils.formatDateTime()
    });

    return this.success(groupId);
  }

  // 获取某个订单组信息
  async getAction() {
    const groupId = this.get('id');

    const group = await this.model('group').where({
      id: groupId
    }).find();

    if (think.isEmpty(group)) {
      return this.fail('找不到订单组');
    }

    return this.success(group);
  }

  // 获取所有订单组
  async listAction() {
    // 按创建时间倒序排列，只列出征集中的团组
    const groupList = await this.model('group')
      .where({
        status: 1
      })
      .order('create_time desc').select();

    return this.success(groupList);
  }

  // 修改订单团状态
  async statusAction() {
    const id = this.post('id');
    const status = this.post('status');

    if (!id || !status) {
      return this.fail('参数错误');
    }

    await this.model('group').where({id}).update({
      status,
      update_time: Utils.formatDateTime()
    });

    return this.success();
  }
};
