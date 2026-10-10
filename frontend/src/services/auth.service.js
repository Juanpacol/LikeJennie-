import { apiRequest } from "./api";

export function login(email, password) {
  return apiRequest("/admin/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
