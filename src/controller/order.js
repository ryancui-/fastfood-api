const Base = require('./base.js');
const Utils = require('../util/utils');

module.exports = class extends Base {
  // 新增订单并添加到订单组中
  async createAction() {
    const userId = await this.session('data');
    const groupId = this.post('groupId');
    const productId = this.post('productId');

    // 判断订单组 ID 是否合法
    if (!groupId) {
      return this.fail('缺少订单组');
    }
    const group = await this.model('group').where({
      id: groupId
    }).find();
    if (think.isEmpty(group)) {
      return this.fail('找不到订单组');
    }

    const order = {
      user_id: userId,
      group_id: groupId,
      remark: this.post('remark') || '',
      create_time: Utils.formatDateTime(),
      update_time: Utils.formatDateTime()
    };

    // 找到对应的产品信息
    if (!productId) {
      order.product_name = this.post('productName');
      order.product_category = '自定义';
      order.price = this.post('price');
    } else {
      const product = await this.model('product').where({
        id: productId
      }).find();

      if (think.isEmpty(product)) {
        return this.fail('找不到该产品');
      }

      order.product_id = productId;
      order.product_name = product.name;
      order.product_category = product.category;
      order.price = product.price;
    }

    order.quantity = Math.floor(this.post('quantity')) || 1;
    order.total_price = order.quantity * order.price;

    // 新增一个订单
    const orderId = await this.model('order').add(order);

    return this.success(orderId);
  }

  // 删除订单
  async removeAction() {
    const id = this.post('id');
    if (!id) {
      return this.fail('没有订单ID');
    }

    await this.model('order').where({id}).delete();

    return this.success();
  }
};
