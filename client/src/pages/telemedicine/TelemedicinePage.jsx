// // client/src/pages/telemedicine/TelemedicinePage.jsx
// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
//   const videoOff = sp.get("video") === "off";

//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");
//   const [warning, setWarning] = useState("");
//   const [session, setSession] = useState(null);
//   const [joinInfo, setJoinInfo] = useState(null);

//   const [joined, setJoined] = useState(false);
//   const [cameraOn, setCameraOn] = useState(false);
//   const [micOn, setMicOn] = useState(false);

//   const client = useMemo(
//     () => AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }),
//     [],
//   );

//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);

//   const localTracksRef = useRef({
//     audio: null,
//     video: null,
//   });

//   const mountedRef = useRef(true);

//   const stopAndCloseTrack = async (track) => {
//     try {
//       if (!track) return;
//       track.stop();
//       track.close();
//     } catch {}
//   };

//   const publishCurrentTracks = useCallback(async () => {
//     const tracks = [];
//     if (localTracksRef.current.audio) tracks.push(localTracksRef.current.audio);
//     if (localTracksRef.current.video) tracks.push(localTracksRef.current.video);

//     if (tracks.length > 0) {
//       await client.publish(tracks);
//     }
//   }, [client]);

//   const startCamera = useCallback(async () => {
//     try {
//       setWarning("");

//       if (localTracksRef.current.video) {
//         return;
//       }

//       const camTrack = await AgoraRTC.createCameraVideoTrack();
//       localTracksRef.current.video = camTrack;

//       if (localVideoRef.current) {
//         camTrack.play(localVideoRef.current);
//       }

//       await client.publish([camTrack]);
//       setCameraOn(true);
//     } catch (e) {
//       console.error("Camera start failed:", e);
//       setCameraOn(false);
//       setWarning(
//         "Camera could not be started. You are connected without video. This usually happens when the webcam is busy in another app/tab.",
//       );
//     }
//   }, [client]);

//   const stopCamera = useCallback(async () => {
//     try {
//       const videoTrack = localTracksRef.current.video;
//       if (!videoTrack) return;

//       await client.unpublish([videoTrack]);
//       await stopAndCloseTrack(videoTrack);
//       localTracksRef.current.video = null;

//       if (localVideoRef.current) {
//         localVideoRef.current.innerHTML = "";
//       }

//       setCameraOn(false);
//     } catch (e) {
//       console.error("Stop camera failed:", e);
//     }
//   }, [client]);

//   const toggleMic = useCallback(async () => {
//     const audioTrack = localTracksRef.current.audio;
//     if (!audioTrack) return;

//     try {
//       const next = !micOn;
//       await audioTrack.setEnabled(next);
//       setMicOn(next);
//     } catch (e) {
//       console.error("Mic toggle failed:", e);
//     }
//   }, [micOn]);

//   const toggleCamera = useCallback(async () => {
//     if (cameraOn) {
//       await stopCamera();
//     } else {
//       await startCamera();
//     }
//   }, [cameraOn, startCamera, stopCamera]);

//   useEffect(() => {
//     mountedRef.current = true;

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
//         console.error("Remote subscribe failed:", e);
//       }
//     };

//     const handleUserUnpublished = (user, mediaType) => {
//       if (mediaType === "video" && remoteVideoRef.current) {
//         remoteVideoRef.current.innerHTML = "";
//       }
//     };

//     async function boot() {
//       try {
//         setLoading(true);
//         setErr("");
//         setWarning("");
//         setJoined(false);
//         setCameraOn(false);
//         setMicOn(false);

//         if (!appointmentId) {
//           throw new Error("Missing appointment ID.");
//         }

//         // 1) create/get session
//         const s = await telemedicineApi.createSession(appointmentId);
//         if (!mountedRef.current) return;
//         setSession(s);

//         const sessionId = getSessionId(s);
//         if (!sessionId) {
//           throw new Error("Telemedicine session ID was not returned.");
//         }

//         // 2) get join token/details
//         const j = await telemedicineApi.join(sessionId, { userId, role });
//         if (!mountedRef.current) return;
//         setJoinInfo(j);

//         if (
//           !j?.appId ||
//           !j?.channelName ||
//           typeof j?.uidOrAccount === "undefined"
//         ) {
//           throw new Error("Invalid join response from telemedicine service.");
//         }

//         // 3) bind remote listeners
//         client.on("user-published", handleUserPublished);
//         client.on("user-unpublished", handleUserUnpublished);

//         // 4) join agora
//         await client.join(
//           j.appId,
//           j.channelName,
//           j.token ?? null,
//           j.uidOrAccount,
//         );
//         if (!mountedRef.current) return;

//         setJoined(true);

//         // 5) mic first
//         try {
//           const micTrack = await AgoraRTC.createMicrophoneAudioTrack();
//           localTracksRef.current.audio = micTrack;
//           setMicOn(true);
//         } catch (e) {
//           console.error("Microphone start failed:", e);
//           setWarning(
//             "Microphone could not be started. You may still join as listen-only.",
//           );
//         }

//         // 6) publish mic if available
//         await publishCurrentTracks();

