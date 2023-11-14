import { UserContext } from "@eden/package-context";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { useContext } from "react";
import { FiLogOut } from "react-icons/fi";

import { MenuDropdown } from "../../components";
import { Avatar } from "../../elements";

export interface IAppUserLayoutProps {
  children: React.ReactNode;
  logoLink?: string;
}

export const AppUserLayout = ({
  children,
  logoLink = `/`,
}: IAppUserLayoutProps) => {
  const router = useRouter();

  return (
    <div className="">

      <nav className="fixed left-0 top-0 z-40 h-16 w-screen bg-white">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center px-4">
          <img
            src="/eden-imagotype.png"
            alt="Eden Protocol"
            width={68}
            className="mr-2 cursor-pointer"
            onClick={() => {
              router.push(logoLink);
            }}
          />
          <div className="ml-auto">
            <UserButton />
          </div>
        </div>
      </nav>

      <main className="pt-16">{children}</main>
    </div>
  );
};

export default AppUserLayout;

const UserButton = () => {
  const { currentUser } = useContext(UserContext);

  const handleLogout = () => {
    signOut();
    localStorage.removeItem("eden_access_token");
  };

  return currentUser ? (
    <div className={"relative"}>
      <div className="z-10">
        <MenuDropdown
          positionX="left"
          positionY="bottom"
          clickableElement={
            <div className="flex items-center">
              <div className="mr-2 inline-block">
                <Avatar size="xs" src={currentUser.discordAvatar!} />
              </div>
              <span className="font-Moret whitespace-nowrap font-bold">
                {currentUser.discordName}
              </span>
            </div>
          }
        >
          {[
            <li
              key={1}
              className="text-edenGray-700 hover:bg-edenGreen-100 border-edenGray-100 cursor-pointer border-b px-4 py-1 text-sm"
              onClick={handleLogout}
            >
              <FiLogOut className="inline pb-px" size={16} />
              {" log out"}
            </li>,
          ]}
        </MenuDropdown>
      </div>
    </div>
  ) : null;
};
