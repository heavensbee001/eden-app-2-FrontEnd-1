import { AppUserLayout } from "@eden/package-ui";
import { useRouter } from "next/router";
import { useState } from "react";

import { NextPageWithLayout } from "../_app";

const RequestAccess: NextPageWithLayout = () => {
  const router = useRouter();

  return (
    <>
      <div className="flex h-screen w-full items-center justify-center"></div>
    </>
  );
};

export default RequestAccess;
