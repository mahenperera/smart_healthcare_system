import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import AgoraRTC from "agora-rtc-sdk-ng";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Loader2,
  User,
  MonitorSmartphone,
} from "lucide-react";
import { telemedicineApi } from "../../api/telemedicine-api";

function getSessionId(session) {
  return session?.id || session?.sessionId || session?._id || "";
}

async function pickBestCameraId() {
  try {
    const cameras = await AgoraRTC.getCameras();
    if (!Array.isArray(cameras) || cameras.length === 0) return null;

    const realCamera = cameras.find(
      (cam) => !/obs|virtual/i.test(cam.label || ""),
    );

    return (realCamera || cameras[0])?.deviceId || null;
  } catch {
    return null;
  }
}

export default function TelemedicinePage() {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const [sp] = useSearchParams();

  const role = (sp.get("role") || "PATIENT").toUpperCase();
  const userId = sp.get("userId") || "p1";

  const client = useMemo(
    () => AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }),
    [],
  );

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localTracksRef = useRef({ audio: null, video: null });
  const joinedRef = useRef(false);
  const bootedRef = useRef(false);

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [joinInfo, setJoinInfo] = useState(null);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const [joined, setJoined] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [remoteConnected, setRemoteConnected] = useState(false);

  useEffect(() => {
    let alive = true;

    const handleUserPublished = async (user, mediaType) => {
      try {
        await client.subscribe(user, mediaType);

        if (mediaType === "video" && remoteVideoRef.current) {
          remoteVideoRef.current.innerHTML = "";
          user.videoTrack?.play(remoteVideoRef.current);
          if (alive) setRemoteConnected(true);
        }

        if (mediaType === "audio") {
          user.audioTrack?.play();
          if (alive) setRemoteConnected(true);
        }
      } catch (err) {
        console.error("Subscribe failed:", err);
      }
    };

    const handleUserUnpublished = (_user, mediaType) => {
      if (mediaType === "video" && remoteVideoRef.current) {
        remoteVideoRef.current.innerHTML = "";
      }
      if (alive) {
        setRemoteConnected(false);
      }
    };

    async function cleanup() {
      try {
        const audioTrack = localTracksRef.current.audio;
        const videoTrack = localTracksRef.current.video;

        if (audioTrack) {
          try {
            await client.unpublish([audioTrack]);
          } catch {}
          try {
            audioTrack.stop();
            audioTrack.close();
          } catch {}
        }

        if (videoTrack) {
          try {
            await client.unpublish([videoTrack]);
          } catch {}
          try {
            videoTrack.stop();
            videoTrack.close();
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

    async function boot() {
      if (bootedRef.current) return;
      bootedRef.current = true;

      try {
        setLoading(true);
        setError("");
        setInfo("");

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

        await client.join(
          j.appId,
          j.channelName,
          j.token ?? null,
          j.uidOrAccount,
        );
        if (!alive) return;

        joinedRef.current = true;
        setJoined(true);

        try {
          const micTrack = await AgoraRTC.createMicrophoneAudioTrack();
          localTracksRef.current.audio = micTrack;
          await client.publish([micTrack]);
          if (!alive) return;
          setMicOn(true);
        } catch (err) {
          console.error("Mic init failed:", err);
          if (alive) {
            setInfo("Microphone could not be started.");
          }
        }

        try {
          const cameraId = await pickBestCameraId();
          const camTrack = await AgoraRTC.createCameraVideoTrack(
            cameraId ? { cameraId } : undefined,
          );

          localTracksRef.current.video = camTrack;
          await client.publish([camTrack]);

          if (localVideoRef.current) {
            localVideoRef.current.innerHTML = "";
            camTrack.play(localVideoRef.current);
          }

          if (!alive) return;
          setCameraOn(true);
        } catch (err) {
          console.error("Camera init failed:", err);
          if (alive) {
            setCameraOn(false);
            setInfo("Camera could not be started. You joined without video.");
          }
        }
      } catch (err) {
        console.error(err);
        if (alive) {
          setError(err?.message || "Failed to start telemedicine call.");
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

      cleanup().finally(() => {
        bootedRef.current = false;
      });
    };
  }, [appointmentId, role, userId, client]);

  async function handleToggleMic() {
    try {
      setError("");
      const micTrack = localTracksRef.current.audio;
      if (!micTrack) return;

      const next = !micOn;
      await micTrack.setEnabled(next);
      setMicOn(next);
    } catch (err) {
      console.error("Mic toggle failed:", err);
      setError("Failed to toggle microphone.");
    }
  }

  async function handleToggleCamera() {
    try {
      setError("");
      setInfo("");

      const currentVideoTrack = localTracksRef.current.video;

      if (!currentVideoTrack) {
        const cameraId = await pickBestCameraId();
        const camTrack = await AgoraRTC.createCameraVideoTrack(
          cameraId ? { cameraId } : undefined,
        );

        localTracksRef.current.video = camTrack;
        await client.publish([camTrack]);

        if (localVideoRef.current) {
          localVideoRef.current.innerHTML = "";
          camTrack.play(localVideoRef.current);
        }

        setCameraOn(true);
        return;
      }

      const next = !cameraOn;
      await currentVideoTrack.setEnabled(next);

      if (next && localVideoRef.current) {
        localVideoRef.current.innerHTML = "";
        currentVideoTrack.play(localVideoRef.current);
      }

      setCameraOn(next);
    } catch (err) {
      console.error("Camera toggle failed:", err);
      setError("Failed to toggle camera.");
    }
  }

  async function handleLeaveCall() {
    try {
      const audioTrack = localTracksRef.current.audio;
      const videoTrack = localTracksRef.current.video;

      if (audioTrack) {
        try {
          await client.unpublish([audioTrack]);
        } catch {}
        try {
          audioTrack.stop();
          audioTrack.close();
        } catch {}
      }

      if (videoTrack) {
        try {
          await client.unpublish([videoTrack]);
        } catch {}
        try {
          videoTrack.stop();
          videoTrack.close();
        } catch {}
      }

      localTracksRef.current = { audio: null, video: null };

      try {
        await client.leave();
      } catch {}

      joinedRef.current = false;
      navigate("/appointments");
    } catch (err) {
      console.error("Leave failed:", err);
      navigate("/appointments");
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Telemedicine Call
            </h1>
            <p className="mt-2 text-sm text-slate-600">
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

          <div className="flex flex-wrap gap-2">
            <StatusPill
              label={joined ? "Joined" : "Connecting"}
              tone={joined ? "green" : "slate"}
            />
            <StatusPill
              label={remoteConnected ? "Participant connected" : "Waiting"}
              tone={remoteConnected ? "green" : "slate"}
            />
            <StatusPill label={role} tone="blue" />
          </div>
        </div>

        {error ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {!error && info ? (
          <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {info}
          </div>
        ) : null}

        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <CallButton
              onClick={handleToggleMic}
              disabled={!joined}
              active={micOn}
              activeLabel="Mute"
              inactiveLabel="Unmute"
              activeIcon={<Mic className="h-5 w-5" />}
              inactiveIcon={<MicOff className="h-5 w-5" />}
              activeTone="green"
            />

            <CallButton
              onClick={handleToggleCamera}
              disabled={!joined}
              active={cameraOn}
              activeLabel="Camera Off"
              inactiveLabel="Camera On"
              activeIcon={<Video className="h-5 w-5" />}
              inactiveIcon={<VideoOff className="h-5 w-5" />}
              activeTone="blue"
            />

            <CallButton
              onClick={handleLeaveCall}
              active={false}
              disabled={false}
              activeLabel="Leave"
              inactiveLabel="Leave Call"
              activeIcon={<PhoneOff className="h-5 w-5" />}
              inactiveIcon={<PhoneOff className="h-5 w-5" />}
              activeTone="red"
              forceTone="red"
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <VideoPanel
            title={`You (${role})`}
            status={cameraOn ? "Camera on" : "Camera off"}
            statusTone={cameraOn ? "green" : "slate"}
            fallbackIcon={<User className="h-12 w-12" />}
            fallbackText={cameraOn ? "" : "Your camera is off"}
            videoRef={localVideoRef}
            showFallback={!cameraOn}
          />

          <VideoPanel
            title="Remote Participant"
            status={remoteConnected ? "Connected" : "Waiting"}
            statusTone={remoteConnected ? "green" : "slate"}
            fallbackIcon={<MonitorSmartphone className="h-12 w-12" />}
            fallbackText="Waiting for other participant..."
            videoRef={remoteVideoRef}
            showFallback={!remoteConnected}
          />
        </div>

        <div className="mt-5 flex flex-col gap-2 text-xs text-slate-500">
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Starting call...
            </div>
          ) : null}

          {joinInfo ? (
            <div>
              Token TTL: {joinInfo.expiresInSeconds ?? "-"}s · account:{" "}
              {String(joinInfo.uidOrAccount ?? "-")}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function VideoPanel({
  title,
  status,
  statusTone,
  fallbackIcon,
  fallbackText,
  videoRef,
  showFallback,
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-base font-semibold text-slate-900">{title}</div>
        <StatusPill label={status} tone={statusTone} />
      </div>

      <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-900">
        <div ref={videoRef} className="h-full w-full" />

        {showFallback ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-900 text-slate-300">
            <div className="rounded-full bg-slate-800 p-4">{fallbackIcon}</div>
            <div className="text-sm">{fallbackText}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StatusPill({ label, tone = "slate" }) {
  const tones = {
    green: "bg-emerald-100 text-emerald-700",
    blue: "bg-blue-100 text-blue-700",
    red: "bg-red-100 text-red-700",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${tones[tone]}`}
    >
      {label}
    </span>
  );
}

function CallButton({
  onClick,
  disabled,
  active,
  activeLabel,
  inactiveLabel,
  activeIcon,
  inactiveIcon,
  activeTone = "green",
  forceTone,
}) {
  const toneStyles = {
    green: {
      on: "bg-emerald-600 text-white hover:bg-emerald-700",
      off: "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50",
    },
    blue: {
      on: "bg-blue-600 text-white hover:bg-blue-700",
      off: "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50",
    },
    red: {
      on: "bg-red-600 text-white hover:bg-red-700",
      off: "bg-red-600 text-white hover:bg-red-700",
    },
  };

  const tone = forceTone || activeTone;
  const style = forceTone
    ? toneStyles[tone].off
    : active
      ? toneStyles[tone].on
      : toneStyles[tone].off;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${style}`}
    >
      {active ? activeIcon : inactiveIcon}
      {active ? activeLabel : inactiveLabel}
    </button>
  );
}
