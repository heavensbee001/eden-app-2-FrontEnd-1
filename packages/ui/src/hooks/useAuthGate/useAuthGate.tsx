import { DynamicSessionContext } from "@eden/package-context";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

const useAuthGate = () => {
  const router = useRouter();
  const { edenSession } = useContext(DynamicSessionContext);

  useEffect(() => {
    if (!edenSession) {
      router.reload();
    }
  }, [edenSession]);
};

export default useAuthGate;