//         // 7) camera optional
//         if (!videoOff) {
//           try {
//             const camTrack = await AgoraRTC.createCameraVideoTrack();
//             localTracksRef.current.video = camTrack;

//             if (localVideoRef.current) {
//               camTrack.play(localVideoRef.current);
//             }

//             await client.publish([camTrack]);
//             setCameraOn(true);
//           } catch (e) {
//             console.error("Camera start failed:", e);
//             setCameraOn(false);
//             setWarning(
//               "Camera could not be started. You are connected without video. This usually happens when the webcam is busy in another app/tab.",
//             );
//           }
//         } else {
//           setWarning(
//             "Video is disabled for this tab. You joined in audio-only mode.",
//           );
//         }
//       } catch (e) {
//         console.error(e);
//         if (mountedRef.current) {
//           setErr(e?.message || "Failed to start telemedicine call.");
//         }
//       } finally {
//         if (mountedRef.current) {
//           setLoading(false);
//         }
//       }
//     }

//     boot();

//     return () => {
//       mountedRef.current = false;

//       client.off("user-published", handleUserPublished);
//       client.off("user-unpublished", handleUserUnpublished);

//       (async () => {
//         try {
//           const audioTrack = localTracksRef.current.audio;
//           const videoTrack = localTracksRef.current.video;

//           if (audioTrack) {
//             try {
//               await client.unpublish([audioTrack]);
//             } catch {}
//           }

//           if (videoTrack) {
//             try {
//               await client.unpublish([videoTrack]);
//             } catch {}
//           }

//           await stopAndCloseTrack(audioTrack);
//           await stopAndCloseTrack(videoTrack);

//           localTracksRef.current = { audio: null, video: null };

//           await client.leave();
//         } catch (e) {
//           console.error("Cleanup failed:", e);
//         }
//       })();
//     };
//   }, [appointmentId, role, userId, videoOff, client, publishCurrentTracks]);

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
//         <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
//           {err}
//         </div>
//       ) : null}

//       {warning ? (
//         <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
//           {warning}
//         </div>
//       ) : null}

//       <div className="mb-4 flex flex-wrap gap-3">
//         <button
//           type="button"
//           onClick={toggleMic}
//           disabled={!joined || !localTracksRef.current.audio}
//           className="rounded-xl border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
//         >
//           {micOn ? "Mute mic" : "Unmute mic"}
//         </button>

//         <button
//           type="button"
//           onClick={toggleCamera}
//           disabled={!joined}
//           className="rounded-xl border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
//         >
//           {cameraOn ? "Turn camera off" : "Retry / turn camera on"}
//         </button>
//       </div>

//       <div className="grid gap-6 lg:grid-cols-2">
//         <div className="rounded-2xl border bg-white p-4">
//           <div className="mb-2 text-sm font-semibold">
//             You ({role}) {cameraOn ? "• video on" : "• video off"}
//           </div>

//           <div
//             ref={localVideoRef}
//             className="aspect-video w-full overflow-hidden rounded-xl bg-slate-100"
//           >
//             {!cameraOn ? (
//               <div className="flex h-full items-center justify-center text-sm text-slate-500">
//                 Camera not active
//               </div>
//             ) : null}
//           </div>
//         </div>

//         <div className="rounded-2xl border bg-white p-4">
//           <div className="mb-2 text-sm font-semibold">Remote</div>

//           <div
//             ref={remoteVideoRef}
//             className="aspect-video w-full overflow-hidden rounded-xl bg-slate-100"
//           >
//             <div className="flex h-full items-center justify-center text-sm text-slate-400">
//               Waiting for other participant...
//             </div>
//           </div>
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

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import AgoraRTC from "agora-rtc-sdk-ng";
import { telemedicineApi } from "../../api/telemedicine-api";

function getSessionId(session) {
  return session?.id || session?.sessionId || session?._id || "";
}

