import { AppUserLayout, Button, SEO } from "@eden/package-ui";
import { useForm } from "react-hook-form";

import type { NextPageWithLayout } from "../../_app";

const CreateCompany: NextPageWithLayout = () => {
  const { register, handleSubmit } = useForm();

  const submitHandler = (data) => {
    console.log("data from company page: ", data);
  };

  return (
    <>
      <SEO />
      <form className="h-full w-full" onSubmit={handleSubmit(submitHandler)}>
        <section className="mb-4 inline-block w-4/5 space-y-3 border-2 p-4 pr-12">
          <p className="mb-2 text-xs">Company Name</p>
          <div className="border-EdenGray-100 flex w-full items-center rounded-md border bg-white text-xs">
            <input
              type="text"
              id="Name"
              className="h-[34px] w-full bg-transparent p-2"
              required
              {...register("Company Name")}
            />
          </div>
          <p className="mb-2 text-xs">Company Abbreviation</p>
          <div className="border-EdenGray-100 flex w-full items-center rounded-md border bg-white text-xs">
            <input
              type="text"
              id="Abbreviation"
              className="h-[34px] w-full bg-transparent p-2"
              required
              {...register("Company Abbreviation")}
            />
          </div>

          <Button type="submit" onClick={submitHandler}>
            Summit
          </Button>
        </section>
      </form>
    </>
  );
};

CreateCompany.getLayout = (page) => <AppUserLayout>{page}</AppUserLayout>;

export default CreateCompany;
