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

  // Only attach body if NOT GET
  if (method !== "GET" && body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(BASE_URL + url, options);
  const data = await res.json();

  // Handle expired token / auth errors
  // if (res.status === 401) {
  //   localStorage.removeItem("token");
  //   window.location.href = "/login";
  // }
   if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;

 // return res.json();
};

export default api;
