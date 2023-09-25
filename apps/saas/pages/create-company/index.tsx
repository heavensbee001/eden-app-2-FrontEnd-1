import { gql, useMutation } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import { EmployeeTypeInput } from "@eden/package-graphql/generated";
import { AppUserLayout, Button, EdenAiProcessingModal } from "@eden/package-ui";
import { IncomingMessage, ServerResponse } from "http";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { NextPageWithLayout } from "../_app";

type FormData = {
  companyName: string;
  companyAbbreviation: string;
  companyDescription: string;
};

const UPDATE_COMPANY = gql`
  mutation ($fields: updateCompanyInput!) {
    updateCompany(fields: $fields) {
      _id
      name
      type
      slug
      description
    }
  }
`;
const ADD_EMPLOYEES_COMPANY = gql`
  mutation ($fields: addEmployeesCompanyInput!) {
    addEmployeesCompany(fields: $fields) {
      _id
      name
      slug
      employees {
        typeT
        user {
          _id
          discordName
        }
      }
    }
  }
`;
const CreateCompany: NextPageWithLayout = () => {
  // eslint-disable-next-line no-unused-vars
  const [formData, setFormData] = useState<FormData | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { register, handleSubmit } = useForm();
  const { currentUser } = useContext(UserContext);

  const router = useRouter();

  const [addEmployeesCompany] = useMutation(ADD_EMPLOYEES_COMPANY, {
    onCompleted(data) {
      if (data.addEmployeesCompany) {
        router.push(
          `/${data.addEmployeesCompany.companyAbbreviation}/dashboard`
        );
      }
    },
    onError() {
      setSubmitting(false);
    },
  });

  const [updateCompany, { data: updateCompanyData }] = useMutation(
    UPDATE_COMPANY,
    {
      // eslint-disable-next-line no-unused-vars
      onCompleted({ data }) {
        console.log("completed add company");
      },
      onError() {
        toast.error("An error occurred while submitting");
        setSubmitting(false);
      },
    }
  );

  useEffect(() => {
    if (updateCompanyData)
      addEmployeesCompany({
        variables: {
          fields: {
            companyID: updateCompanyData.updateCompany._id,
            employees: [{ userID: currentUser!._id }] as EmployeeTypeInput[],
          },
        },
      });
  }, [updateCompanyData]);

  const submitHandler = (data: any) => {
    setFormData(data);
    // console.log("data from handler:", data);
    setSubmitting(true);
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
      <div className="h-screen w-full flex items-center justify-center">
        <form
          className="w-full max-w-2xl"
          onSubmit={handleSubmit(submitHandler)}
        >
          <section className="mb-4 inline-block w-full space-y-6 p-4 pr-12">
            <div className="space-y-1">
              <p className="text-xs">Company Name</p>
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
              <p className="text-xs">Description of the Company</p>
              <div>
                <textarea
                  className="border-EdenGray-100 w-full border p-2 text-xs"
                  rows={6}
                  id="Description"
                  required
                  {...register("companyDescription")}
                />
              </div>
            </div>

            <Button type="submit" variant="secondary" className="block mx-auto">
              Submit
            </Button>
          </section>
        </form>
        <EdenAiProcessingModal
          title="Creating your company"
          open={submitting}
        />
      </div>
    </>
  );
};

CreateCompany.getLayout = (page: any) => <AppUserLayout>{page}</AppUserLayout>;

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
}) {
  const session = await getSession(ctx);

  const url = ctx.req.url;

  if (!session) {
    return {
      redirect: {
        destination: `/?redirect=${url}`,
        permanent: false,
      },
    };
  }

  return {
    props: { key: url },
  };
}

export default CreateCompany;
