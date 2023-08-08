import { gql } from "@apollo/client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

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
  }, [defaultValues]);

  useEffect(() => {
    onChange({
      "position.name": formData.position.name,
      pastedText: formData.pastedText,
    });
  }, [formData.position.name, formData.pastedText]);

  return (
    <form className="w-full max-w-[33rem]">
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
          className="border-edenGray-100 mb-4 block w-full resize-none rounded-md border p-4 text-sm outline-0"
          onFocus={(event) => {
            event.target.select();
          }}
        />
      </div>
    </form>
  );
};