async function pickBestCameraId() {
  try {
    const cameras = await AgoraRTC.getCameras();
    if (!Array.isArray(cameras) || cameras.length === 0) return null;

    const nonVirtual = cameras.find(
      (c) => !/obs|virtual/i.test(`${c.label || ""}`),
    );

    return (nonVirtual || cameras[0])?.deviceId || null;
  } catch {
    return null;
  }
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

  const bootedRef = useRef(false);
  const joinedRef = useRef(false);

  useEffect(() => {
    let alive = true;

    async function cleanupTracksAndLeave() {
      try {
        const { audio, video } = localTracksRef.current;

        if (audio) {
          try {
            await client.unpublish([audio]);
          } catch {}
          try {
            audio.stop();
            audio.close();
          } catch {}
        }

        if (video) {
          try {
            await client.unpublish([video]);
          } catch {}
          try {
            video.stop();
            video.close();
          } catch {}
        }

        localTracksRef.current = { audio: null, video: null };

        if (joinedRef.current) {
          try {
            await client.leave();
          } catch {}
          joinedRef.current = false;
        }
      } catch {}
    }

    const handleUserPublished = async (user, mediaType) => {
      try {
        await client.subscribe(user, mediaType);

        if (mediaType === "video" && remoteVideoRef.current) {
          remoteVideoRef.current.innerHTML = "";
          user.videoTrack?.play(remoteVideoRef.current);
        }

        if (mediaType === "audio") {
          user.audioTrack?.play();
        }
      } catch (e) {
        console.error("Subscribe failed:", e);
      }
    };

    const handleUserUnpublished = (_user, mediaType) => {
      if (mediaType === "video" && remoteVideoRef.current) {
        remoteVideoRef.current.innerHTML = "";
      }
    };

    async function boot() {
      if (bootedRef.current) return;
      bootedRef.current = true;

      try {
        setLoading(true);
        setErr("");
        setWarning("");
        setCameraOn(false);
        setMicOn(false);

        if (!appointmentId) {
          throw new Error("Missing appointment ID.");
        }

        const s = await telemedicineApi.createSession(appointmentId);
        if (!alive) return;
        setSession(s);

        const sessionId = getSessionId(s);
        if (!sessionId) {
          throw new Error("Telemedicine session ID was not returned.");
        }

        const j = await telemedicineApi.join(sessionId, { userId, role });
        if (!alive) return;
        setJoinInfo(j);

        if (
          !j?.appId ||
          !j?.channelName ||
          typeof j?.uidOrAccount === "undefined"
        ) {
          throw new Error("Invalid join response from telemedicine service.");
        }

        client.on("user-published", handleUserPublished);
        client.on("user-unpublished", handleUserUnpublished);

        if (!joinedRef.current) {
          await client.join(
            j.appId,
            j.channelName,
            j.token ?? null,
            j.uidOrAccount,
          );
          joinedRef.current = true;
        }

        try {
          const micTrack = await AgoraRTC.createMicrophoneAudioTrack();
          localTracksRef.current.audio = micTrack;
          setMicOn(true);
        } catch (e) {
          console.error("Mic failed:", e);
          setWarning("Microphone could not be started. Joined without mic.");
        }

        if (!videoOff) {
          try {
            const cameraId = await pickBestCameraId();
            const camTrack = await AgoraRTC.createCameraVideoTrack(
              cameraId ? { cameraId } : undefined,
            );

            localTracksRef.current.video = camTrack;
            setCameraOn(true);

            if (localVideoRef.current) {
              localVideoRef.current.innerHTML = "";
              camTrack.play(localVideoRef.current);
            }
          } catch (e) {
            console.error("Camera failed:", e);
            setCameraOn(false);
            setWarning(
              "Camera could not be started. You are connected without video.",
            );
          }
        } else {
          setWarning(
            "Video is disabled for this tab. Joined in audio-only mode.",
          );
        }

        const tracksToPublish = [];
        if (localTracksRef.current.audio)
          tracksToPublish.push(localTracksRef.current.audio);
        if (localTracksRef.current.video)
          tracksToPublish.push(localTracksRef.current.video);

        if (tracksToPublish.length > 0) {
          await client.publish(tracksToPublish);
        }
      } catch (e) {
        console.error(e);
        if (alive) {
          setErr(e?.message || "Failed to start telemedicine call.");
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    boot();

    return () => {
      alive = false;
      client.off("user-published", handleUserPublished);
      client.off("user-unpublished", handleUserUnpublished);
      cleanupTracksAndLeave();
      bootedRef.current = false;
    };
  }, [appointmentId, role, userId, videoOff, client]);

  async function toggleMic() {
    try {
      const track = localTracksRef.current.audio;
      if (!track) return;
      const next = !micOn;
      await track.setEnabled(next);
      setMicOn(next);
    } catch (e) {
      console.error("Mic toggle failed:", e);
    }
  }

  async function retryCamera() {
    try {
      setWarning("");
      if (localTracksRef.current.video) return;

      const cameraId = await pickBestCameraId();
      const camTrack = await AgoraRTC.createCameraVideoTrack(
        cameraId ? { cameraId } : undefined,
      );

      localTracksRef.current.video = camTrack;

      if (localVideoRef.current) {
        localVideoRef.current.innerHTML = "";
        camTrack.play(localVideoRef.current);
      }

      await client.publish([camTrack]);
      setCameraOn(true);
    } catch (e) {
      console.error("Retry camera failed:", e);
      setCameraOn(false);
      setWarning(
        "Camera still could not be started. Try another browser/device.",
      );
    }
  }

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
          disabled={!localTracksRef.current.audio}
          className="rounded-xl border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
        >
          {micOn ? "Mute mic" : "Unmute mic"}
        </button>

        <button
          type="button"
          onClick={retryCamera}
          disabled={cameraOn}
          className="rounded-xl border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
        >
          {cameraOn ? "Camera on" : "Retry / turn camera on"}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-white p-4">
          <div className="mb-2 text-sm font-semibold">
            You ({role}) {cameraOn ? "• video on" : "• video off"}
          </div>
          <div
            ref={localVideoRef}
            className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-sm text-slate-500"
          >
            {!cameraOn ? "Camera not active" : null}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-4">
          <div className="mb-2 text-sm font-semibold">Remote</div>
          <div
            ref={remoteVideoRef}
            className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-sm text-slate-400"
          >
            Waiting for other participant...
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
