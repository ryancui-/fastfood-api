module.exports = class extends think.Model {
  get relation() {
    return {
      product_options: {
        type: think.Model.HAS_MANY
      }
    };
  }
};
