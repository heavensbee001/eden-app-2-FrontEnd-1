import { gql, useMutation } from "@apollo/client";
import { AppUserLayout, Button, SEO, TextArea } from "@eden/package-ui";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

// @ts-ignore
import type NextPageWithLayout from "../../_app";

type FormData = {
  companyName: string;
  companyAbbreviation: string;
  companyDescription: string;
};

const UPDATE_COMPANY = gql`
  mutation ($fields: updateCompanyInput!) {
    updateCompany(fields: $fields) {
      name
      type
      slug
      description
    }
  }
`;
const CreateCompany: NextPageWithLayout = () => {
  const [formData, setFormData] = useState<FormData | null>(null);
  const { register, handleSubmit } = useForm();

  const router = useRouter();

  const [updateCompany] = useMutation(UPDATE_COMPANY, {
    onCompleted({ data }) {
      console.log("data from onComplete", data);
      if (formData) {
        router.push(`/${formData.companyAbbreviation}/dashboard`);
      }
    },
  });

  const submitHandler = (data: any) => {
    setFormData(data);
    console.log("data from handler:", data);
    updateCompany({
      variables: {
        fields: {
          name: data.companyName,
          slug: data.companyAbbreviation,
          type: "COMPANY",
          description: data.companyDescription,
        },
      },
    });
  };

  return (
    <>
      <SEO />
      <form className="h-full w-full" onSubmit={handleSubmit(submitHandler)}>
        <section className="mb-4 inline-block w-4/5 space-y-3 border-2 p-4 pr-12">
          <div className="space-y-1">
            <p className=" text-xs">Company Name</p>
            <div className="border-EdenGray-100 flex w-full items-center rounded-md border bg-white text-xs">
              <input
                type="text"
                id="Name"
                className="h-[34px] w-full bg-transparent p-2"
                required
                {...register("companyName")}
              />
            </div>
          </div>

          <div className="space-y-1">
            <p className=" text-xs">Company Abbreviation</p>
            <div className="border-EdenGray-100 flex w-full items-center rounded-md border bg-white text-xs">
              <input
                type="text"
                id="Abbreviation"
                className="h-[34px] w-full bg-transparent p-2"
                required
                {...register("companyAbbreviation")}
              />
            </div>
          </div>

          <div className="space-y-1">
            <p className=" text-xs">Description of the Company</p>
            <div>
              <textarea
                className="border-EdenGray-100 w-full border p-2"
                rows={4}
                id="Description"
                required
                {...register("companyDescription")}
              />
            </div>
          </div>

          <Button type="submit">Submit</Button>
        </section>
      </form>
    </>
  );
};

CreateCompany.getLayout = (page: any) => <AppUserLayout>{page}</AppUserLayout>;

export default CreateCompany;
