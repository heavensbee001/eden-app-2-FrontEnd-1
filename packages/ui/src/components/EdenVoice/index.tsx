import { MicrophoneIcon, StopIcon } from "@heroicons/react/solid";
import React, { useRef } from "react";

interface EdenVoiceProps {
  // eslint-disable-next-line no-unused-vars
  onTranscriptionComplete: (transcription: string) => void;
  setRecording: React.Dispatch<React.SetStateAction<boolean>>;
  recording: boolean;
}

const EdenVoice: React.FC<EdenVoiceProps> = ({
  onTranscriptionComplete,
  setRecording,
  recording,
}) => {
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      setRecording((prevRecording) => !prevRecording);

      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.start();
      console.log(mediaRecorder.current, "after state change");
    } catch (error) {}
  };

  // recordingStateChange(true);

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.ondataavailable = async (e) => {
        const audioBlob = e.data;

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
    }
    setRecording((prevRecording) => !prevRecording);
  };

  return (
    <div>
      {!recording ? (
        <button onClick={startRecording} disabled={recording}>
          <MicrophoneIcon className="h-4 w-4" />
        </button>
      ) : (
        <div className="bg-edenPink-300 mx-auto flex w-full items-center justify-between rounded-xl p-4 shadow-md">
          <div className="flex-1"></div>
          <div className="flex flex-col items-center">
            <div className="mb-2 h-2 w-2 animate-pulse rounded-full bg-red-500"></div>
            <MicrophoneIcon className="text-edenGreen-500 h-8 w-8" />
          </div>
          <div className="flex flex-1 justify-end">
            <button
              onClick={stopRecording}
              aria-label="Stop recording"
              className="cursor-pointer rounded-full p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 "
              title="Stop recording"
            >
              <StopIcon className="text-edenGreen-500 h-11 w-11 " />
            </button>{" "}
          </div>
        </div>
      )}
    </div>
  );
};

export default EdenVoice;
