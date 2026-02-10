const BASE_URL = "https://taskasana-be.vercel.app/api";

export const api = async (url, method = "GET", body = null) => {
  const token = localStorage.getItem("token");

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : ""
    }
  };

  if (method !== "GET" && body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(BASE_URL + url, options);

  let data;
  try {
    data = await res.json();
  } catch (err) {
    data = {};
  }

  // Handle expired token
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return;
  }

  // Throw error for non-OK responses
  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export default api;
