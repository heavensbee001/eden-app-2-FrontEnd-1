// eslint-disable-next-line no-unused-vars
import { Maybe, Position } from "@eden/package-graphql/generated";
import {
  BrandedAppUserLayout,
  EdenAiProcessingModal,
  EdenIconExclamation,
  EdenTooltip,
  SEOJobBoard,
} from "@eden/package-ui";
import axios from "axios";
import { IncomingMessage, ServerResponse } from "http";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

import type { NextPageWithLayout } from "../_app";
// const ReactTooltip = dynamic<any>(() => import("react-tooltip"), {
//   ssr: false,
// });

const JobsPage: NextPageWithLayout = ({ company, positions }) => {
  const [loadingSpinner, setLoadingSpinner] = useState(false);

  const _positions: Position[] =
    (company?.type === "COMMUNITY"
      ? positions
      : positions?.map((item: any) => {
          //this map avoids having to fetch company again inside each position in backend
          item!.company = {
            _id: company?._id,
            name: company?.name,
            slug: company?.slug,
            imageUrl: company?.imageUrl,
          };
          return item;
        })) || [];

  return (
    <>
      <SEOJobBoard
        title={company?.name}
        description={company.description}
        company={company}
      />
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:${process.env.NEXT_PUBLIC_HOTJAR_ID},hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
          }}
        />
      </Head>

      {/* -------- Banner -------- */}
      <section className="mx-auto mb-8 max-w-screen-xl px-8">
        <div className="mb-4 h-96 w-full rounded-lg bg-black px-12">
          <div className="flex h-full w-full max-w-[60%] flex-col justify-center">
            <h1 className="mb-2 text-white">
              {"The "}
              {company?.name}
              {" Talent Collective"}
            </h1>
            <p className="mb-8 text-white">
              {
                "Developer DAO is a decentralized autonomous organization nurturing collaboration, learning, and value creation in the web3 developer community. It's a hub for beginners and professionals to build and mentor."
              }
            </p>

            <div className="flex items-center">
              <Link href={`/signup`}>
                <BrandedButton color="#000000">
                  Join Talent Collective
                </BrandedButton>
              </Link>
              <span className="mr-3 text-white">or</span>
              <Link href={`/signup`}>
                <BrandedButton color="#000000">Post a Job</BrandedButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-screen-xl grid-cols-12 gap-4 px-8 pb-16">
        {/* -------- Filter & Ask Eden sections -------- */}
        <section className="col-span-3">
          {/* -------- Filter sections -------- */}
          <FilterOpportunities />
        </section>
        {/* -------- Jobs Section -------- */}
        <section className="col-span-9 px-6 pt-2">
          <h3 className="mb-2">Open opportunities</h3>
          <div className="grid w-full grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3">
            {_positions
              ?.reverse()
              .map((position: Maybe<Position>, index: number) => {
                return (
                  <PositionCard
                    position={position!}
                    setLoadingSpinner={setLoadingSpinner}
                    key={index}
                  />
                );
              })}
          </div>
        </section>
      </div>
      <EdenAiProcessingModal
        title="Getting things ready for you"
        open={loadingSpinner}
      />
    </>
  );
};

JobsPage.getLayout = (page) => (
  <BrandedAppUserLayout>{page}</BrandedAppUserLayout>
);

export const getServerSideProps = async (context: {
  req: IncomingMessage;
  res: ServerResponse;
}) => {
  try {
    const _slug =
      process.env.NEXT_PUBLIC_FORCE_SLUG_LOCALHOST ||
      context.req.headers.host?.split(".")[0];

    const companyRes = await axios.post(
      process.env.NEXT_PUBLIC_GRAPHQL_URL as string,
      {
        headers: {
          "Access-Control-Allow-Origin": `*`,
        },
        variables: { fields: { slug: _slug } },
        query: `
      query ($fields: findCompanyFromSlugInput) {
        findCompanyFromSlug(fields: $fields) {
          _id
          name
          type
          slug
          description
          imageUrl
          mission
          benefits
          values
          founders
          whatsToLove
          positions {
            _id
            name
            icon
            status
            talentList {
              _id
              name
            }
            generalDetails {
              officePolicy
              contractType
              yearlySalary {
                min
                max
              }
            }
            company {
              _id
              name
              slug
              imageUrl
            }
          }
          candidatesNum
          skillsNum
        }
      }
    `,
      }
    );

    const company = companyRes.data.data.findCompanyFromSlug;
    let positions;

    if (company?.type === "COMMUNITY") {
      const communityPositions = await axios.post(
        process.env.NEXT_PUBLIC_GRAPHQL_URL as string,
        {
          headers: {
            "Access-Control-Allow-Origin": `*`,
          },
          variables: {
            fields: { slug: _slug },
          },
          query: `
        query Query($fields: findPositionsOfCommunityInput) {
          findPositionsOfCommunity(fields: $fields) {
            _id
            name
            status
            icon
            generalDetails {
              officePolicy
              contractType
              yearlySalary {
                min
                max
              }
            }
            company {
              _id
              name
              slug
              imageUrl
              whatsToLove
            }
          }
        }
      `,
        }
      );

      positions = communityPositions.data.data.findPositionsOfCommunity;
    } else {
      positions = company?.positions;
      positions?.map((item: any) => {
        //this map avoids having to fetch company again inside each position in backend
        item!.company = {
          _id: company?._id,
          name: company?.name,
          slug: company?.slug,
          imageUrl: company?.imageUrl,
        };
        return item;
      });
    }

    const filteredPositions = positions.filter(
      (_position: Position) =>
        _position?.status !== "ARCHIVED" &&
        _position?.status !== "UNPUBLISHED" &&
        _position?.status !== "DELETED"
    );

    return {
      props: {
        company,
        positions: filteredPositions,
      },
      // 10 min to rebuild all paths
      // (this means new data will show up after 10 min of being added)
      // revalidate: 600,
    };
  } catch (error) {
    console.log(error);
    return { notFound: true };
  }
};

