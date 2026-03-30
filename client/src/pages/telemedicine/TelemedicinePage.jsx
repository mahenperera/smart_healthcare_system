// // import { useEffect, useMemo, useRef, useState } from "react";
// // import { useParams, useSearchParams } from "react-router-dom";
// // import AgoraRTC from "agora-rtc-sdk-ng";
// // import { telemedicineApi } from "../../api/telemedicine-api";

// // export default function TelemedicinePage() {
// //   const { appointmentId } = useParams();
// //   const [sp] = useSearchParams();

// //   const role = (sp.get("role") || "PATIENT").toUpperCase(); // PATIENT / DOCTOR
// //   const userId = sp.get("userId") || "p1";

// //   const [loading, setLoading] = useState(true);
// //   const [err, setErr] = useState("");
// //   const [session, setSession] = useState(null);
// //   const [joinInfo, setJoinInfo] = useState(null);

// //   const client = useMemo(
// //     () => AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }),
// //     [],
// //   );
// //   const localVideoRef = useRef(null);
// //   const remoteVideoRef = useRef(null);

// //   const localTracksRef = useRef({ audio: null, video: null });

// //   useEffect(() => {
// //     let mounted = true;

// //     async function boot() {
// //       try {
// //         setLoading(true);
// //         setErr("");

// //         // 1) Create or get session for this ONLINE appointment
// //         const s = await telemedicineApi.createSession(appointmentId);
// //         if (!mounted) return;
// //         setSession(s);

// //         // 2) Get join token
// //         const j = await telemedicineApi.join(s.id, { userId, role });
// //         if (!mounted) return;
// //         setJoinInfo(j);

// //         // 3) Join Agora channel
// //         await client.join(j.appId, j.channelName, j.token, j.uidOrAccount);

// //         // local tracks
// //         const [mic, cam] = await Promise.all([
// //           AgoraRTC.createMicrophoneAudioTrack(),
// //           AgoraRTC.createCameraVideoTrack(),
// //         ]);
// //         localTracksRef.current = { audio: mic, video: cam };
// //         cam.play(localVideoRef.current);

// //         await client.publish([mic, cam]);

// //         // remote handling
// //         client.on("user-published", async (user, mediaType) => {
// //           await client.subscribe(user, mediaType);
// //           if (mediaType === "video") {
// //             user.videoTrack?.play(remoteVideoRef.current);
// //           }
// //           if (mediaType === "audio") {
// //             user.audioTrack?.play();
// //           }
// //         });

// //         client.on("user-unpublished", () => {
// //           // optional: clear UI
// //         });
// //       } catch (e) {
// //         setErr(e?.message || "Failed to start call");
// //       } finally {
// //         setLoading(false);
// //       }
// //     }

// //     boot();

// //     return () => {
// //       mounted = false;
// //       (async () => {
// //         try {
// //           const { audio, video } = localTracksRef.current;
// //           audio?.stop();
// //           audio?.close();
// //           video?.stop();
// //           video?.close();
// //           await client.leave();
// //         } catch {}
// //       })();
// //     };
// //   }, [appointmentId, role, userId, client]);

// //   return (
// //     <div className="mx-auto max-w-6xl px-6 py-8">
// //       <div className="mb-6">
// //         <h1 className="text-2xl font-semibold">Telemedicine</h1>
// //         <p className="text-slate-600 text-sm">
// //           Appointment: <span className="font-mono">{appointmentId}</span>
// //           {session ? (
// //             <>
// //               {" "}
// //               · Channel:{" "}
// //               <span className="font-mono">{session.channelName}</span>
// //             </>
// //           ) : null}
// //         </p>
// //       </div>

// //       {err ? (
// //         <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
// //           {err}
// //         </div>
// //       ) : null}

