import { gql, useMutation } from "@apollo/client";
import { AppUserLayout, Button, EdenAiProcessingModal } from "@eden/package-ui";
import axios from "axios";
import { IncomingMessage, ServerResponse } from "http";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { NextPageWithLayout } from "../_app";

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
  const [submitting, setSubmitting] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const [updateCompany] = useMutation(UPDATE_COMPANY, {
    // eslint-disable-next-line no-unused-vars
    onCompleted({ data }) {
      // console.log("data from onComplete", data);
      if (formData) {
        router.push(`/${formData.companyAbbreviation}/dashboard`);
      }
    },
    onError() {
      setSubmitting(false);
    },
  });

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
      <div className="flex h-screen w-full items-center justify-center">
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
              <div>
                <div className="flex flex-col">
                  <input
                    type="text"
                    id="Abbreviation"
                    className="border-EdenGray-100 flex h-[34px] w-full items-center rounded-md  border bg-transparent bg-white p-2 text-xs"
                    required
                    {...register("companyAbbreviation", {
                      pattern: /^[a-z0-9-]+$/,
                    })}
                  />
                  {errors.companyAbbreviation && (
                    <span className="ml-1 text-sm font-bold text-red-400">
                      Invalid Input: Please ensure your input contains only
                      lowercase letters (a-z), numbers (0-9), and the hyphen (-)
                      character.
                    </span>
                  )}
                </div>
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

            <Button type="submit" variant="secondary" className="mx-auto block">
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

  if (!session.productID) {
    const _user = await axios({
      url: process.env.NEXT_PUBLIC_GRAPHQL_URL,
      method: "post",
      data: {
        query: `
        query {
          findMembers(fields: {
            _id: ${session.user?.id}
          }) {
            _id
            stripe {
              product {
                ID
              }
            }
          }
        }`,
      },
    });

    if (!_user.data.data.findMembers[0].stripe.product.ID) {
      return {
        redirect: {
          destination: `/subscribe`,
          permanent: false,
        },
      };
    } else {
      session.productID = _user.data.data.findMembers[0].stripe;
    }
  }

  return {
    props: { key: url },
  };
}

export default CreateCompany;
