import { apiRequest } from "./api";

export function getDashboardSummary(token) {
  return apiRequest("/admin/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  });
}
