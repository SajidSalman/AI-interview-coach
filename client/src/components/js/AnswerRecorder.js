import React, { useState, useEffect, useRef } from "react";
import "../css/answerRecorder.css";

const AnswerRecorder = ({
  questionId,
  questionText,
  onAnswerChange,
  defaultMode = "text",
}) => {
  const [mode, setMode] = useState(defaultMode); // text, voice, video
  const [text, setText] = useState("");
  const [mediaBlob, setMediaBlob] = useState(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [recording, setRecording] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  // Notify parent about changes
  useEffect(() => {
    onAnswerChange({ questionId, text, mediaBlob, mode });
  }, [text, mediaBlob, mode, questionId, onAnswerChange]);

  const handleTextChange = (e) => setText(e.target.value);

  const startRecording = async () => {
    try {
      chunksRef.current = [];
      const constraints =
        mode === "voice" ? { audio: true } : { audio: true, video: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const type = mode === "voice" ? "audio/webm" : "video/webm";
        const blob = new Blob(chunksRef.current, { type });
        const url = URL.createObjectURL(blob);
        setMediaBlob(blob);
        setMediaUrl(url);
        setRecording(false);

        // Stop all tracks to release camera/mic
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        chunksRef.current = [];
      };

      recorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Error accessing media devices:", err);
      alert("Check microphone/camera permissions to start recording.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) mediaRecorderRef.current.stop();
  };

  const handleReset = () => {
    setText("");
    setMediaBlob(null);
    setMediaUrl("");
    setMode(defaultMode);
    setRecording(false);
    chunksRef.current = [];
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  return (
    <div className="answer-recorder">
      <div className="question-text">{questionText}</div>

      {/* Mode Buttons */}
      <div className="mode-buttons">
        <button
          className={mode === "text" ? "active" : ""}
          onClick={() => setMode("text")}
        >
          Text
        </button>
        <button
          className={mode === "voice" ? "active" : ""}
          onClick={() => setMode("voice")}
        >
          Voice
        </button>
        <button
          className={mode === "video" ? "active" : ""}
          onClick={() => setMode("video")}
        >
          Video
        </button>
      </div>

      {/* Text Mode */}
      {mode === "text" && (
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Type your answer..."
          rows={3}
          className="text-area"
        />
      )}

      {/* Voice / Video Mode */}
      {(mode === "voice" || mode === "video") && (
        <div className="media-controls">
          <button
            onClick={recording ? stopRecording : startRecording}
            className={recording ? "stop-btn" : "start-btn"}
          >
            {recording
              ? "Stop Recording"
              : mode === "voice"
              ? "Start Voice Recording"
              : "Start Video Recording"}
          </button>

          {mediaUrl && (
            <>
              {mode === "voice" && (
                <audio src={mediaUrl} controls className="audio-player" />
              )}
              {mode === "video" && (
                <video
                  src={mediaUrl}
                  controls
                  className="video-player"
                  width="300"
                />
              )}
            </>
          )}
        </div>
      )}

      {/* Reset Button */}
      <button className="reset-btn" onClick={handleReset}>
        Reset
      </button>
    </div>
  );
};

export default AnswerRecorder;
