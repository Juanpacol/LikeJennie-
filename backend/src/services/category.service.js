const categoryRepo = require("../repositories/category.repository");

function listCategories() {
  return categoryRepo.findAll();
}

module.exports = { listCategories };
