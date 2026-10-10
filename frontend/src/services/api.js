const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });

  if (response.status === 204) {
    if (!response.ok) throw new Error("Error en la petición");
    return null;
  }

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.error || "Error en la petición");
  }
  return body.data;
}