// //       <div className="grid gap-6 lg:grid-cols-2">
// //         <div className="rounded-2xl border bg-white p-4">
// //           <div className="mb-2 text-sm font-semibold">You ({role})</div>
// //           <div
// //             ref={localVideoRef}
// //             className="aspect-video w-full overflow-hidden rounded-xl bg-slate-100"
// //           />
// //         </div>

// //         <div className="rounded-2xl border bg-white p-4">
// //           <div className="mb-2 text-sm font-semibold">Remote</div>
// //           <div
// //             ref={remoteVideoRef}
// //             className="aspect-video w-full overflow-hidden rounded-xl bg-slate-100"
// //           />
// //         </div>
// //       </div>

// //       {loading ? (
// //         <div className="mt-4 text-sm text-slate-600">Starting call…</div>
// //       ) : null}

// //       {joinInfo ? (
// //         <div className="mt-4 text-xs text-slate-500">
// //           Token TTL: {joinInfo.expiresInSeconds}s · account:{" "}
// //           {joinInfo.uidOrAccount}
// //         </div>
// //       ) : null}
// //     </div>
// //   );
// // }

// import { useEffect, useMemo, useRef, useState } from "react";
// import { useParams, useSearchParams } from "react-router-dom";
// import AgoraRTC from "agora-rtc-sdk-ng";
// import { telemedicineApi } from "../../api/telemedicine-api";

// function getSessionId(session) {
//   return session?.id || session?.sessionId || session?._id || "";
// }

// export default function TelemedicinePage() {
//   const { appointmentId } = useParams();
//   const [sp] = useSearchParams();

//   const role = (sp.get("role") || "PATIENT").toUpperCase();
//   const userId = sp.get("userId") || "p1";

//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");
//   const [session, setSession] = useState(null);
//   const [joinInfo, setJoinInfo] = useState(null);

//   const client = useMemo(
//     () => AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }),
//     [],
//   );

//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const localTracksRef = useRef({ audio: null, video: null });

//   useEffect(() => {
//     let active = true;

//     const handleUserPublished = async (user, mediaType) => {
//       try {
//         await client.subscribe(user, mediaType);

//         if (mediaType === "video" && remoteVideoRef.current) {
//           user.videoTrack?.play(remoteVideoRef.current);
//         }

//         if (mediaType === "audio") {
//           user.audioTrack?.play();
//         }
//       } catch (e) {
//         console.error("Failed to subscribe remote user:", e);
//       }
//     };

//     const handleUserUnpublished = () => {
//       if (remoteVideoRef.current) {
//         remoteVideoRef.current.innerHTML = "";
//       }
//     };

//     async function boot() {
//       try {
//         setLoading(true);
//         setErr("");

//         if (!appointmentId) {
//           throw new Error("Missing appointment ID.");
//         }

//         // 1) Create or get telemedicine session for this appointment
//         const s = await telemedicineApi.createSession(appointmentId);
//         if (!active) return;

//         setSession(s);

//         const sessionId = getSessionId(s);
//         if (!sessionId) {
//           throw new Error(
//             "Session ID was not returned from telemedicine service.",
//           );
//         }

//         // 2) Get Agora join info
//         const j = await telemedicineApi.join(sessionId, { userId, role });
//         if (!active) return;

//         setJoinInfo(j);

//         if (
//           !j?.appId ||
//           !j?.channelName ||
//           typeof j?.uidOrAccount === "undefined"
//         ) {
//           throw new Error(
//             "Invalid join data received from telemedicine service.",
//           );
//         }

//         // 3) Listen for remote users before joining/publishing
//         client.on("user-published", handleUserPublished);
//         client.on("user-unpublished", handleUserUnpublished);

//         // 4) Join Agora channel
//         await client.join(
//           j.appId,
//           j.channelName,
//           j.token ?? null,
//           j.uidOrAccount,
//         );

//         // 5) Create local mic/camera tracks
//         const [micTrack, camTrack] = await Promise.all([
//           AgoraRTC.createMicrophoneAudioTrack(),
//           AgoraRTC.createCameraVideoTrack(),
//         ]);

