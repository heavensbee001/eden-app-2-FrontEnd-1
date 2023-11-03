import { ApolloClient, gql, InMemoryCache, useMutation } from "@apollo/client";
import { Position } from "@eden/package-graphql/generated";
import { AppUserLayout, Button, Loading, Modal, SEO } from "@eden/package-ui";
import { classNames } from "@eden/package-ui/utils";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import {
  Control,
  SubmitHandler,
  useFieldArray,
  useForm,
  UseFormGetValues,
  UseFormRegister,
} from "react-hook-form";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { BsStar } from "react-icons/bs";
import { GoTag } from "react-icons/go";
import {
  HiOutlineHeart,
  HiOutlineShare,
  HiOutlineUsers,
  HiPencil,
} from "react-icons/hi";
import { SlLocationPin } from "react-icons/sl";
import { TbMoneybag } from "react-icons/tb";
import { toast } from "react-toastify";

import type { NextPageWithLayout } from "../../_app";

const UPDATE_COMPANY_DETAILS = gql`
  mutation ($fields: updateCompanyDetailsInput!) {
    updateCompanyDetails(fields: $fields) {
      _id
      name
      slug
      description
    }
  }
`;
const UPDATE_POSITION = gql`
  mutation ($fields: updatePositionInput!) {
    updatePosition(fields: $fields) {
      _id
      whoYouAre
      whatTheJobInvolves
    }
  }
`;

const editInputClasses =
  "inline-block bg-transparent -my-[2px] -mx-2 border-2 border-utilityOrange px-1 rounded-md outline-utilityYellow remove-arrow focus:outline-none";

