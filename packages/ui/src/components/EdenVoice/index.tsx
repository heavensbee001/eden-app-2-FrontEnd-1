import React, { useRef, useState } from "react";

import { MicrophoneIcon } from "@heroicons/react/solid";

interface EdenVoiceProps {
  onTranscriptionColmplete: (transcription: string) => void;
  recordingStateChange: (recording: boolean) => void;
}

const EdenVoice: React.FC<EdenVoiceProps> = ({
  onTranscriptionColmplete,
  recordingStateChange,
}) => {
  const [recording, setRecording] = useState<boolean>(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.start();
      setRecording(true);
      recordingStateChange(true);
    } catch (error) {
      console.error("Error starting recording: ", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.ondataavailable = async () => {
        const audioBlob = event.data;

        if (audioBlob.size > 25 * 1024 * 1024) {
          console.error("File size exceeds the 25 MB limit");

          return;
        }

        const formData = new FormData();

        formData.append("audiofile", audioBlob, "recording.web");

        try {
          const response = await fetch(
            `http://localhost:5001:/storage/transcribeWhisper`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const result = await response.json();

          console.log("Trancribed Text:", result.transciption);
          onTranscriptionColmplete(result);
        } catch (error) {
          console.error("Error trancribing audio: ", error);
        }
      };
      mediaRecorder.current.stop();
      setRecording(false);
    }
  };

  return (
    <div>
      {!recording ? (
        <button onClick={startRecording} disabled={recording}>
          <MicrophoneIcon className="h-4 w-4" />
        </button>
      ) : (
        <button onClick={stopRecording}>Stop</button>
      )}
    </div>
  );
};

export default EdenVoice;
