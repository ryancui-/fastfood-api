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

    const userId = await this.session('data');
    const groupId = await this.model('group').add({
      composer_user_id: userId,
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

  // 获取征集中的所有订单组，不分页
  async listActiveAction() {
    // 按创建时间倒序排列，只列出征集中的团组
    const groupList = await this.model('group')
      .setRelation('order', false)
      .where({
        status: 1
      })
      .order('create_time desc').select();

    return this.success(groupList);
  }

  // 获取我发起的订单团列表（分页）
  async listOnwerAction() {
    const userId = await this.session('data');
    const page = this.post('page') || 1;
    const rows = this.post('rows') || 15;

    const groupList = await this.model('group')
      .where({
        composer_user_id: userId
      })
      .order('create_time desc').page(page, rows).select();

    const total = await this.model('group')
      .setRelation('order', false)
      .where({
        composer_user_id: userId
      }).count();

    return this.success({
      rows: groupList,
      total
    });
  }

  // 获取我参与的订单团列表（分页）
  async listMemberAction() {
    const userId = await this.session('data');
    const page = this.post('page') || 1;
    const rows = this.post('rows') || 15;

    // 列出我参与的所有订单团
    const groupList = await this.model('group')
      .alias('g')
      .where(`exists
          (
          SELECT 'x'
          FROM fastfood_order o
          WHERE o.group_id = g.id AND o.user_id = ${userId}
          )`)
      .order('create_time desc').page(page, rows).select();

    const total = await this.model('group')
      .alias('g')
      .where(`exists
          (
          SELECT 'x'
          FROM fastfood_order o
          WHERE o.group_id = g.id AND o.user_id = ${userId}
          )`).count();

    return this.success({
      rows: groupList,
      total
    });
  }

  /**
   * 移动端获取两个所有征集中与我参与的订单团
   * @return {Promise.<void>}
   */
  async listMobileAction() {
    const userId = await this.session('data');

    const waitingGroups = await this.model('group')
      .setRelation('order', false)
      .where({
        status: 1
      })
      .order('create_time desc').select();

    const groupList = await this.model('group')
      .alias('g')
      .where(`g.status = 2 and exists
          (
          SELECT 'x'
          FROM fastfood_order o
          WHERE o.group_id = g.id AND o.user_id = ${userId}
          )`)
      .order('create_time desc').limit(2).select();

    return this.success([...waitingGroups, ...groupList]);
  }

  /**
   * 修改订单团状态
   */
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
