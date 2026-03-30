// const BASE = import.meta.env.VITE_TELEMEDICINE_BASE_URL;

// export const telemedicineApi = {
//   createSession: async (appointmentId) => {
//     const res = await fetch(`${BASE}/api/telemedicine/sessions`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ appointmentId }),
//     });
//     if (!res.ok) throw new Error(await res.text());
//     return res.json();
//   },

//   joinSession: async (sessionId, userId, role) => {
//     const res = await fetch(
//       `${BASE}/api/telemedicine/sessions/${sessionId}/join`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId, role }),
//       },
//     );
//     if (!res.ok) throw new Error(await res.text());
//     return res.json();
//   },

//   getSession: async (sessionId) => {
//     const res = await fetch(`${BASE}/api/telemedicine/sessions/${sessionId}`);
//     if (!res.ok) throw new Error(await res.text());
//     return res.json();
//   },
// };

// client/src/api/telemedicine-api.js
const BASE = import.meta.env.VITE_TELEMEDICINE_BASE_URL;

async function readJson(res) {
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
}

export const telemedicineApi = {
  createSession: async (appointmentId) => {
    const res = await fetch(`${BASE}/api/telemedicine/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointmentId }),
    });

    return readJson(res);
  },

  // this matches your TelemedicinePage usage:
  // telemedicineApi.join(sessionId, { userId, role })
  join: async (sessionId, body) => {
    const res = await fetch(
      `${BASE}/api/telemedicine/sessions/${sessionId}/join`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );

    return readJson(res);
  },

  // keep this too, in case some other file uses the old name
  joinSession: async (sessionId, userId, role) => {
    const res = await fetch(
      `${BASE}/api/telemedicine/sessions/${sessionId}/join`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      },
    );

    return readJson(res);
  },

  getSession: async (sessionId) => {
    const res = await fetch(`${BASE}/api/telemedicine/sessions/${sessionId}`);
    return readJson(res);
  },
};
