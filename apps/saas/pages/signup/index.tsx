import { AppUserLayout } from "@eden/package-ui";
import { IncomingMessage, ServerResponse } from "http";
import Link from "next/link";
import { useRouter } from "next/router";

import { NextPageWithLayout } from "../_app";

const HARDCODED_POOLS = [
  {
    title: "Frontend Developer",
    deform: "https://devdao.deform.cc/frontend",
  },
  {
    title: "Backend Developer",
    deform: "https://devdao.deform.cc/backend",
  },
  {
    title: "Blockchain Developer",
    deform: "https://devdao.deform.cc/blockchain",
  },
  {
    title: "Full Stack Developer",
    deform: "https://devdao.deform.cc/fullstack",
  },
  {
    title: "DevRel",
    deform: "https://devdao.deform.cc/devrel",
  },
  {
    title: "Designer",
    deform: "https://devdao.deform.cc/designer",
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
              <option value={pool.deform} key={index}>
                {pool.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p>
            If you are a hiring manager login{" "}
            <Link
              href={"/D_D/jobs"}
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
