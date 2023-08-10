import { gql } from "@apollo/client";
import { useMemo } from "react";
import { IconPicker } from "react-fa-icon-picker";
import { Controller, useForm } from "react-hook-form";

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
      position: {
        name: defaultValues["position.name"],
        icon: defaultValues["position.icon"],
      },
      pastedText: "",
    },
  });

  const formData = watch();

  useMemo(() => {
    onChange({
      "position.name": formData.position?.name,
      "position.icon": formData.position?.icon,
      pastedText: formData.pastedText,
    });
  }, [formData.position?.name, formData.pastedText, formData.position?.icon]);

  return (
    <form className="w-full max-w-[33rem]">
      <div className="mb-6">
        <p className="text-edenGray-500 mb-2 block text-xs">
          Select opportunity icon
        </p>
        <div className="">
          <Controller
            name={"position.icon"}
            control={control}
            render={({ field: { onChange } }: any) => (
              <IconPicker
                value={watch("position.icon")}
                onChange={onChange}
                buttonStyles={{
                  backgroundColor: "#FCEEF5",
                  border: "none",
                  height: "2rem",
                  minHeight: "2rem",
                  width: "2rem",
                }}
                buttonIconStyles={{ color: "#00462C", fontSize: "1.2rem" }}
                pickerIconStyles={{
                  color: "#00462C",
                  fontSize: "1.2rem",
                  padding: "0.25rem",
                }}
                containerStyles={{
                  border: "1px solid #F2F2F2",
                  borderRadius: "0.375rem",
                  padding: "0.25rem",
                  justifyContent: "center",
                }}
                searchInputStyles={{
                  fontSize: "0.875rem",
                  borderBottom: "1px solid #F2F2F2",
                  marginBottom: "0.5rem",
                }}
              />
            )}
          />
        </div>
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
