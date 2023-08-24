"use-client";

import { GeneralDetailsType, LinkType } from "@eden/package-graphql/generated";
import { FillSocialLinks } from "@eden/package-ui";
import { classNames } from "@eden/package-ui/utils";
import { Tab } from "@headlessui/react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { SlLocationPin } from "react-icons/sl";

interface IFinalFormContainerProps {
  // eslint-disable-next-line no-unused-vars
  onChange: (data: any) => void;
}

type FormData = {
  targetedStartDate: Date;
  visaRequirements: "yes" | "no";
  officePolicy:
    | "on-site"
    | "remote"
    | "hybrid-1-day-office"
    | "hybrid-2-day-office"
    | "hybrid-3-day-office"
    | "hybrid-4-day-office";
  officeLocation: string;
  contractType: "fulltime" | "parttime" | "freelance" | "intern";
  contractDuration: string; // You can specify more options if you have them
  yearlySalary: number;
  socials: { [key: string]: string };
};

const defaultFormValues: FormData = {
  targetedStartDate: new Date(),
  visaRequirements: "yes",
  officePolicy: "on-site",
  officeLocation: "",
  contractType: "fulltime",
  contractDuration: "",
  yearlySalary: 0,
  socials: {},
};

export const FinalFormContainer = ({ onChange }: IFinalFormContainerProps) => {
  // eslint-disable-next-line no-unused-vars
  const { setValue, getValues, register, watch } = useForm<FormData>({
    defaultValues: {
      ...defaultFormValues,
    },
  });

  const formData = watch();

  useMemo(() => {
    onChange({
      targetedStartDate: formData["targetedStartDate"],
      visaRequirements: formData["visaRequirements"] === "yes" ? true : false,
      officePolicy: formData["officePolicy"],
      officeLocation: formData["officeLocation"],
      contractType: formData["contractType"],
      contractDuration: formData["contractDuration"],
      yearlySalary: formData["yearlySalary"],
      socials: formData["socials"],
    } as GeneralDetailsType);
  }, [
    formData["targetedStartDate"],
    formData["visaRequirements"],
    formData["officePolicy"],
    formData["officeLocation"],
    formData["contractType"],
    formData["contractDuration"],
    formData["yearlySalary"],
    formData["socials"],
  ]);

  const handleChangeSocials = (val: LinkType[]) => {
    const _socials: { [key: string]: string } = {};

    val.forEach((element) => {
      if (element.name && element.url) _socials[element.name] = element.url;
    });

    setValue("socials", _socials);
  };

  return (
    <>
      <form className="flex items-center justify-center">
        <div className="mt-6 h-96 w-[40rem] rounded-lg  px-8 pb-8 pt-3">
          <Tab.Group>
            <Tab.List className="border-edenGreen-300 flex  w-full justify-between border-b ">
              <div className="flex items-start">
                <Tab
                  className={({ selected }) =>
                    classNames(
                      "text-edenGreen-400 -mb-px w-full pb-2 text-xs px-3",
                      selected
                        ? " !text-edenGreen-600 border-edenGreen-600 border-b outline-none"
                        : "hover:text-edenGreen-500 hover:border-edenGreen-600 hover:border-b"
                    )
                  }
                >
                  GENERAL
                </Tab>
                <Tab
                  className={({ selected }) =>
                    classNames(
                      "text-edenGreen-400 -mb-px w-full pb-2 text-xs px-3",
                      selected
                        ? " !text-edenGreen-600 border-edenGreen-600 border-b outline-none"
                        : "hover:text-edenGreen-500 hover:border-edenGreen-600 hover:border-b"
                    )
                  }
                >
                  SOCIALS
                </Tab>
              </div>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel className="pt-8">
                <div className="flex  gap-x-6">
                  <div className="flex  flex-col items-start text-xs">
                    <label className="text-xs ">Start Date </label>
                    <input
                      type="date"
                      id="targetedStartDate"
                      className="border-edenGray-100 mt-2 w-56 rounded-lg border p-2 outline-none"
                      required
                      {...register("targetedStartDate")}
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <label className="text-xs">Visa Required</label>
                    <div className="border-edenGray-100 mt-2 w-24 rounded-lg border bg-white p-2 text-xs ">
                      <select
                        id="visaRequirements"
                        className="w-full outline-none"
                        {...register("visaRequirements")}
                      >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex w-full flex-col items-start pr-2">
                    <label className="text-xs ">Office Policy</label>
                    <div className="border-edenGray-100 mt-2  w-full rounded-lg border bg-white p-2 text-xs">
                      <select
                        id="officePolicy"
                        className="w-full outline-none"
                        {...register("officePolicy")}
                      >
                        <option value={""} disabled hidden>
                          Select an option...
                        </option>
                        <option value="on-site">On site</option>
                        <option value="remote">Remote</option>
                        <option value="hybrid-1-day-office">
                          Hybrid - 1 day office
                        </option>
                        <option value="hybrid-2-day-office">
                          Hybrid - 2 day office
                        </option>
                        <option value="hybrid-3-day-office">
                          Hybrid - 3 day office
                        </option>
                        <option value="hybrid-4-day-office">
                          Hybrid - 4 day office
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="relative mb-6 mt-6 flex flex-col items-start">
                    <label className="text-xs">Office Locations</label>
                    <div className="mt-2 w-full rounded-lg bg-white text-xs">
                      <SlLocationPin className="absolute bottom-2 left-2 h-5 w-5 " />
                      <input
                        id="officeLocation"
                        {...register("officeLocation")}
                        type="text"
                        className="  border-edenGray-100 w-full rounded-lg border py-[.45rem] pl-8   outline-none "
                      />
                    </div>
                  </div>
                </div>

                <section className="text-start mb-6">
                  <p className="mb-2 text-xs">Anual Salary</p>
                  <div className="text-xs w-64 flex items-center border border-EdenGray-100 rounded-md bg-white">
                    <input
                      min={0}
                      // defaultValue={}
                      type="number"
                      id="budget"
                      className="w-full text-end outline-none font-Unica resize-none h-full p-2 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      required
                      {...register("yearlySalary")}
                    />
                    <div className="ml-auto border-l border-edenGray-100 px-3">
                      <span>$/year</span>
                    </div>
                  </div>
                </section>

                <div className="flex gap-x-8 ">
                  <div className="flex flex-col items-start">
                    <label className="text-xs">Contact Type</label>
                    <div className="border-edenGray-100   mt-2 w-64  rounded-lg border bg-white p-2 text-xs">
                      <select
                        id="contractType"
                        {...register("contractType")}
                        className=" w-full outline-none"
                      >
                        <option value={""} disabled hidden>
                          Select an option...
                        </option>
                        <option value="fulltime">Full time</option>
                        <option value="parttime">Part time</option>
                        <option value="freelance">Freelance</option>
                        <option value="intern">Intern</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex w-full flex-col items-start">
                    <label className="text-xs">Contract Duration</label>
                    <div className="border-edenGray-100 mt-2  w-full rounded-lg border bg-white p-2 text-xs">
                      <select
                        id="contractDuration"
                        {...register("contractDuration")}
                        className="w-full outline-none "
                      >
                        <option value={""} disabled hidden>
                          Select duration of contract
                        </option>
                        <option value={"3 months"}>3 months</option>
                        <option value={"6 months"}>6 months</option>
                        <option value={"1 year"}>1 year</option>
                        <option value={"2 year"}>2 year</option>
                        <option value={"indefinite"}>Indefinite</option>
                      </select>
                    </div>
                  </div>
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <div className=" gird grid-cols-2">
                  <FillSocialLinks onChange={handleChangeSocials} />
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </form>{" "}
    </>
  );
};
