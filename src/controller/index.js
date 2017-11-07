const Base = require('./base.js');

module.exports = class extends Base {
  indexAction() {
    return this.display();
  }

  async testAction() {
    const users = await this.model('user').select();

    return this.success(users);
  }
};
