import { gql, useMutation } from "@apollo/client";
import React, { useRef, useState } from "react";

const TRANSCRIBED_AUDIO_TO_TEXT = gql`
  mutation ($fields: storeLongTermMemoryInput!) {
    storeLongTermMemory(fields: $fields) {
      summary
      success
    }
  }
`;

const EdenVoice: React.FC = () => {
  const [recording, setRecording] = useState<boolean>(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const [TranscribeAudioToText, {}] = useMutation(TRANSCRIBED_AUDIO_TO_TEXT, {
    onCompleted: (data) => {
      console.log(data);
    },
    onError: (err) => {
      console.log(err);
    },
  });

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

        console.log("audioBlob", audioBlob);
        // Create a URL representing the audio blob
        const audioUrl = URL.createObjectURL(audioBlob);

        console.log("audioUrl", audioUrl);

        //Create a new Audio object
        const audio = new Audio(audioUrl);

        TranscribeAudioToText({
          variables: {
            fields: {
              // cvString: text
              audioFile: audioBlob,
            },
          },
        });

        console.log("audio", audio);
        // audio.play();

        // Transcribe the audio blob using Whisper API
        // const transcription = await transcribeAudio(audioBlob);
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