// export const getStaticPaths = async () => {
//   try {
//     const res = await axios.post(
//       process.env.NEXT_PUBLIC_GRAPHQL_URL as string,
//       {
//         headers: {
//           "Access-Control-Allow-Origin": `*`,
//         },
//         variables: { fields: [] },
//         query: `
//         query FindCompanies($fields: findCompaniesInput) {
//           findCompanies(fields: $fields) {
//             _id
//             slug
//           }
//         }
//         `,
//       }
//     );

//     const paths = res.data.data.findCompanies
//       .filter((_comp: any) => !!_comp.slug)
//       .map((_comp: any) => ({
//         params: { slug: _comp.slug },
//       }));

//     console.log("getStaticPaths --- ", paths);

//     // { fallback: false } means other routes should 404
//     return {
//       paths,
//       fallback: true,
//     };
//   } catch (error) {
//     console.log(error);
//     return {
//       paths: [],
//       fallback: true,
//     };
//   }
// };

export default JobsPage;

type PositionCardProps = {
  position: Position;
  setLoadingSpinner: Dispatch<SetStateAction<boolean>>;
};

const PositionCard = ({ position, setLoadingSpinner }: PositionCardProps) => {
  const router = useRouter();

  const handlePickJobs = async (pos: any) => {
    setLoadingSpinner(true);
    await router.push(`/${pos.company?.slug}/jobs/${pos._id}`);
    setLoadingSpinner(false);
  };

  return (
    <div
      className="transition-ease-in-out group relative col-span-1 w-full cursor-pointer rounded-md bg-white p-1 shadow-sm transition-all hover:scale-[101%] hover:shadow-md"
      onClick={() => {
        handlePickJobs(position);
      }}
    >
      <div className="bg-edenGreen-200 relative flex h-56 w-full items-center rounded-md p-2">
        {(!!position?.generalDetails?.yearlySalary?.min ||
          position?.generalDetails?.yearlySalary?.min === 0) && (
          <p className="text-edenGray-500 absolute left-2 top-4 w-full text-sm">
            ${position?.generalDetails?.yearlySalary.min / 1000 + "k"}
            {position?.generalDetails?.yearlySalary.max
              ? " - $" + position?.generalDetails.yearlySalary.max / 1000 + "k"
              : ""}
          </p>
        )}
        <h2>{position?.name}</h2>
      </div>
      <div className="flex w-full flex-row p-2">
        <Image
          style={{ objectFit: "contain" }}
          width="44"
          height="44"
          className="mr-2 rounded-md"
          src={`${
            position?.company?.imageUrl
              ? position?.company?.imageUrl
              : "/default-company-image.svg"
          }`}
          alt={`${position?.company?.name} company image`}
        />
        <div className="flex flex-col justify-center">
          <h4 className="text-edenGray-500 font-normal">
            {position?.company?.name}
          </h4>
          <p className="text-edenGray-900 text-sm capitalize">
            {position?.generalDetails?.officePolicy &&
              position?.generalDetails?.officePolicy}
            {position?.generalDetails?.contractType
              ? " • " + position?.generalDetails?.contractType
              : " • Fulltime"}
          </p>
        </div>
      </div>
      <div className="absolute right-2 top-2 flex h-full flex-col justify-between">
        <EdenTooltip
          id={`${position?._id}`}
          innerTsx={
            <div className="w-80">
              <p>{position.company?.whatsToLove}</p>
            </div>
          }
          place="top"
          effect="solid"
          backgroundColor="white"
          border
          borderColor="#e5e7eb"
          padding="0.5rem"
        >
          <div className="bg-edenPink-200 h-[35px] w-[35px] rounded-full p-1 shadow-md">
            <EdenIconExclamation className="h-full w-full" />
          </div>
        </EdenTooltip>
      </div>
    </div>
  );
};

type FilterOpportunitiesProps = {};

const FilterOpportunities = ({}: FilterOpportunitiesProps) => {
  const [unwrapped, setUnwrapped] = useState(false);

  return (
    <section className="rounded-md bg-white p-4">
      <div className="flex items-center">
        <h3>Filter opportunities</h3>
        <div
          className="hover:bg-edenGray-100 ml-auto flex h-5 w-5 cursor-pointer items-center justify-center rounded-full"
          onClick={() => {
            setUnwrapped(!unwrapped);
          }}
        >
          {unwrapped ? <BiChevronDown /> : <BiChevronUp />}
        </div>
      </div>
    </section>
  );
};

type BrandedButtonProps = {
  children: React.ReactNode;
  color?: string;
  onClick?: () => void;
};

const BrandedButton = ({ children, color }: BrandedButtonProps) => {
  return (
    <button
      style={{
        backgroundColor: color,
      }}
      className="mr-3 inline-block rounded-md border border-white px-4 py-2 text-white hover:!bg-white hover:text-black"
    >
      {children}
    </button>
  );
};
