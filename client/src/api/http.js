// const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ""; // keep empty to use Vite proxy

// async function request(method, path, body) {
//   const res = await fetch(`${API_BASE}${path}`, {
//     method,
//     headers: { "Content-Type": "application/json" },
//     body: body ? JSON.stringify(body) : undefined,
//   });

//   if (!res.ok) {
//     let msg = `Request failed (${res.status})`;
//     try {
//       const data = await res.json();
//       msg = data?.message || data?.error || msg;
//     } catch {}
//     throw new Error(msg);
//   }

//   if (res.status === 204) return null;
//   return res.json();
// }

// export const http = {
//   get: (p) => request("GET", p),
//   post: (p, b) => request("POST", p, b),
//   patch: (p, b) => request("PATCH", p, b),
// };

// client/src/api/http.js

// import { clearAuthSession, getToken } from "../utils/auth-storage";

// const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

// async function request(method, path, body) {
//   const token = getToken();

//   const headers = {
//     "Content-Type": "application/json",
//   };

//   if (token) {
//     headers.Authorization = `Bearer ${token}`;
//   }

//   const res = await fetch(`${API_BASE}${path}`, {
//     method,
//     headers,
//     body: body ? JSON.stringify(body) : undefined,
//   });

//   if (!res.ok) {
//     let msg = `Request failed (${res.status})`;

//     try {
//       const data = await res.json();
//       msg = data?.message || data?.error || msg;
//     } catch {}

//     if (res.status === 401) {
//       clearAuthSession();
//     }

//     throw new Error(msg);
//   }

//   if (res.status === 204) return null;
//   return res.json();
// }

// export const http = {
//   get: (p) => request("GET", p),
//   post: (p, b) => request("POST", p, b),
//   put: (p, b) => request("PUT", p, b),
//   patch: (p, b) => request("PATCH", p, b),
//   delete: (p) => request("DELETE", p),
// };

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

async function request(method, path, body) {
  const token = localStorage.getItem("shc_token") || "";

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      msg = data?.message || data?.error || msg;
    } catch {}
    throw new Error(msg);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const http = {
  get: (p) => request("GET", p),
  post: (p, b) => request("POST", p, b),
  put: (p, b) => request("PUT", p, b),
  patch: (p, b) => request("PATCH", p, b),
  delete: (p) => request("DELETE", p),
};