//         localTracksRef.current = {
//           audio: micTrack,
//           video: camTrack,
//         };

//         if (localVideoRef.current) {
//           camTrack.play(localVideoRef.current);
//         }

//         // 6) Publish local tracks
//         await client.publish([micTrack, camTrack]);
//       } catch (e) {
//         console.error(e);
//         if (active) {
//           setErr(e?.message || "Failed to start telemedicine call.");
//         }
//       } finally {
//         if (active) {
//           setLoading(false);
//         }
//       }
//     }

//     boot();

//     return () => {
//       active = false;

//       client.off("user-published", handleUserPublished);
//       client.off("user-unpublished", handleUserUnpublished);

//       (async () => {
//         try {
//           const { audio, video } = localTracksRef.current;

//           if (audio) {
//             audio.stop();
//             audio.close();
//           }

//           if (video) {
//             video.stop();
//             video.close();
//           }

//           localTracksRef.current = { audio: null, video: null };

//           await client.leave();
//         } catch (e) {
//           console.error("Cleanup failed:", e);
//         }
//       })();
//     };
//   }, [appointmentId, role, userId, client]);

//   return (
//     <div className="mx-auto max-w-6xl px-6 py-8">
//       <div className="mb-6">
//         <h1 className="text-2xl font-semibold">Telemedicine</h1>

//         <p className="text-sm text-slate-600">
//           Appointment: <span className="font-mono">{appointmentId}</span>
//           {session?.channelName ? (
//             <>
//               {" "}
//               · Channel:{" "}
//               <span className="font-mono">{session.channelName}</span>
//             </>
//           ) : null}
//         </p>
//       </div>

//       {err ? (
//         <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
//           {err}
//         </div>
//       ) : null}

//       <div className="grid gap-6 lg:grid-cols-2">
//         <div className="rounded-2xl border bg-white p-4">
//           <div className="mb-2 text-sm font-semibold">You ({role})</div>
//           <div
//             ref={localVideoRef}
//             className="aspect-video w-full overflow-hidden rounded-xl bg-slate-100"
//           />
//         </div>

//         <div className="rounded-2xl border bg-white p-4">
//           <div className="mb-2 text-sm font-semibold">Remote</div>
//           <div
//             ref={remoteVideoRef}
//             className="aspect-video w-full overflow-hidden rounded-xl bg-slate-100"
//           />
//         </div>
//       </div>

//       {loading ? (
//         <div className="mt-4 text-sm text-slate-600">Starting call…</div>
//       ) : null}

//       {joinInfo ? (
//         <div className="mt-4 text-xs text-slate-500">
//           Token TTL: {joinInfo.expiresInSeconds ?? "-"}s · account:{" "}
//           {String(joinInfo.uidOrAccount ?? "-")}
//         </div>
//       ) : null}
//     </div>
//   );
// }

// client/src/pages/telemedicine/TelemedicinePage.jsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import AgoraRTC from "agora-rtc-sdk-ng";
import { telemedicineApi } from "../../api/telemedicine-api";

function getSessionId(session) {
  return session?.id || session?.sessionId || session?._id || "";
}

