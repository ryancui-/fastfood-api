const Base = require('./base.js');
const Utils = require('../util/utils');

module.exports = class extends Base {
  // 根据条件获取菜单列表（分页）
  async listAction() {
    const category = this.post('category');
    const page = this.post('page') || 1;
    const rows = 15;
    const today = new Date();

    // 判断上下中旬
    let partOfMonth;
    const day = today.getDate();
    if (day <= 10) {
      partOfMonth = 1;
    } else if (day <= 20) {
      partOfMonth = 2;
    } else {
      partOfMonth = 3;
    }

    // 判断星期几
    const dayOfWeek = today.getDay() || 7;

    const query = {
      valid: 1,
      part_of_month: ['IN', [partOfMonth, 0]],
      day_of_week: ['IN', [dayOfWeek, 0]]
    };
    if (category) {
      query.category = category;
    }

    const products = await this.model('product')
      .where(query)
      .page(page, rows)
      .select();

    return this.success(products);
  }

  // 新增菜单信息
  async createAction() {
    const params = this.post();

    params.create_time = Utils.formatDateTime();
    params.update_time = Utils.formatDateTime();

    const id = await this.model('product').add(params);

    return this.success(id);
  }

  // 修改菜单信息
  async editAction() {
    const params = this.post();

    const oldProduct = await this.model('product').where({
      id: params.id
    }).find();

    if (think.isEmpty(oldProduct)) {
      return this.fail('找不到记录');
    }

    const newProduct = think.extend({}, oldProduct, params);
    newProduct.update_time = Utils.formatDateTime();

    await this.model('product').where({
      id: params.id
    }).update(newProduct);

    return this.success();
  }

  // 更新菜单状态
  async statusAction() {
    const valid = this.post('valid');
    const id = this.post('id');

    if (!id) {
      return this.fail('没有提供ID');
    }

    await this.model('product').where({id}).update({valid});

    return this.success();
  }
};
