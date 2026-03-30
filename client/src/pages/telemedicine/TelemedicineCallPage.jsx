import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import AgoraRTC from "agora-rtc-sdk-ng";
import { telemedicineApi } from "../../api/telemedicine-api";

export default function TelemedicineCallPage() {
  const { sessionId } = useParams();

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  const [userId, setUserId] = useState("p1"); // temp until auth is ready
  const [role, setRole] = useState("PATIENT"); // PATIENT | DOCTOR
  const [joining, setJoining] = useState(false);

  const [joinInfo, setJoinInfo] = useState(null);
  const [error, setError] = useState("");

  // Agora client must be stable
  const client = useMemo(
    () => AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }),
    [],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const s = await telemedicineApi.getSession(sessionId);
        if (!cancelled) setSession(s);
      } catch (e) {
        if (!cancelled) setError(e.message || String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  async function handleJoin() {
    setError("");
    setJoining(true);
    try {
      const info = await telemedicineApi.joinSession(
        sessionId,
        userId.trim(),
        role,
      );
      setJoinInfo(info);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setJoining(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Telemedicine Call
          </h1>
          <p className="text-sm text-slate-600">Session ID: {sessionId}</p>
        </div>

        {loading ? (
          <div className="rounded-xl border bg-white p-5">Loading session…</div>
        ) : error ? (
          <div className="rounded-xl border bg-white p-5 text-red-600">
            {error}
          </div>
        ) : (
          <div className="grid gap-6">
            <div className="rounded-2xl border bg-white p-5">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <div className="text-sm font-semibold text-slate-800">
                    Channel
                  </div>
                  <div className="text-slate-600">{session?.channelName}</div>
                  <div className="mt-2 text-xs text-slate-500">
                    Doctor: {session?.doctorId} • Patient: {session?.patientId}{" "}
                    • Status: {session?.status}
                  </div>
                </div>

                <div className="grid gap-2">
                  <label className="text-xs font-semibold text-slate-700">
                    User ID
                  </label>
                  <input
                    className="rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="p1 / d1"
                  />

                  <label className="text-xs font-semibold text-slate-700">
                    Role
                  </label>
                  <select
                    className="rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="PATIENT">PATIENT</option>
                    <option value="DOCTOR">DOCTOR</option>
                  </select>

                  <button
                    onClick={handleJoin}
                    disabled={joining || !userId.trim()}
                    className="mt-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {joining ? "Joining…" : "Join call"}
                  </button>

                  <div className="text-[11px] text-slate-500">
                    Tip: open another browser/incognito and join as the other
                    role to test.
                  </div>
                </div>
              </div>
            </div>

            {joinInfo ? (
              <VideoRoom client={client} joinInfo={joinInfo} />
            ) : (
              <div className="rounded-2xl border bg-white p-6 text-sm text-slate-500">
                Join to start video.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function VideoRoom({ client, joinInfo }) {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    let localTracks = [];
    let mounted = true;

    async function start() {
      // join(appid, channel, token, uid) supports uid as string or number :contentReference[oaicite:1]{index=1}
      await client.join(
        joinInfo.appId,
        joinInfo.channelName,
        joinInfo.token,
        joinInfo.uidOrAccount,
      );

      const [micTrack, camTrack] =
        await AgoraRTC.createMicrophoneAndCameraTracks();
      localTracks = [micTrack, camTrack];

      camTrack.play("local-player");
      await client.publish(localTracks);

      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "video") user.videoTrack.play("remote-player");
        if (mediaType === "audio") user.audioTrack.play();
      });

      client.on("user-unpublished", () => {
        const el = document.getElementById("remote-player");
        if (el) el.innerHTML = "";
      });

      if (mounted) setJoined(true);
    }

    start().catch(console.error);

    return () => {
      mounted = false;
      (async () => {
        try {
          localTracks.forEach((t) => t.stop());
          localTracks.forEach((t) => t.close());
          await client.leave();
        } catch {}
      })();
    };
  }, [client, joinInfo]);

  async function toggleMic() {
    const tracks = client.localTracks || []; // not official, but ok for simple UI
    const audio = tracks.find((t) => t.trackMediaType === "audio");
    if (!audio) return;
    await audio.setEnabled(!micOn);
    setMicOn(!micOn);
  }

  async function toggleCam() {
    const tracks = client.localTracks || [];
    const video = tracks.find((t) => t.trackMediaType === "video");
    if (!video) return;
    await video.setEnabled(!camOn);
    setCamOn(!camOn);
  }

  return (
    <div className="rounded-2xl border bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-800">
          {joined ? "In call" : "Connecting…"}
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleMic}
            className="rounded-xl border px-3 py-2 text-sm hover:bg-slate-50"
          >
            {micOn ? "Mute" : "Unmute"}
          </button>
          <button
            onClick={toggleCam}
            className="rounded-xl border px-3 py-2 text-sm hover:bg-slate-50"
          >
            {camOn ? "Camera off" : "Camera on"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-black/90 p-2">
          <div className="mb-2 text-xs font-semibold text-white/80">You</div>
          <div
            id="local-player"
            className="aspect-video w-full overflow-hidden rounded-lg"
          />
        </div>

        <div className="rounded-xl border bg-black/90 p-2">
          <div className="mb-2 text-xs font-semibold text-white/80">
            Other side
          </div>
          <div
            id="remote-player"
            className="aspect-video w-full overflow-hidden rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
