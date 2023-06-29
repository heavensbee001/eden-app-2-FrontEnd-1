import { gql, useMutation } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import {
  ChangeEvent,
  // FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { BsCheckCircle } from "react-icons/bs";
import { toast } from "react-toastify";

import { EdenAiProcessingModal } from "../../elements";
// export const CV_TO_SUMMARY = gql`
//   mutation ($fields: CVtoSummaryInput!) {
//     CVtoSummary(fields: $fields) {
//       result
//     }
//   }
// `;

export const SAVE_CV_TO_USER = gql`
  mutation SaveCVtoUser($fields: saveCVtoUserInput) {
    saveCVtoUser(fields: $fields) {
      success
      titleRole
      mainSkills
      cvSummary
    }
  }
`;

export interface ICVUploadGPTProps {
  timePerWeek?: number;
  seed?: string;
  positionID?: string | string[] | undefined;
  handleEnd?: () => void;
  // eslint-disable-next-line no-unused-vars
  onDataReceived?: (data: string) => void;
}

export const CVUploadGPT = ({
  // eslint-disable-next-line no-unused-vars
  timePerWeek,
  // eslint-disable-next-line no-unused-vars
  seed,
  positionID,
  handleEnd,
  onDataReceived,
}: ICVUploadGPTProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploaded, setUploaded] = useState<boolean>(false);
  const [sizeErr, setSizeErr] = useState<boolean>(false);
  const [uploadCounter, setUploadCounter] = useState(0);

  // const [summary, setSummary] = useState<string | null>(null);
  const { currentUser } = useContext(UserContext);

  const [SaveCVtoUser] = useMutation(SAVE_CV_TO_USER, {
    // onCompleted({ SaveCVtoUser }) {
    //   console.log("SaveCVtoUser", SaveCVtoUser);
    //   console.log("SaveCVtoUser.result", SaveCVtoUser.result);
    //   setSummary(SaveCVtoUser.result);
    // },
    onCompleted: (data) => {
      console.log("------>", data);
      // sendDataToInterview(data);
      sendDataToInterview(data);

      setUploading(false);
      setUploaded(true);
      setFile(null);
      setSizeErr(false);
      toast.success("success");
      if (handleEnd) handleEnd();
    },
    onError: (err) => {
      setUploading(false);
      toast.error(err.message);
    },
  });

  const sendDataToInterview = (data: string) => {
    if (onDataReceived) {
      onDataReceived(data);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      //When user tries to upload the same CV the second time
      setUploadCounter((prevCounter) => prevCounter + 1);
      e.target.value = ""; // Clear the file input
    }
  };

  const fileInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (file) {
      setUploading(true);

      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64File = ((reader.result as string) || "").split(",")[1];
        const response = await fetch("../api/process-pdf/process-pdf", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileBuffer: base64File }),
        });

        if (response.ok) {
          const { text } = await response.json();

          console.log("text.split", text.split(" ").length > 10);

          if (text.split(" ").length > 10) {
            SaveCVtoUser({
              variables: {
                fields: {
                  // cvString: text
                  userID: currentUser?._id,
                  cvContent: text,
                  positionID: positionID,
                },
              },
            });
            if (fileInput.current) {
              fileInput.current.value = "";
            }
            setFile(null);
          } else {
            // console.log(file);
            if (file.size > 1000000) {
              setSizeErr(true);
              setUploading(false);
              return;
            }
            uploadOCRService(file);
            return;
          }

          console.log(text);
        } else {
          const { error } = await response.json();

          console.log("error", error);
        }
      };

      reader.readAsDataURL(file);
    }
  }, [file, uploadCounter]);

  const uploadOCRService = async (_file: any) => {
    var formData = new FormData();

    // formData.append("base64Image", "data:application/pdf;base64," + _file);
    formData.append("file", _file);
    formData.append("filetype", "PDF");

    const response = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      headers: {
        apikey: process.env.NEXT_PUBLIC_OCR_SPACE_API_KEY!,
        contentType: "application/pdf",
      },
      body: formData,
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // console.log("data_____", data.ParsedResults[0].ParsedText);
        // return response.json();
        if (!data.ParsedResults[0] || !data.ParsedResults[0].ParsedText) {
          throw new Error("Could not parse the cv");
        }
        SaveCVtoUser({
          variables: {
            fields: {
              // cvString: text
              userID: currentUser?._id,
              cvContent: data.ParsedResults[0].ParsedText,
              positionID: positionID,
            },
          },
        });
        if (fileInput.current) {
          fileInput.current.value = "";
        }
      })
      .catch(() => {
        toast.error(
          <div className="flex flex-col justify-center space-y-1">
            <div className="text-lg text-black">
              Please upload a different CV we didn&apos;t identify any text on
              this one
            </div>
            <div className="text-sm">
              *Also, feel free to continue without uploading your Resume
            </div>
          </div>
        );
        // toast.info(
        //   "Also, feel free to continue without uploading your Resume"
        // );
        setUploading(false);
      });

    console.log("PARSE OK", response);
  };

  // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (!file) {
  //     return;
  //   }
  //   const reader = new FileReader();

  //   reader.onloadend = async () => {
  //     const base64File = ((reader.result as string) || "").split(",")[1];
  //     const response = await fetch("../api/process-pdf/process-pdf", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ fileBuffer: base64File }),
  //     });

  //     if (response.ok) {
  //       const { text } = await response.json();

  //       SaveCVtoUser({
  //         variables: {
  //           fields: {
  //             // cvString: text
  //             userID: currentUser?._id,
  //             cvContent: text,
  //           },
  //         },
  //       });

  //       console.log(text);
  //     } else {
  //       const { error } = await response.json();

  //       console.log("error aaa", error);
  //     }
  //   };

  //   reader.readAsDataURL(file);
  // };

  // const summaryList = summary
  //   ? summary
  //       .split("•")
  //       .filter((item) => item.trim() !== "")
  //       .map((item, index) => <li key={index}>{item}</li>)
  //   : [];

  // console.log("summaryList", summaryList);

  return (
    <div className="w-fit ">
      <form
        // onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center space-y-2"
      >
        {/* <label>Resume(CV)</label> */}
        {/* <label htmlFor="input" className="text-center text-sm">
          Upload Recent Resume for Better Results Form Our AI
        </label> */}
        <label htmlFor="file-upload" className="relative">
          <div
            className={`cursor-pointer rounded-md border-2 px-4 py-1 hover:border-black hover:bg-black hover:text-white ${
              uploaded
                ? " !cursor-default !border-gray-200 !bg-gray-200 !text-black"
                : ""
            }`}
          >
            Upload Your CV
          </div>
          {uploaded && (
            <BsCheckCircle
              size={24}
              color="#40f83f"
              className="absolute -right-[40px] top-[6px]"
            />
          )}
        </label>
        <input
          disabled={uploaded}
          id="file-upload"
          className="hidden"
          onChange={handleFileChange}
          ref={fileInput}
          type="file"
          accept=".pdf"
        ></input>
        {/* {uploading && <Loading title="uploading" />} */}
        <EdenAiProcessingModal
          open={uploading}
          title="Eden AI is processing your CV"
        >
          <p className="text-center">
            Please wait.
            <br /> This process may take up to 30 seconds
          </p>
        </EdenAiProcessingModal>
        {/* <button
          className="rounded-lg border-2 border-blue-400 px-2 font-bold text-blue-400 hover:border-blue-700 hover:bg-blue-700 hover:text-white"
          type="submit"
        >
          Upload Resume
        </button> */}
      </form>
      {sizeErr && (
        <p className="mt-6 max-w-md text-center text-red-400">
          File size is exceeding the limit and you that your CV could not be
          processed. Please attempt again using a file of 1MB or smaller.
          <br />
          You can try to compress the file using{" "}
          <a
            href="https://www.ilovepdf.com/compress_pdf"
            target="_blank"
            rel="noreferrer"
            className="font-bold underline"
          >
            this service
          </a>
        </p>
      )}
      {/* {summary ? (
        <div className="ml-2 mt-2 w-fit rounded-md border-2 border-black pl-6 pr-4 ">
          <label htmlFor="ul" className="text-right text-lg font-bold">
            CV Summary:
          </label>
          <ul className="list-outside list-disc space-y-[3px] ">
            {summaryList}
          </ul>
        </div>
      ) : null} */}
    </div>
  );
};
