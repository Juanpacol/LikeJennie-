const productRepo = require("../repositories/product.repository");
const stockService = require("./stock.service");
const { NotFoundError } = require("../utils/errors");

function withStockFlags(product) {
  return {
    ...product,
    variants: product.variants.map((variant) => ({
      ...variant,
      isLowStock: stockService.isLowStock(variant.stock),
      isOutOfStock: stockService.isOutOfStock(variant.stock),
    })),
  };
}

async function getCatalog({ categorySlug } = {}) {
  const products = await productRepo.findMany({ categorySlug, onlyActive: true });
  return products.map(withStockFlags);
}

async function getProductDetail(slug) {
  const product = await productRepo.findBySlug(slug);
  if (!product || !product.isActive) {
    throw new NotFoundError("Producto no encontrado");
  }
  return withStockFlags(product);
}

function listAllProducts() {
  return productRepo.findMany({ onlyActive: false });
}

async function getProductById(id) {
  const product = await productRepo.findById(id);
  if (!product) throw new NotFoundError("Producto no encontrado");
  return product;
}

function createProduct(data) {
  return productRepo.create(data);
}

async function updateProduct(id, data) {
  const existing = await productRepo.findById(id);
  if (!existing) throw new NotFoundError("Producto no encontrado");
  return productRepo.update(id, data);
}

async function deleteProduct(id) {
  const existing = await productRepo.findById(id);
  if (!existing) throw new NotFoundError("Producto no encontrado");
  return productRepo.remove(id);
}

module.exports = {
  getCatalog,
  getProductDetail,
  listAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