const PositionPage: NextPageWithLayout = ({
  position,
}: {
  position: Position;
}) => {
  const router = useRouter();
  const { edit } = router.query;

  const editMode = edit === "true";

  const [editCompany, setEditCompany] = useState(false);
  const [uploadingCompanyImage, setUploadingCompanyImage] = useState(false);

  const { control, register, handleSubmit, getValues, setValue } = useForm<any>(
    {
      defaultValues: {
        name: position.name || "",
        whoYouAre: position.whoYouAre || "",
        whatTheJobInvolves: position.whatTheJobInvolves || "",
        generalDetails: {
          yearlySalary: position.generalDetails?.yearlySalary,
          officeLocation: position.generalDetails?.officeLocation || "",
          officePolicy: position.generalDetails?.officePolicy || "",
        },
        company: {
          description: position.company?.description,
          imageUrl: position.company?.imageUrl,
          employeesNumber: position.company?.employeesNumber,
          tags: position.company?.tags || [],
          mission: position.company?.mission,
          funding:
            position.company?.funding?.map((round) => ({
              date: round?.date,
              amount: round?.amount,
              name: round?.name,
            })) || [],
          benefits: position.company?.benefits,
          values: position.company?.values,
          founders: position.company?.founders,
          glassdoor: position.company?.glassdoor,
        },
      },
    }
  );

  const fileInput = useRef<HTMLInputElement | null>(null);

  const [updateCompanyDetails, { loading: updateCompanyDetailsLoading }] =
    useMutation(UPDATE_COMPANY_DETAILS, {
      onCompleted() {
        console.log("completed update company");
      },
      onError() {
        toast.error("An error occurred while submitting");
      },
    });

  const [updatePosition, { loading: updatePositionLoading }] = useMutation(
    UPDATE_POSITION,
    {
      onCompleted() {
        console.log("completed update position");
      },
      onError() {
        toast.error("An error occurred while submitting");
      },
    }
  );

  const onSubmit: SubmitHandler<Position> = () => {
    updateCompanyDetails({
      variables: {
        fields: {
          slug: position.company?.slug,
          ...getValues("company"),
        },
      },
    });

    updatePosition({
      variables: {
        fields: {
          _id: position._id,
          name: getValues("name"),
          whoYouAre: getValues("whoYouAre"),
          whatTheJobInvolves: getValues("whatTheJobInvolves"),
        },
      },
    });
  };

  const handleFileChange = async (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setUploadingCompanyImage(true);
      try {
        if (e.target.files[0] > 1 * 1024 * 1024) {
          // setSizeErr(true);
          setUploadingCompanyImage(false);
          return;
        }

        const postid = `${position.company?._id}_${Math.floor(
          100000 + Math.random() * 900000
        )}`;
        const blob = e.target.files[0].slice(
          0,
          e.target.files[0].size,
          "application/png"
        );

        const newFile = new File([blob], `${postid}.png`, {
          type: "application/png",
        });

        const formData = new FormData();

        formData.append("imgfile", newFile);

        await axios.post(
          `${process.env.NEXT_PUBLIC_AUTH_URL}/storage/store-image` as string,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
        setValue(
          "company.imageUrl",
          `https://storage.googleapis.com/eden_companies_images/${postid}.png`
        );
        setUploadingCompanyImage(false);
      } catch (error) {
        setUploadingCompanyImage(false);
        // toast.error(error);
      }
    }
  };

  const parseOfficePolicy = (_officePolicy: string) => {
    if (_officePolicy === "on-site") return "On site";
    if (_officePolicy === "remote") return "Remote";
    if (_officePolicy === "hybrid-1-day-office") return "Hybrid - 1 day office";
    if (_officePolicy === "hybrid-2-day-office") return "Hybrid - 2 day office";
    if (_officePolicy === "hybrid-3-day-office") return "Hybrid - 3 day office";
    if (_officePolicy === "hybrid-4-day-office") return "Hybrid - 4 day office";

    return "";
  };

  return (
    <>
      <SEO
        title={position?.company?.name || ""}
        description={position?.name || ""}
        image={position?.company?.imageUrl || ""}
      />
      <div>
        <section
          className="py-24 w-full flex justify-center"
          style={{
            backgroundImage: "url(/banner.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="relative w-4/5 max-w-4xl bg-white rounded-md p-10 grid grid-cols-12">
            {editMode && (
              <button
                className="absolute right-4 top-4 bg-edenGray-500 text-utilityOrange whitespace-nowrap border border-utilityOrange rounded-md px-2 flex items-center disabled:text-edenGray-700 disabled:border-edenGray-700"
                onClick={() => {
                  setEditCompany(!editCompany);
                }}
              >
                <HiPencil size={16} className="inline-block mr-2" />
                Edit
              </button>
            )}
            <div className="col-span-5">
              <h1 className="text-edenGreen-600 mb-10">
                {editMode && editCompany ? (
                  <>
                    <input
                      {...register("name")}
                      className={classNames(editInputClasses, "")}
                    />
                    {`, ${position?.company?.name}`}
                  </>
                ) : (
                  `${getValues("name")}, ${position?.company?.name}`
                )}
              </h1>
              <div className="mb-4">
                <TbMoneybag
                  size={24}
                  className="inline-block mr-3 text-edenGreen-600"
                />
                <div className="inline-block bg-edenGreen-600 text-edenPink-300 rounded-xl font-Moret px-3 py-0.5 font-bold">
                  {editMode && editCompany ? (
                    <>
                      {`$ `}
                      <input
                        type="number"
                        {...register("generalDetails.yearlySalary", {
                          valueAsNumber: true,
                        })}
                        className={classNames(editInputClasses, "w-20")}
                      />
                    </>
                  ) : (
                    `$ ${getValues("generalDetails.yearlySalary")}`
                  )}
                </div>
              </div>
              <div className="flex items-center mb-4">
                <BsStar
                  size={24}
                  className="inline-block mr-3 text-edenGreen-600"
                />
                <div className="text-edenGray-600 px-6 py-1.5 flex items-center justify-center border border-edenGray-300 rounded-md mr-3 ml-1">
                  <h4 className="text-lg">?</h4>
                </div>
                <div>
                  <h3 className="text-edenGreen-600">Matchstimate</h3>
                  <p className="text-edenGray-500 text-xs">Login to see</p>
                </div>
              </div>
              <div className="mb-4">
                <SlLocationPin
                  size={24}
                  className="inline-block mr-3 text-edenGreen-600"
                />
                <div className="inline-block bg-edenGreen-600 text-edenPink-300 rounded-xl font-Moret px-3 py-0.5 font-bold mr-2 mb-1">
                  {editMode && editCompany ? (
                    <>
                      <select
                        {...register("generalDetails.officePolicy")}
                        disabled={!(editMode && editCompany)}
                        className={classNames(
                          editInputClasses,
                          "disabled:border-0 disabled:opacity-100"
                        )}
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
                    </>
                  ) : (
                    getValues("generalDetails.officePolicy") &&
                    parseOfficePolicy(getValues("generalDetails.officePolicy"))
                  )}
                </div>
                <div className="inline-block bg-edenGreen-600 text-edenPink-300 rounded-xl font-Moret px-3 py-0.5 font-bold mr-2">
                  {editMode && editCompany ? (
                    <>
                      <input
                        {...register("generalDetails.officeLocation")}
                        className={classNames(editInputClasses, "")}
                      />
                    </>
                  ) : (
                    getValues("generalDetails.officeLocation")
                  )}
                </div>
              </div>
            </div>
            <div className="col-span-7 border-l-2 border-edenGreen-300 pl-4">
              {editMode && editCompany ? (
                <label
                  htmlFor="file-upload"
                  className={classNames(
                    "relative block w-fit rounded-md cursor-pointer hover:bg-black hover:bg-opacity-20",
                    editMode
                      ? "border-2 border-utilityOrange -my-[2px] -mx-2 mb-1"
                      : ""
                  )}
                >
                  {uploadingCompanyImage && (
                    <div className="absolute left-0 top-0 w-full h-full pointer-events-none">
                      <Loading title="" />
                    </div>
                  )}
                  <img
                    src={getValues("company.imageUrl") || ""}
                    className="h-20"
                    alt={position?.company?.name || ""}
                  />
                  <HiPencil
                    size={20}
                    className="absolute right-1 bottom-1 text-utilityOrange opacity-60"
                  />
                  <input
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileChange}
                    ref={fileInput}
                    type="file"
                    accept=".png"
                  ></input>
                </label>
              ) : (
                <img
                  src={getValues("company.imageUrl") || ""}
                  className="h-20"
                  alt={position?.company?.name || ""}
                />
              )}
              <p className="text-edenGray-900 text-sm mb-2">
                {editMode && editCompany ? (
                  <>
                    <textarea
                      {...register("company.description")}
                      className={classNames(editInputClasses, "w-full")}
                    />
                  </>
                ) : (
                  `${getValues("company.description")}`
                )}
              </p>
              <p className="text-edenGray-900 text-sm mb-2">
                <HiOutlineUsers
                  size={20}
                  className="inline-block mr-2 text-edenGreen-600"
                />
                {editMode && editCompany ? (
                  <>
                    <input
                      type="number"
                      {...register("company.employeesNumber", {
                        valueAsNumber: true,
                      })}
                      className={classNames(editInputClasses, "w-20")}
                    />
                    {` employees`}
                  </>
                ) : (
                  `${getValues("company.employeesNumber")} employees`
                )}
              </p>
              <p className="text-sm mb-2">
                <GoTag
                  size={24}
                  className="inline-block mr-2 text-edenGreen-600"
                />
                {position?.company?.tags?.map((tag, index) => (
                  <div
                    key={index}
                    className="px-2 mr-2 bg-edenGray-100 rounded-md inline pb-1"
                  >
                    {tag}
                  </div>
                ))}
              </p>
              <div className="text-sm p-4 bg-edenPink-100 rounded-md">
                <div className="flex mb-2">
                  <div className="bg-edenGreen-300 mr-2 rounded-full h-6 w-6 flex items-center justify-center">
                    <HiOutlineHeart size={16} className="text-edenGreen-600" />
                  </div>
                  <h3 className="text-edenGreen-600">What&apos;s to love?</h3>
                </div>
                <p className="text-edenGray-700 text-xs">
                  {position?.company?.whatsToLove}
                </p>
              </div>
            </div>
          </div>
        </section>
        <div className="grid grid-cols-12 w-4/5 max-w-4xl gap-x-8 py-16 px-8 mx-auto">
          {/* ---- POSITION DETAILS ---- */}
          <div className="col-span-12 md:col-span-6">
            <section className="bg-edenPink-100 rounded-md overflow-hidden mb-8">
              <div className="bg-edenPink-300 px-6 py-4">
                <h2 className="text-edenGreen-600">Role</h2>
              </div>
              <div className="px-6 py-4 border-edenGreen-300">
                <div className="border-b-2 border-edenGreen-300 mb-4">
                  <h3 className="text-edenGreen-600 font-semibold mb-2">
                    Who you are
                  </h3>
                  <p className="text-xs mb-4">
                    {editMode ? (
                      <>
                        <textarea
                          rows={8}
                          {...register("whoYouAre")}
                          className={classNames(editInputClasses, "w-full")}
                        />
                      </>
                    ) : (
                      getValues("whoYouAre")
                    )}
                  </p>
                </div>
                <div className="">
                  <h3 className="text-edenGreen-600 font-semibold mb-2">
                    What the job involves
                  </h3>
                  <p className="text-xs">
                    {editMode ? (
                      <>
                        <textarea
                          rows={8}
                          {...register("whatTheJobInvolves")}
                          className={classNames(editInputClasses, "w-full")}
                        />
                      </>
                    ) : (
                      getValues("whatTheJobInvolves")
                    )}
                  </p>
                </div>
              </div>
            </section>

            {/* ---- SHARE & REPORT ---- */}
            <section className="bg-edenPink-100 rounded-md overflow-hidden px-6 py-4 mb-8">
              <div
                className="flex items-center group cursor-pointer w-fit"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://edenprotocol.app/${position.company?.slug}/jobs/${position._id}`
                  );
                  toast.success("Job link copied");
                }}
              >
                <HiOutlineShare
                  size={24}
                  className="mr-2 text-edenGreen-600 group-hover:text-edenGreen-400 inline"
                />
                <span className="group-hover:text-edenGray-500 group-hover:underline">
                  Share this job
                </span>
              </div>
            </section>
          </div>

          <div className="col-span-12 md:col-span-6">
            {/* ---- YOU & THE ROLE ---- */}
            <section className="bg-edenPink-100 rounded-md overflow-hidden mb-8">
              <div className="bg-edenPink-300 px-6 py-4">
                <h2 className="text-edenGreen-600">You & the role</h2>
              </div>
              <div className="px-6 py-4">
                <div className="h-8 w-8 rounded-md bg-edenPink-300 flex items-center justify-center mx-auto">
                  <AiOutlineEyeInvisible size={"1.4rem"} />
                </div>
                <h3 className="text-edenGreen-600 text-center font-semibold mb-4">
                  Upload your resume to unlock:
                </h3>
                <ul className="text-edenGray-900 list-disc pl-4 text-sm">
                  <li className="mb-2"> If you’d be a good fit</li>
                  <li className="mb-2">
                    What your strengths are for this opportunity
                  </li>
                  <li className="mb-2">
                    What your weaknesses are for this opportunity
                  </li>
                </ul>

                <div className="flex justify-center mt-4">
                  <Link href={`/interview/${position._id}`}>
                    <Button
                      variant="secondary"
                      // onClick={() => {
                      //   router.push(`/interview/${position._id}`);
                      // }}
                    >
                      Upload CV
                    </Button>
                  </Link>
                </div>
              </div>
            </section>

            {/* ---- COMPANY DETAILS ---- */}
            <section className="bg-edenPink-100 rounded-md overflow-hidden mb-8">
              <div className="bg-edenPink-300 px-6 py-4">
                <h2 className="text-edenGreen-600">Company</h2>
              </div>
              <div className="px-6">
                {/* ---- MISSION ---- */}
                {(position?.company?.mission || editMode) && (
                  <div className="border-b-2 border-edenGreen-300 last:!border-0 py-4">
                    <h3 className="text-edenGreen-600">Company Mission</h3>
                    <p className="text-xs">
                      {editMode ? (
                        <>
                          <textarea
                            rows={8}
                            {...register("company.mission")}
                            className={classNames(editInputClasses, "w-full")}
                          />
                        </>
                      ) : (
                        getValues("company.mission")
                      )}
                    </p>
                  </div>
                )}

                {/* ---- INSIGHTS ---- */}
                {position?.company?.insights &&
                  position?.company?.insights.length > 0 && (
                    <div className="border-b-2 border-edenGreen-300 last:!border-0 py-4">
                      <h3 className="text-edenGreen-600">Insights</h3>
                      <div className="relative w-full flex flex-wrap">
                        {position?.company?.insights?.map((insight, index) => (
                          <div
                            key={index}
                            className="min-w-[50%] flex items-center mt-2"
                          >
                            <div className="bg-edenPink-300 mr-2 flex h-6 w-8 items-center justify-center rounded-md pb-px">
                              <span
                                className={classNames(
                                  // getGrade(_category!.score! * 100).color,
                                  "text-md"
                                )}
                              >
                                {insight?.letter}
                              </span>
                            </div>
                            <p className="text-2xs text-edenGray-700">
                              {insight?.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* ---- EDEN'S TAKE ---- */}
                {position?.company?.edenTake && (
                  <div className="border-b-2 border-edenGreen-300 last:!border-0 py-4">
                    <h3 className="text-edenGreen-600">Eden&apos;s Take</h3>
                    <p className="text-xs">{position.company.edenTake}</p>
                  </div>
                )}

                {/* ---- WIDGETS ---- */}
                <div className="border-b-2 border-edenGreen-300 last:!border-0 py-4">
                  <h3 className="text-edenGreen-600 mb-4">Widgets</h3>

                  {/* ---- FUNDING ---- */}
                  {(editMode || position?.company?.funding) && (
                    <FundingWidget
                      control={control}
                      getValues={getValues}
                      register={register}
                      editMode={editMode}
                    />
                  )}
                  {/* ---- CULTURE ---- */}
                  {position?.company?.culture && (
                    <div className="mb-4 last:mb-0">
                      <h3 className="text-edenGreen-600 mb-2">
                        AI culture summary
                      </h3>
                      <div className="bg-edenGreen-300 rounded-md p-4">
                        <div className="text-center mb-2">
                          {position?.company?.culture.tags &&
                            position?.company?.culture.tags?.map(
                              (tag, index) => (
                                <div
                                  key={index}
                                  className="inline px-4 mr-2 last:mr-0 bg-edenGreen-600 text-edenPink-400 rounded-md inline py-1 font-Moret"
                                >
                                  {tag}
                                </div>
                              )
                            )}
                        </div>
                        <p className="text-sm text-white">
                          {position.company.culture.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* ---- BENEFITS ---- */}
                {(editMode || position?.company?.benefits) && (
                  <div className="border-b-2 border-edenGreen-300 last:!border-0 py-4">
                    <h3 className="text-edenGreen-600">Benefits & perks</h3>
                    <p className="text-xs">
                      {editMode ? (
                        <>
                          <textarea
                            rows={8}
                            {...register("company.benefits")}
                            className={classNames(editInputClasses, "w-full")}
                          />
                        </>
                      ) : (
                        getValues("company.benefits")
                      )}
                    </p>
                  </div>
                )}

                {/* ---- COMPANY VALUES ---- */}
                {(editMode || position?.company?.values) && (
                  <div className="border-b-2 border-edenGreen-300 last:!border-0 py-4">
                    <h3 className="text-edenGreen-600">Company Values</h3>
                    <p className="text-xs">
                      {editMode ? (
                        <>
                          <textarea
                            rows={8}
                            {...register("company.values")}
                            className={classNames(editInputClasses, "w-full")}
                          />
                        </>
                      ) : (
                        getValues("company.values")
                      )}
                    </p>
                  </div>
                )}

                {/* ---- FOUNDERS ---- */}
                {(editMode || position?.company?.founders) && (
                  <div className="border-b-2 border-edenGreen-300 last:!border-0 py-4">
                    <h3 className="text-edenGreen-600">Founders</h3>
                    <p className="text-xs">
                      {editMode ? (
                        <>
                          <textarea
                            rows={8}
                            {...register("company.founders")}
                            className={classNames(editInputClasses, "w-full")}
                          />
                        </>
                      ) : (
                        getValues("company.founders")
                      )}
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* ---- FOOTER APPLY ---- */}
        <footer className="bg-edenGreen-600 h-16 w-full fixed bottom-0 left-0 flex items-center justify-center">
          {!editMode ? (
            <Link href={`/interview/${position._id}`}>
              <Button className="border-edenPink-400 !text-edenPink-400">
                Apply with AI
              </Button>
            </Link>
          ) : (
            <>
              <Button
                onClick={handleSubmit(onSubmit)}
                className="border-edenPink-400 !text-edenPink-400 mr-4"
              >
                Save as draft
              </Button>
              <Button className="border-edenPink-400 !text-edenPink-400">
                Publish to Developer DAO
              </Button>

              <Modal
                open={updateCompanyDetailsLoading || updatePositionLoading}
                closeOnEsc={false}
              >
                <div className="h-80">
                  <Loading title={"Updating position"} />
                </div>
              </Modal>
            </>
          )}
        </footer>
      </div>
    </>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const positionID = ctx.params?.positionID;

  const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: gql`
      query ($fields: findPositionInput!) {
        findPosition(fields: $fields) {
          _id
          name
          status
          whoYouAre
          whatTheJobInvolves
          company {
            _id
            name
            slug
            imageUrl
            description
            benefits
            employeesNumber
            tags
            whatsToLove
            mission
            insights {
              letter
              text
            }
            edenTake
            funding {
              name
              date
              amount
            }
            culture {
              tags
              description
            }
            benefits
            values
            founders
            glassdoor
          }
          generalDetails {
            yearlySalary
            officePolicy
            officeLocation
          }
        }
      }
    `,
    variables: {
      fields: {
        _id: positionID,
      },
    },
  });

  return {
    props: { position: data.findPosition || null },
  };
}

PositionPage.getLayout = (page) => <AppUserLayout>{page}</AppUserLayout>;

export default PositionPage;

export interface IFundingWidget {
  control: Control;
  register: UseFormRegister<any>;
  getValues: UseFormGetValues<any>;
  editMode: boolean;
}

const FundingWidget = ({
  control,
  register,
  getValues,
  editMode,
}: IFundingWidget) => {
  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm
    name: "company.funding", // unique name for your Field Array
  });

  console.log(fields);

  return (
    <div className="mb-4 last:mb-0">
      <h3 className="text-edenGreen-600 mb-2">Funding</h3>
      <div
        className={classNames(
          "bg-edenGreen-300 rounded-md p-4",
          editMode ? "px-1" : ""
        )}
      >
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex justify-between items-center mb-2 last:mb-0 relative"
          >
            <span className="text-white">
              {editMode ? (
                <input
                  placeholder="date"
                  {...register(`company.funding.${index}.date`)}
                  className={classNames(editInputClasses, "w-full mx-0")}
                />
              ) : (
                getValues(`company.funding.${index}.date`)
              )}
            </span>
            <div className="h-2 w-2 bg-edenPink-400 rounded-full mx-1 px-1"></div>
            <span className="text-white">
              {editMode ? (
                <input
                  placeholder="amount"
                  {...register(`company.funding.${index}.amount`)}
                  className={classNames(editInputClasses, "w-full mx-0")}
                />
              ) : (
                getValues(`company.funding.${index}.amount`)
              )}
            </span>
            <div className="inline-block bg-edenGreen-600 text-edenPink-400 rounded-xl font-Moret px-3 py-0.5 font-bold">
              {editMode ? (
                <input
                  placeholder="series"
                  {...register(`company.funding.${index}.name`)}
                  className={classNames(editInputClasses, "w-full mx-0")}
                />
              ) : (
                getValues(`company.funding.${index}.name`)
              )}
            </div>
            {editMode && (
              <div
                className="absolute -right-6 bg-edenGray-500 text-utilityRed border-2 border-utilityRed rounded-full flex items-center justify-center w-4 h-4 pb-1 mx-auto font-bold text-xl hover:text-edenGray-500 hover:bg-utilityRed cursor-pointer"
                onClick={() => remove(index)}
              >
                -
              </div>
            )}
          </div>
        ))}
        {editMode && (
          <div
            className="bg-edenGray-500 text-utilityOrange border-2 border-utilityOrange rounded-full flex items-center justify-center w-6 h-6 pb-1 mx-auto font-bold text-xl hover:text-edenGray-500 hover:bg-utilityOrange cursor-pointer"
            onClick={() => append({ date: "", amount: "", name: "" })}
          >
            +
          </div>
        )}
      </div>
    </div>
  );
};
