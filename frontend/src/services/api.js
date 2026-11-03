const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// Error de la API: `code` es el identificador estable (EMAIL_REQUIRED, CART_EMPTY...) que el frontend
// traduce con tError(); `message` queda como texto por defecto en inglés.
export class ApiError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

export async function apiRequest(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
  } catch {
    // Sin conexión o API caída: el navegador solo lanza un TypeError genérico.
    throw new ApiError("Could not reach the server", "NETWORK");
  }

  if (response.status === 204) {
    if (!response.ok) throw new ApiError("Request failed", "REQUEST_FAILED");
    return null;
  }

  let body;
  try {
    body = await response.json();
  } catch {
    throw new ApiError("Request failed", "REQUEST_FAILED");
  }
  if (!response.ok) {
    throw new ApiError(
      body.error || "Request failed",
      body.code ?? "REQUEST_FAILED",
    );
  }
  return body.data;
}
