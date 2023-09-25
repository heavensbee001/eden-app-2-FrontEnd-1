import { AppUserLayout, Button } from "@eden/package-ui";
import Image from "next/image";
import { useRouter } from "next/router";

import { NextPageWithLayout } from "../_app";

const RequestAccess: NextPageWithLayout = () => {
  return (
    <>
      <div className="mb-1 flex h-screen w-full flex-col items-center justify-center space-y-2">
        <Image
          className=" mt-16"
          alt="sleeping dashboard'
"
          src="/sleeping-dashboard.png"
          width={216}
          height={83}
        ></Image>

        <p className="my-4 font-bold">You do not have access to this page!</p>

        <Button
          variant="primary"
          className="font-Unica  mt-4 h-12  w-36  border-neutral-400 font-medium text-black "
          onClick={() => {
            console.log("");
          }}
        >
          <p className="text-sm">Request Access</p>
        </Button>
      </div>
    </>
  );
};

RequestAccess.getLayout = (page: any) => <AppUserLayout>{page}</AppUserLayout>;

export default RequestAccess;
