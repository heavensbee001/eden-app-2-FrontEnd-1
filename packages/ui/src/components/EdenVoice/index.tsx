import React, { useRef, useState } from "react";

const EdenVoice: React.FC = () => {
  const [recording, setRecording] = useState<boolean>(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.start();
      setRecording(true);
    } catch (error) {
      console.error("Error starting recording: ", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(mediaRecorder.current.requestData, {
          type: "audio/webm",
        });
        // Transcribe the audio blob using Whisper API
        const transcription = await transcribeAudio(audioBlob);
        // Display the transcription in your chat interface
        // ...
      };
      mediaRecorder.current.stop();
      setRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    // Implement your logic to send the audioBlob to Whisper API
    // and return the transcription
    // ...
    return "";
  };

  return (
    <div>
      <button onClick={startRecording} disabled={recording}>
        Record
      </button>
      <button onClick={stopRecording} disabled={!recording}>
        Stop
      </button>
    </div>
  );
};

export default EdenVoice;
