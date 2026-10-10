import { apiRequest } from "./api";

export function getCatalog(categorySlug) {
  const query = categorySlug ? `?category=${categorySlug}` : "";
  return apiRequest(`/products${query}`);
}

export function getProductBySlug(slug) {
  return apiRequest(`/products/${slug}`);
}
