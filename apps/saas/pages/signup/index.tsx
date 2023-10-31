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
      <div className="min-h-screen flex items-center justify-center flex-col">
        <div className="mb-8 bg-edenPink-300 max-w-[40rem] w-full p-8 flex justify-center">
          <h2 className="text-edenGreen-600 mr-4">Join D_D as a:</h2>
          <select
            name=""
            id=""
            onChange={handleSelect}
            className="bg-white rounded-md px-2 outline-none"
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
              className="underline hover:text-edenGray-500"
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
