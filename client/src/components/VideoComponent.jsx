import React, { useEffect, useRef, useState } from "react";

// Default export a React component named VideoUploadComponent
// Props:
//  - wsUrl: string (WebSocket server URL)
//  - timesliceMs: integer (how frequently to create chunks, default 1000ms)
//  - mimeType: preferred MIME type for MediaRecorder (default tries webm/vp8)
//  - autoStartPreview: boolean (start camera preview on mount)

export default function VideoComponent({
  wsUrl = "ws://localhost:8080/stream",
  timesliceMs = 1000,
  mimeType = "video/webm;codecs=vp8,opus",
  autoStartPreview = false,
  onError,
  onChunkSent,
}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const wsRef = useRef(null);
  const sequenceRef = useRef(0);
  const bufferedChunksRef = useRef([]);
  const reconnectTimerRef = useRef(null);

  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [permissionState, setPermissionState] = useState("idle");
  const [supportedMime, setSupportedMime] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [recordedSeconds, setRecordedSeconds] = useState(0);

  useEffect(() => {
    // choose a supported mime type
    if (MediaRecorder && MediaRecorder.isTypeSupported) {
      if (MediaRecorder.isTypeSupported(mimeType)) setSupportedMime(mimeType);
      else if (MediaRecorder.isTypeSupported("video/webm")) setSupportedMime("video/webm");
      else if (MediaRecorder.isTypeSupported("video/mp4")) setSupportedMime("video/mp4");
      else setSupportedMime("");
    }
  }, [mimeType]);

  useEffect(() => {
    if (autoStartPreview) startPreview();
    return () => {
      stopRecording();
      stopPreview();
      closeWebSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Camera / microphone preview ---
  async function startPreview() {
    try {
      setPermissionState("requesting");
      const constraints = { video: true, audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setIsPreviewing(true);
      setPermissionState("granted");
      setStatusMessage("Preview running");
    } catch (err) {
      console.error("getUserMedia error:", err);
      setPermissionState("denied");
      setStatusMessage(`Permission/error: ${err.message}`);
      if (onError) onError(err);
    }
  }

  function stopPreview() {
    try {
      const stream = streamRef.current;
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) videoRef.current.srcObject = null;
      setIsPreviewing(false);
      setStatusMessage("");
    } catch (err) {
      console.warn("stopPreview error", err);
    }
  }

  // --- WebSocket with simple reconnect and buffering ---
  function openWebSocket() {
    if (!wsUrl) return;
    closeWebSocket();
    setStatusMessage(`Connecting to ${wsUrl}...`);
    const ws = new WebSocket(wsUrl);
    ws.binaryType = "arraybuffer"; // we will send ArrayBuffer for chunks

    ws.onopen = () => {
      setStatusMessage("WebSocket connected");
      wsRef.current = ws;
      // send any buffered chunks
      flushBufferedChunks();
    };

    ws.onmessage = (ev) => {
        console.log("ev",ev)
      // optional: handle server messages
      // console.log('ws onmessage', ev.data);
    };

    ws.onclose = (ev) => {
      wsRef.current = null;
      setStatusMessage(`WebSocket closed (code=${ev.code})`);
      // try reconnect with backoff
      scheduleReconnect();
    };

    ws.onerror = (err) => {
      console.error("WebSocket error", err);
      setStatusMessage("WebSocket error");
      // socket will usually fire close after error
    };
  }

  function closeWebSocket() {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    const ws = wsRef.current;
    if (ws) {
      try {
        ws.close(1000, "closing");
      } catch (e) {
        console.log(e)
        // ignore
      }
      wsRef.current = null;
    }
  }

  function scheduleReconnect(delayMs = 2000) {
    if (reconnectTimerRef.current) return; // already scheduled
    reconnectTimerRef.current = setTimeout(() => {
      reconnectTimerRef.current = null;
      if (!wsRef.current) openWebSocket();
    }, delayMs);
  }

  function flushBufferedChunks() {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    const buffered = bufferedChunksRef.current;
    while (buffered.length) {
      const item = buffered.shift();
      try {
        ws.send(item.data);
        if (onChunkSent) onChunkSent(item);
      } catch (err) {
        console.error("Failed to send buffered chunk, re-buffering", err);
        buffered.unshift(item);
        break;
      }
    }
  }

  // --- Recording (MediaRecorder) ---
  function startRecording() {
    const stream = streamRef.current;
    if (!stream) {
      setStatusMessage("No media stream available. Start preview first.");
      return;
    }
    if (isRecording) return;

    openWebSocket();

    let options = {};
    if (supportedMime) options.mimeType = supportedMime;

    let recorder;
    try {
      recorder = new MediaRecorder(stream, options);
    } catch (err) {
      console.error("MediaRecorder creation failed", err);
      setStatusMessage(`MediaRecorder error: ${err.message}`);
      if (onError) onError(err);
      return;
    }

    mediaRecorderRef.current = recorder;
    sequenceRef.current = 0;
    bufferedChunksRef.current = [];
    setRecordedSeconds(0);

    recorder.ondataavailable = async (event) => {
      if (!event.data || event.data.size === 0) return;
      sequenceRef.current += 1;
      const seq = sequenceRef.current;
      const timestamp = Date.now();

      // Convert blob to arrayBuffer for smaller overhead
      const arrayBuffer = await event.data.arrayBuffer();

      // Create a small header object as JSON; server should parse it
      const header = JSON.stringify({
        seq,
        timestamp,
        size: arrayBuffer.byteLength,
        mimeType: supportedMime || event.data.type,
      });

      // We'll send header length (4 bytes) + header UTF-8 bytes + raw chunk bytes
      // so server can separate header and payload reliably.
      const headerBytes = new TextEncoder().encode(header);
      const headerLen = headerBytes.byteLength;

      const packet = new ArrayBuffer(4 + headerLen + arrayBuffer.byteLength);
      const view = new DataView(packet);
      // write header length as unsigned 32-bit big-endian
      view.setUint32(0, headerLen, false);
      // copy header bytes
      const uint8 = new Uint8Array(packet, 4, headerLen);
      uint8.set(headerBytes);
      // copy payload
      const payload = new Uint8Array(packet, 4 + headerLen);
      payload.set(new Uint8Array(arrayBuffer));

      // send via WebSocket, or buffer if not open
      const ws = wsRef.current;
      const sendItem = { seq, timestamp, data: packet };
      if (ws && ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(packet);
          if (onChunkSent) onChunkSent(sendItem);
        } catch (err) {
          console.error("Send failed, buffering chunk", err);
          bufferedChunksRef.current.push(sendItem);
        }
      } else {
        bufferedChunksRef.current.push(sendItem);
      }
    };

    recorder.onstart = () => {
      setIsRecording(true);
      setStatusMessage("Recording started");
      // update recorded time
      startRecordedTimer();
    };

    recorder.onstop = () => {
      setIsRecording(false);
      setStatusMessage("Recording stopped");
      stopRecordedTimer();
    };

    recorder.onerror = (ev) => {
      console.error("MediaRecorder error", ev);
      setStatusMessage(`Recorder error: ${ev.error?.message || ev.type}`);
      if (onError) onError(ev.error || new Error(ev.type));
    };

    try {
      recorder.start(timesliceMs); // ask for frequent chunks
    } catch (err) {
      console.error("recorder.start failed", err);
      setStatusMessage(`Recorder start failed: ${err.message}`);
      if (onError) onError(err);
    }
  }

  function stopRecording() {
    try {
      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state !== "inactive") {
        recorder.stop();
      }
      mediaRecorderRef.current = null;
    } catch (err) {
      console.warn("stopRecording error", err);
    }
  }

  // --- recorded time counter ---
  const recordedTimerRef = useRef(null);
  function startRecordedTimer() {
    recordedTimerRef.current = setInterval(() => {
      setRecordedSeconds((s) => s + 1);
    }, 1000);
  }
  function stopRecordedTimer() {
    if (recordedTimerRef.current) {
      clearInterval(recordedTimerRef.current);
      recordedTimerRef.current = null;
    }
  }

  // --- UI handlers ---
  function handleStartPreviewClick() {
    startPreview();
  }
  function handleStopPreviewClick() {
    stopPreview();
  }
  function handleStartRecordingClick() {
    startRecording();
  }
  function handleStopRecordingClick() {
    stopRecording();
  }
  function handleConnectWsClick() {
    openWebSocket();
  }
  function handleCloseWsClick() {
    closeWebSocket();
  }

  return (
  <div
    style={{
      maxWidth: 720,
      margin: "0 auto",
      fontFamily: "Inter, Roboto, sans-serif",
      textAlign: "center",
      paddingBottom: "4%"
    }}
  >
    <h3>VideoUploadComponent</h3>
    <p style={{ color: "#555" }}>
      Access camera & microphone, record chunks and stream them to a WebSocket server.
    </p>

    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: "100%",
          background: "black",
          borderRadius: 8,
        }}
      />
    </div>

    <div style={{ marginTop: 8, display: "flex", justifyContent: "center", gap: 8 }}>
      {!isPreviewing ? (
        <button onClick={handleStartPreviewClick}>Start Preview</button>
      ) : (
        <button onClick={handleStopPreviewClick}>Stop Preview</button>
      )}

      {!isRecording ? (
        <button onClick={handleStartRecordingClick} disabled={!isPreviewing}>
          Start Recording
        </button>
      ) : (
        <button onClick={handleStopRecordingClick}>Stop Recording</button>
      )}

      <button onClick={handleConnectWsClick}>Connect WS</button>
      <button onClick={handleCloseWsClick}>Close WS</button>
    </div>

    {/* --- Moved status section below video --- */}
    <div
      style={{
        width: "100%",
        marginTop: 16,
        padding: 12,
        border: "1px solid #100606ff",
        borderRadius: 8,
        textAlign: "left",
        color: "#222", // ✅ Ensures text is visible (dark gray)
        backgroundColor: "#fafafa", // optional: adds subtle background contrast
      }}
    >
      <strong>Status</strong>
      <div style={{ marginTop: 8, color: "#333" }}>{statusMessage}</div>

      <hr />
      <div>
        <div>
          <strong>Preview:</strong> {isPreviewing ? "running" : "stopped"}
        </div>
        <div>
          <strong>Recording:</strong> {isRecording ? `yes (${recordedSeconds}s)` : "no"}
        </div>
        <div>
          <strong>Permission:</strong> {permissionState}
        </div>
        <div>
          <strong>Supported MIME:</strong> {supportedMime || "(unknown)"}
        </div>
        <div>
          <strong>Buffered chunks:</strong> {bufferedChunksRef.current.length}
        </div>
      </div>

      <hr />
      <small style={{ color: "#666" }}>
        Notes: The component sends binary packets to the WebSocket server. Each packet contains a 4-byte
        header-length (big-endian), a JSON header (seq, timestamp, size, mimeType), then the raw media chunk bytes.
        Implement the matching parsing on the server.
      </small>
    </div>
  </div>
);
}
