import { gql } from "@apollo/client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  HiCodeBracket,
  HiOutlineCamera,
  HiOutlineComputerDesktop,
  HiOutlinePencil,
} from "react-icons/hi2";

export const WEBPAGE_TO_MEMORY = gql`
  mutation ($fields: websiteToMemoryCompanyInput!) {
    websiteToMemoryCompany(fields: $fields) {
      report
      interviewQuestionsForPosition {
        originalQuestionID
        originalContent
        personalizedContent
      }
    }
  }
`;
interface IDescriptionContainerProps {
  // eslint-disable-next-line no-unused-vars
  onChange: (data: any) => void;
  defaultValues: any;
}
export const DescriptionContainer = ({
  onChange,
  defaultValues,
}: IDescriptionContainerProps) => {
  // eslint-disable-next-line no-unused-vars
  const { register, watch, control, setValue, getValues } = useForm<any>({
    defaultValues: {
      position: "",
      pastedText: "",
    },
  });

  const formData = watch();

  useEffect(() => {
    setValue("position.name", defaultValues["position.name"]);
  }, []);

  useEffect(() => {
    onChange({
      "position.name": formData.position.name,
      pastedText: formData.pastedText,
    });
  }, [formData.position.name, formData.pastedText]);

  return (
    <form className="w-full max-w-[33rem]">
      <div className="mb-6">
        <p className="text-edenGray-500 mb-2 block text-xs">
          Select opportunity icon
        </p>
        <div>
          <div className="inline-block mr-8">
            <div className="w-8 h-8 rounded-md bg-edenPink-200 flex items-center justify-center cursor-pointer hover:bg-edenPink-100">
              <HiCodeBracket size={"1.2rem"} />
            </div>
          </div>
          <div className="inline-block mr-8">
            <div className="w-8 h-8 rounded-md bg-edenPink-200 flex items-center justify-center cursor-pointer hover:bg-edenPink-100">
              <HiOutlinePencil size={"1.2rem"} />
            </div>
          </div>
          <div className="inline-block mr-8">
            <div className="w-8 h-8 rounded-md bg-edenPink-200 flex items-center justify-center cursor-pointer hover:bg-edenPink-100">
              <HiOutlineCamera size={"1.2rem"} />
            </div>
          </div>
          <div className="inline-block mr-8">
            <div className="w-8 h-8 rounded-md bg-edenPink-200 flex items-center justify-center cursor-pointer hover:bg-edenPink-100">
              <HiOutlineComputerDesktop size={"1.2rem"} />
            </div>
          </div>
        </div>
        {/* <input
          id="name"
          {...register("position.name")}
          placeholder="Type name here..."
          className="border-edenGray-100 block w-full rounded-md border px-4 py-2 text-sm"
          onFocus={(event) => {
            event.target.select();
          }}
        /> */}
      </div>

      <div className="mb-6">
        <label htmlFor="name" className="text-edenGray-500 mb-2 block text-xs">
          Opportunity name
        </label>
        <input
          id="name"
          {...register("position.name")}
          placeholder="Type name here..."
          className="border-edenGray-100 block w-full rounded-md border px-4 py-2 text-sm"
          onFocus={(event) => {
            event.target.select();
          }}
        />
      </div>

      <div className="mb-6">
        <label className="text-edenGray-500 mb-2 block text-xs">
          Copy/paste your job description from LinkedIn, Greenhouse...
        </label>

        <textarea
          {...register("pastedText")}
          // onChange={handlePastedTextChange}
          placeholder="This is a sample text..."
          className="h-64 border-edenGray-100 mb-4 block w-full resize-none rounded-md border p-4 text-sm outline-0"
          onFocus={(event) => {
            event.target.select();
          }}
        />
      </div>
    </form>
  );
};
