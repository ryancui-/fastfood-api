const Base = require('../base.js');
const Utils = require('../../util/utils');

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
      create_time: Utils.formatDateTime()
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

    // 获取订单组的创建人
    const composer = await this.model('user')
      .field(['nickname', 'avatar_url', 'gender'])
      .where({
        id: group.composer_user_id
      }).find();

    group.composer = composer;

    // 获取订单组下的所有订单
    const orderList = await this.model('order').where({
      group_id: groupId
    }).select();

    group.orders = orderList;

    return this.success(group);
  }
};
