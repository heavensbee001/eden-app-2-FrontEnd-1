import { AppUserLayout, Button } from "@eden/package-ui";
import { IncomingMessage, ServerResponse } from "http";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import { NextPageWithLayout } from "../_app";

const HARDCODED_POOLS = [
  {
    title: "Frontend Developer",
    url: "/interview/64e311bf3c477e32522fd57b",
  },
  {
    title: "Backend Developer",
    url: "/interview/64dde2a36dee65306b6eb62d",
  },
  {
    title: "Blockchain Developer",
    url: "/interview/64dc91572d77394577b12925",
  },
  {
    title: "Full Stack Developer",
    url: "/interview/64e3686c083f8b472997d451",
  },
  {
    title: "DevRel",
    url: "/interview/64dcd423966c1c455f0966bc",
  },
  {
    title: "Designer",
    url: "/interview/64dcb0fd2d7739565ab13152",
  },
];

const SignupCommunity: NextPageWithLayout = () => {
  const router = useRouter();
  const [selectedCollective, setSelectedCollective] = useState<number>(-1);
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const handleSelect = (index: number) => {
    setSelectedCollective(index);
  };

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center bg-[url('/signup-bg.png')]">
        <div className="mx-auto flex h-[236px] w-[604px] flex-col items-center justify-center rounded-lg bg-white">
          <div className="font-Moret text-2xl font-bold leading-[33.6px]">
            Choose your talent collective.
          </div>
          <div className="font-Unica text-xs leading-[16.8px] tracking-[-1.9%]">
            {"Choose the talent oasis that aligns most with your skills."}
          </div>
          <div className="font-Unica text-xs leading-[16.8px] tracking-[-1.9%]">
            {
              "You'll automatically be considered for other oasis based on your skills & profile."
            }
          </div>
          <div
            onClick={() => setShowOptions(!showOptions)}
            className="relative mb-[10px] mt-[18px]"
          >
            <div
              className={`${
                selectedCollective > -1 ? "text-black" : "text-edenGray-500 "
              } bg-edenPink-200 border-edenGray-500 flex  h-[33px] w-[204px] items-center justify-between rounded-md border pl-[13px] pr-1 text-center text-xs outline-none`}
            >
              {selectedCollective > -1
                ? HARDCODED_POOLS[selectedCollective].title
                : "Select talent collective to join"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
            {showOptions && (
              <div className="border-edenGray-500 bg-edenPink-200 absolute left-0 top-full w-[204px] translate-y-1 rounded-md border">
                {HARDCODED_POOLS.map((pool, index) => (
                  <div
                    className="hover:bg-edenPink-400 pl-4 text-xs"
                    onClick={() => handleSelect(index)}
                    key={index}
                  >
                    {pool.title}
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="text-edenGray-700 mb-[10px] text-[10px] leading-[14px]">
            If you are a hiring manager login{" "}
            <Link
              href={"/developer-dao/jobs"}
              className="hover:text-edenGray-500 underline"
            >
              here
            </Link>
          </p>
          <Button
            className="flex h-[34px] items-center"
            onClick={() => {
              // signIn("google", { callbackUrl: router.asPath });
              if (selectedCollective > -1)
                router.push(HARDCODED_POOLS[selectedCollective].url);
            }}
          >
            Join the oasis
          </Button>
        </div>
        <div className="flex w-[604px] flex-col pt-8">
          <h1 className="text-edenPink-500">{"What's the talent oasis?"}</h1>
          <div className="text-edenPink-400 font-Unica mt-[13px] text-base font-normal tracking-[-1.9%]">
            <p>
              {
                "The Eden talent collectives are an AI-managed & curated talent pool that helps you apply, shine for & land your dream opportunities."
              }
            </p>
            <br />
            <p>
              {
                "By joining the oasis, our AI will actively pitch your profile to hiring managers."
              }
            </p>
            <p>{"Be discovered by hiring managers before anyone else."}</p>
            <p>
              {
                "Get constant feedback on your current profile, application & interview style."
              }
            </p>
            <p>
              {
                "Ask for career advice: given your profile & the current market, what could be your next move?"
              }
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

SignupCommunity.getLayout = (page: any) => (
  <AppUserLayout>{page}</AppUserLayout>
);

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
}) {
  const url = ctx.req.url;

  return {
    props: { key: url },
  };
}

export default SignupCommunity;
