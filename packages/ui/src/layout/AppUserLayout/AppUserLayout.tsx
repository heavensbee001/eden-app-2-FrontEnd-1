import { LeftToggleNav } from "@eden/package-ui";
import { classNames } from "@eden/package-ui/utils";
import { useRouter } from "next/router";
import { useState } from "react";

import { LeftNav } from "../../components/LeftNav";

interface IAppUserLayoutProps {
  children: React.ReactNode;
  logoLink?: string;
}

export const AppUserLayout = ({
  children,
  logoLink = `/`,
}: IAppUserLayoutProps) => {
  const [unwrappedNav, setUnwrappedNav] = useState(false);

  const router = useRouter();

  return (
    <div className="min-h-screen w-full">
      <div className="">
        {/* <AppHeader logoLink={logoLink} inApp /> */}
        {router.pathname.includes("/jobs") ||
        router.pathname.includes("/pricing") ||
        router.pathname.includes("/signup") ||
        router.pathname.includes("/interview") ||
        router.pathname.includes("/connect-telegram") ||
        router.pathname.includes("/request-access") ? (
          <LeftNav logoLink={logoLink} />
        ) : (
          <LeftToggleNav
            unwrapped={unwrappedNav}
            onToggleNav={() => setUnwrappedNav(!unwrappedNav)}
            logoLink={logoLink}
          />
        )}

        <main
          className={classNames(
            "transition-pl bg-bgColor relative min-h-screen transition-all ease-in-out",
            unwrappedNav ? "pl-[14.5rem]" : "pl-16"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppUserLayout;
