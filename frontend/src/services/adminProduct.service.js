import { apiRequest } from "./api";

export function getAllProducts(token) {
  return apiRequest("/admin/products", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getProductById(token, id) {
  return apiRequest(`/admin/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function createProduct(token, data) {
  return apiRequest("/admin/products", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export function updateProduct(token, id, data) {
  return apiRequest(`/admin/products/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export function deleteProduct(token, id) {
  return apiRequest(`/admin/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function updateVariantStock(token, variantId, stock) {
  return apiRequest(`/admin/variants/${variantId}/stock`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ stock }),
  });
}
