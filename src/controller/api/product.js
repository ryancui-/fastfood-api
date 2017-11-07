const Base = require('../base.js');

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
};
