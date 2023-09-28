import { UserContext } from "@eden/package-context";
import { Avatar, MenuDropdown } from "@eden/package-ui";
import Image from "next/image";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { useContext } from "react";
import { FiLogOut } from "react-icons/fi";

export interface LeftNavProps {
  logoLink?: string;
}

export const LeftNav = ({ logoLink = "/" }: LeftNavProps) => {
  const router = useRouter();

  return (
    <nav className="transition-width fixed left-0 top-0 z-30 flex h-screen flex-col ease-in-out">
      {/* ---- Eden logo section ---- */}
      <section className="border-edenPink-500 relative flex h-[4.5rem] items-center p-4">
        <Image
          src="/eden-logo.png"
          alt=""
          width={30}
          height={30}
          className="cursor-pointer"
          onClick={() => {
            router.push(logoLink);
          }}
        />
      </section>

      {/* ---- Talent Pools Section ---- */}
      <section className="scrollbar-hide relative mb-auto max-h-[calc(100vh-15rem)] overflow-y-scroll px-4 py-8"></section>

      {/* ---- User Button Section ---- */}
      <section>
        <UserButton />
      </section>
    </nav>
  );
};

const UserButton = () => {
  const { currentUser } = useContext(UserContext);

  const handleLogout = () => {
    signOut();
    localStorage.removeItem("eden_access_token");
  };

  return currentUser ? (
    <div className="border-edenPink-500 flex h-[5.5rem] items-center  p-4">
      <div className={"relative mr-auto flex w-2/3 items-center"}>
        <div className="z-10">
          <MenuDropdown
            positionX="right"
            positionY="top"
            clickableElement={
              <Avatar size="xs" src={currentUser.discordAvatar!} />
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
    </div>
  ) : null;
};
