module.exports = class extends think.Model {
  get relation() {
    return {
      user: {
        name: 'composer',
        type: think.Model.BELONG_TO,
        key: 'composer_user_id',
        field: 'id, avatar_url, nickname, username, gender'
      },
      order: {
        name: 'orders',
        type: think.Model.HAS_MANY
      }
    };
  }
};
