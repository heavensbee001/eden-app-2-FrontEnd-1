import { SEO } from "@eden/package-ui";
import Lottie from "lottie-react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { signIn } from "next-auth/react";

import animationData2 from "../public/lotties/select-candidate.json";
import animationData1 from "../public/lotties/working-laptop.json";

const HomePage: NextPage = () => {
  return (
    <>
      <SEO title={`Eden protocol`} />
      <Head>
        <title>Eden protocol</title>
      </Head>
      <div className={`min-h-screen overflow-hidden bg-[#fcf0f6]`}>
        <div className="mx-auto max-w-4xl py-8">
          <h2 className="text-bold text-center text-3xl text-[#00462C]">
            <Image
              src="/eden-logo.png"
              alt=""
              width={60}
              height={60}
              className="mr-4 inline-block"
            />
            Talk to less, but more of the right candidates.
          </h2>
          <section className="mb-4 grid grid-cols-12">
            <div className="col-span-4 flex items-center justify-center">
              <Lottie
                animationData={animationData1}
                className="flex items-center justify-center opacity-80"
                loop={false}
              />
            </div>
            <div className="col-span-4 flex items-center justify-center">
              <button
                className="hover:text-[#00462C] flex h-10 w-32 items-center justify-center bg-accentColor hover:bg-white"
                onClick={() => {
                  signIn("google");
                }}
              >
                login
              </button>
            </div>
            <div className="col-span-4 flex items-center justify-center">
              <Lottie
                animationData={animationData2}
                className="flex items-center justify-center opacity-80"
                loop={true}
              />
            </div>
          </section>
          <section>
            <div className="grid grid-cols-12 gap-12">
              <div className="col-span-4">
                <div>
                  <h3 className="mb-4 text-center text-4xl text-[#00462C]">
                    Align
                  </h3>
                </div>
              </div>
              <div className="col-span-4">
                <div>
                  <h3 className="mb-4 text-center text-4xl text-[#00462C]">
                    Evaluate
                  </h3>
                </div>
              </div>
              <div className="col-span-4">
                <div>
                  <h3 className="mb-4 text-center text-4xl text-[#00462C]">
                    Select
                  </h3>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-12">
              <div className="col-span-4 h-full">
                <div className="h-full bg-[#d9d9d9] px-2 py-2 pb-8 text-center">
                  <p className="mb-4">
                    Eden makes sure she’s got all the info she needs to properly{" "}
                    <b>vet candidates up to your standards</b>.
                  </p>
                  <p className="text-sm">
                    Based on the alignment conversation you have with her, she
                    generates an interview link that you can share with
                    candidates that will do the first interview with applicants
                    as if done by a recruiter.
                  </p>
                </div>
              </div>
              <div className="col-span-4 h-full">
                <div className="h-full bg-[#d9d9d9] px-2 py-2 pb-8 text-center">
                  <p className="mb-4">
                    After the first scan Eden does, she generates an{" "}
                    <b>
                      overview with recommendations for every candidate in a
                      dashboard
                    </b>
                    .
                  </p>
                  <p className="text-sm">
                    Eden makes it very easy to compare and understand the
                    potential tradeoffs between all candidates giving you all
                    the info you need to make a decision at your fingertips.
                  </p>
                </div>
              </div>
              <div className="col-span-4 h-full">
                <div className="h-full bg-[#d9d9d9] px-2 py-2 pb-8 text-center">
                  <p className="mb-4">
                    Decide what candidates you want to{" "}
                    <b>invite for a second interview</b>.
                  </p>
                  <p className="text-sm">
                    Eden automatically generates congratulation e-mails that re
                    designed to get the candidate excited as well as thoughtful
                    rejection messages for those you do not wish to see again.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default HomePage;
