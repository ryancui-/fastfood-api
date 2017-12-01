module.exports = class extends think.Model {
  get relation() {
    return {
      user: {
        name: 'user',
        type: think.Model.BELONG_TO,
        key: 'user_id',
        field: 'id, avatar_url, nickname, username, gender'
      }
    };
  }
};
