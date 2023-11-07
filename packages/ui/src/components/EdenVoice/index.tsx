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
            `http://localhost:5001/transcribe-audio`,
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