export default function TelemedicinePage() {
  const { appointmentId } = useParams();
  const [sp] = useSearchParams();

  const role = (sp.get("role") || "PATIENT").toUpperCase();
  const userId = sp.get("userId") || "p1";
  const videoOff = sp.get("video") === "off";

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [warning, setWarning] = useState("");
  const [session, setSession] = useState(null);
  const [joinInfo, setJoinInfo] = useState(null);

  const [joined, setJoined] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(false);

  const client = useMemo(
    () => AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }),
    [],
  );

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const localTracksRef = useRef({
    audio: null,
    video: null,
  });

  const mountedRef = useRef(true);

  const stopAndCloseTrack = async (track) => {
    try {
      if (!track) return;
      track.stop();
      track.close();
    } catch {}
  };

  const publishCurrentTracks = useCallback(async () => {
    const tracks = [];
    if (localTracksRef.current.audio) tracks.push(localTracksRef.current.audio);
    if (localTracksRef.current.video) tracks.push(localTracksRef.current.video);

    if (tracks.length > 0) {
      await client.publish(tracks);
    }
  }, [client]);

  const startCamera = useCallback(async () => {
    try {
      setWarning("");

      if (localTracksRef.current.video) {
        return;
      }

      const camTrack = await AgoraRTC.createCameraVideoTrack();
      localTracksRef.current.video = camTrack;

      if (localVideoRef.current) {
        camTrack.play(localVideoRef.current);
      }

      await client.publish([camTrack]);
      setCameraOn(true);
    } catch (e) {
      console.error("Camera start failed:", e);
      setCameraOn(false);
      setWarning(
        "Camera could not be started. You are connected without video. This usually happens when the webcam is busy in another app/tab.",
      );
    }
  }, [client]);

  const stopCamera = useCallback(async () => {
    try {
      const videoTrack = localTracksRef.current.video;
      if (!videoTrack) return;

      await client.unpublish([videoTrack]);
      await stopAndCloseTrack(videoTrack);
      localTracksRef.current.video = null;

      if (localVideoRef.current) {
        localVideoRef.current.innerHTML = "";
      }

      setCameraOn(false);
    } catch (e) {
      console.error("Stop camera failed:", e);
    }
  }, [client]);

  const toggleMic = useCallback(async () => {
    const audioTrack = localTracksRef.current.audio;
    if (!audioTrack) return;

    try {
      const next = !micOn;
      await audioTrack.setEnabled(next);
      setMicOn(next);
    } catch (e) {
      console.error("Mic toggle failed:", e);
    }
  }, [micOn]);

  const toggleCamera = useCallback(async () => {
    if (cameraOn) {
      await stopCamera();
    } else {
      await startCamera();
    }
  }, [cameraOn, startCamera, stopCamera]);

  useEffect(() => {
    mountedRef.current = true;

    const handleUserPublished = async (user, mediaType) => {
      try {
        await client.subscribe(user, mediaType);

        if (mediaType === "video" && remoteVideoRef.current) {
          user.videoTrack?.play(remoteVideoRef.current);
        }

        if (mediaType === "audio") {
          user.audioTrack?.play();
        }
      } catch (e) {
        console.error("Remote subscribe failed:", e);
      }
    };

    const handleUserUnpublished = (user, mediaType) => {
      if (mediaType === "video" && remoteVideoRef.current) {
        remoteVideoRef.current.innerHTML = "";
      }
    };

    async function boot() {
      try {
        setLoading(true);
        setErr("");
        setWarning("");
        setJoined(false);
        setCameraOn(false);
        setMicOn(false);

        if (!appointmentId) {
          throw new Error("Missing appointment ID.");
        }

        // 1) create/get session
        const s = await telemedicineApi.createSession(appointmentId);
        if (!mountedRef.current) return;
        setSession(s);

        const sessionId = getSessionId(s);
        if (!sessionId) {
          throw new Error("Telemedicine session ID was not returned.");
        }

        // 2) get join token/details
        const j = await telemedicineApi.join(sessionId, { userId, role });
        if (!mountedRef.current) return;
        setJoinInfo(j);

        if (
          !j?.appId ||
          !j?.channelName ||
          typeof j?.uidOrAccount === "undefined"
        ) {
          throw new Error("Invalid join response from telemedicine service.");
        }

        // 3) bind remote listeners
        client.on("user-published", handleUserPublished);
        client.on("user-unpublished", handleUserUnpublished);

        // 4) join agora
        await client.join(
          j.appId,
          j.channelName,
          j.token ?? null,
          j.uidOrAccount,
        );
        if (!mountedRef.current) return;

        setJoined(true);

        // 5) mic first
        try {
          const micTrack = await AgoraRTC.createMicrophoneAudioTrack();
          localTracksRef.current.audio = micTrack;
          setMicOn(true);
        } catch (e) {
          console.error("Microphone start failed:", e);
          setWarning(
            "Microphone could not be started. You may still join as listen-only.",
          );
        }

        // 6) publish mic if available
        await publishCurrentTracks();

        // 7) camera optional
        if (!videoOff) {
          try {
            const camTrack = await AgoraRTC.createCameraVideoTrack();
            localTracksRef.current.video = camTrack;

            if (localVideoRef.current) {
              camTrack.play(localVideoRef.current);
            }

            await client.publish([camTrack]);
            setCameraOn(true);
          } catch (e) {
            console.error("Camera start failed:", e);
            setCameraOn(false);
            setWarning(
              "Camera could not be started. You are connected without video. This usually happens when the webcam is busy in another app/tab.",
            );
          }
        } else {
          setWarning(
            "Video is disabled for this tab. You joined in audio-only mode.",
          );
        }
      } catch (e) {
        console.error(e);
        if (mountedRef.current) {
          setErr(e?.message || "Failed to start telemedicine call.");
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    }

    boot();

    return () => {
      mountedRef.current = false;

      client.off("user-published", handleUserPublished);
      client.off("user-unpublished", handleUserUnpublished);

      (async () => {
        try {
          const audioTrack = localTracksRef.current.audio;
          const videoTrack = localTracksRef.current.video;

          if (audioTrack) {
            try {
              await client.unpublish([audioTrack]);
            } catch {}
          }

          if (videoTrack) {
            try {
              await client.unpublish([videoTrack]);
            } catch {}
          }

          await stopAndCloseTrack(audioTrack);
          await stopAndCloseTrack(videoTrack);

          localTracksRef.current = { audio: null, video: null };

          await client.leave();
        } catch (e) {
          console.error("Cleanup failed:", e);
        }
      })();
    };
  }, [appointmentId, role, userId, videoOff, client, publishCurrentTracks]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Telemedicine</h1>

        <p className="text-sm text-slate-600">
          Appointment: <span className="font-mono">{appointmentId}</span>
          {session?.channelName ? (
            <>
              {" "}
              · Channel:{" "}
              <span className="font-mono">{session.channelName}</span>
            </>
          ) : null}
        </p>
      </div>

      {err ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {err}
        </div>
      ) : null}

      {warning ? (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
          {warning}
        </div>
      ) : null}

      <div className="mb-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={toggleMic}
          disabled={!joined || !localTracksRef.current.audio}
          className="rounded-xl border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
        >
          {micOn ? "Mute mic" : "Unmute mic"}
        </button>

        <button
          type="button"
          onClick={toggleCamera}
          disabled={!joined}
          className="rounded-xl border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
        >
          {cameraOn ? "Turn camera off" : "Retry / turn camera on"}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-white p-4">
          <div className="mb-2 text-sm font-semibold">
            You ({role}) {cameraOn ? "• video on" : "• video off"}
          </div>

          <div
            ref={localVideoRef}
            className="aspect-video w-full overflow-hidden rounded-xl bg-slate-100"
          >
            {!cameraOn ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                Camera not active
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-4">
          <div className="mb-2 text-sm font-semibold">Remote</div>

          <div
            ref={remoteVideoRef}
            className="aspect-video w-full overflow-hidden rounded-xl bg-slate-100"
          >
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              Waiting for other participant...
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="mt-4 text-sm text-slate-600">Starting call…</div>
      ) : null}

      {joinInfo ? (
        <div className="mt-4 text-xs text-slate-500">
          Token TTL: {joinInfo.expiresInSeconds ?? "-"}s · account:{" "}
          {String(joinInfo.uidOrAccount ?? "-")}
        </div>
      ) : null}
    </div>
  );
}
