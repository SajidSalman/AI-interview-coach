import React, { useState, useRef, useEffect } from "react";

const AnswerRecorder = ({
  questionId,
  questionText,
  defaultMode = "text",
  onAnswerChange,
}) => {
  const [mode, setMode] = useState(defaultMode); // text | voice | video
  const [answer, setAnswer] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recording, setRecording] = useState(false);
  const [mediaUrl, setMediaUrl] = useState(null);

  const videoRef = useRef(null);

  // Start recording
  const startRecording = async () => {
    try {
      const constraints =
        mode === "voice" ? { audio: true } : { audio: true, video: true };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (mode === "video" && videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, {
          type: mode === "voice" ? "audio/webm" : "video/webm",
        });
        const url = URL.createObjectURL(blob);
        setMediaUrl(url);

        // Stop all media tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
      alert("Could not access microphone/camera.");
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  // Notify parent whenever answer changes
  useEffect(() => {
    if (onAnswerChange) {
      onAnswerChange({
        questionId,
        text: answer,
        mediaUrl,
        mode,
      });
    }
  }, [answer, mediaUrl, mode, questionId, onAnswerChange]); // ✅ fixed dependencies

  return (
    <div className="border p-4 rounded mb-6 shadow">
      <h3 className="font-semibold mb-2">{questionText}</h3>

      {/* Mode Selector */}
      <div className="flex gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded ${
            mode === "text" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setMode("text")}
        >
          Text
        </button>
        <button
          className={`px-3 py-1 rounded ${
            mode === "voice" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setMode("voice")}
        >
          Voice
        </button>
        <button
          className={`px-3 py-1 rounded ${
            mode === "video" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setMode("video")}
        >
          Video
        </button>
      </div>

      {/* Text Mode */}
      {mode === "text" && (
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full border p-2 rounded"
          rows={3}
          placeholder="Type your answer..."
        />
      )}

      {/* Voice Mode */}
      {mode === "voice" && (
        <div>
          {!mediaUrl ? (
            !recording ? (
              <button
                onClick={startRecording}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                🎤 Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                ⏹ Stop Recording
              </button>
            )
          ) : (
            <div className="mt-2">
              <audio controls src={mediaUrl}></audio>
              <button
                className="ml-2 bg-gray-500 text-white px-2 py-1 rounded"
                onClick={() => setMediaUrl(null)}
              >
                🔄 Re-record
              </button>
            </div>
          )}
        </div>
      )}

      {/* Video Mode */}
      {mode === "video" && (
        <div>
          {!mediaUrl ? (
            <div>
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full max-h-60 border rounded mb-2"
              ></video>
              {!recording ? (
                <button
                  onClick={startRecording}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  🎥 Start Recording
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  ⏹ Stop Recording
                </button>
              )}
            </div>
          ) : (
            <div className="mt-2">
              <video controls src={mediaUrl} className="w-full max-h-60"></video>
              <button
                className="mt-2 bg-gray-500 text-white px-2 py-1 rounded"
                onClick={() => setMediaUrl(null)}
              >
                🔄 Re-record
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnswerRecorder;
