import { LeftToggleNav } from "@eden/package-ui";
import { classNames } from "@eden/package-ui/utils";
import { useState } from "react";

interface IAppUserLayoutProps {
  children: React.ReactNode;
  logoLink?: string;
}

export const AppUserLayout = ({
  children,
  logoLink = `/`,
}: IAppUserLayoutProps) => {
  const [unwrappedNav, setUnwrappedNav] = useState(false);

  return (
    <div className="w-full min-h-screen">
      <div className="">
        {/* <AppHeader logoLink={logoLink} inApp /> */}
        <LeftToggleNav
          unwrapped={unwrappedNav}
          onToggleNav={() => setUnwrappedNav(!unwrappedNav)}
          logoLink={logoLink}
        />
        <main
          className={classNames(
            "transition-all ease-in-out transition-pl bg-bgColor",
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
