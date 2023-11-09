import { MicrophoneIcon } from "@heroicons/react/solid";
import React, { useRef, useState } from "react";

interface EdenVoiceProps {
  onTranscriptionComplete: (transcription: string) => void;
  recordingStateChange: (recording: boolean) => void;
}

const EdenVoice: React.FC<EdenVoiceProps> = ({
  onTranscriptionComplete,
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

        recordingStateChange(false);

        if (audioBlob.size > 25 * 1024 * 1024) {
          console.error("File size exceeds the 25 MB limit");

          return;
        }

        const formData = new FormData();

        formData.append("audiofile", audioBlob, "recording.web");

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_AUTH_URL}/storage/transcribeWhisper` as string,
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const result = await response.json();

          console.log("Transcribed Text:", result.transcription);
          onTranscriptionComplete(result.transcription);
        } catch (error) {
          console.error("Error transcribing audio: ", error);
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
