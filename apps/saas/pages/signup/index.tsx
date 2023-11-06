import { SaasUserLayout } from "@eden/package-ui";
import { IncomingMessage, ServerResponse } from "http";
import Link from "next/link";
import { useRouter } from "next/router";

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
  const handleSelect = (e: any) => {
    console.log(e);

    if (e.currentTarget.value) {
      router.push(e.currentTarget.value);
    }
  };

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="mb-12 w-3/5">
          <p className="font-Moret text-edenGreen-500 mb-3 text-xl">
            {" "}
            I know you aren&apos;t just one thing.
          </p>
          <p className="font-Unica text-edenGray-900">
            {
              "So don't worry too much about choosing the exact right oasis. If I see you have strong skills in other areas, I'll for sure let you know if I see opportunities that match you as a whole person. I got you ;)"
            }
          </p>
        </div>
        <div className="bg-edenPink-300 mb-8 flex w-full max-w-[40rem] justify-center p-8">
          <h2 className="text-edenGreen-600 mr-4">Join D_D as a:</h2>
          <select
            name=""
            id=""
            onChange={handleSelect}
            className="rounded-md bg-white px-2 outline-none"
          >
            <option value="" className="text-edenGray-500" disabled selected>
              Select your position...
            </option>
            {HARDCODED_POOLS.map((pool, index) => (
              <option value={pool.url} key={index}>
                {pool.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p>
            If you are a hiring manager login{" "}
            <Link
              href={"/developer-dao/jobs"}
              className="hover:text-edenGray-500 underline"
            >
              here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

SignupCommunity.getLayout = (page: any) => (
  <SaasUserLayout>{page}</SaasUserLayout>
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
