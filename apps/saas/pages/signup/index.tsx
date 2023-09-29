import { AppUserLayout } from "@eden/package-ui";
import { IncomingMessage, ServerResponse } from "http";
import Link from "next/link";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";

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
        <div className="mb-8">
          <h2 className="text-edenGreen-600">Join D_D as a:</h2>
          <select name="" id="" onChange={handleSelect}>
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
              href={"/create-company"}
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
  const session = await getSession(ctx);

  const url = ctx.req.url;

  if (!session) {
    return {
      redirect: {
        destination: `/?redirect=/signup`,
        permanent: false,
      },
    };
  }

  return {
    props: { key: url },
  };
}

export default SignupCommunity;
