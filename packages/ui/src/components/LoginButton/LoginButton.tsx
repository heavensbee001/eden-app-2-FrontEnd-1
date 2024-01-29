import {
  DynamicConnectButton,
  useDynamicContext,
} from "@dynamic-labs/sdk-react-core";
import { UserContext } from "@eden/package-context";
import { Avatar } from "@eden/package-ui";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import { Fragment, useContext } from "react";

const menuItems = [
  {
    name: "🏠  Home",
    href: "/home",
  },
  {
    name: "🧑‍🚀  My profile",
    href: "/profile",
  },
  // {
  //   name: "⭐️  Find a project",
  //   href: "/projects",
  // },
  // {
  //   name: "🎯  Active applications",
  //   href: "/applications",
  // },
  // {
  //   name: "🚀  Launch A Project",
  //   href: "/create-project",
  // },
  // {
  //   name: "🏆  Champion Projects",
  //   href: "/champion-board",
  // },
];

export interface ILoginButtonProps {
  inApp?: boolean;
}

export const LoginButton = ({ inApp }: ILoginButtonProps) => {
  const router = useRouter();
  const { currentUser } = useContext(UserContext);
  const { handleLogOut } = useDynamicContext();

  return (
    <div className="top-16 z-50 text-right">
      <Menu as="div" className="relative inline-block text-left">
        <>
          {currentUser ? (
            <Menu.Button className="bg-soilGreen-700 hover:bg-soilGreen-500 inline-flex w-full justify-center rounded-full text-sm font-medium text-black/70 shadow hover:text-black ">
              <div className={`flex items-center p-[2px]`}>
                <Avatar size={`xs`} src={currentUser?.discordAvatar || ""} />
              </div>
              <div className={`mx-5 my-auto font-semibold`}>
                {currentUser?.discordName || ""}
              </div>
              <ChevronDownIcon
                className="hover:black my-auto ml-2 mr-2 h-5 w-5 "
                aria-hidden="true"
              />
            </Menu.Button>
          ) : (
            <DynamicConnectButton buttonClassName="w-40 mb-6 py-2 px-4 font-Moret text-lg rounded-md font-bold bg-edenGreen-600 text-white hover:bg-edenGreen-300 hover:text-edenGreen-600 disabled:!text-edenGray-500 disabled:!bg-edenGray-100">
              <span>Log in</span>
            </DynamicConnectButton>
          )}
        </>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="text-semibold absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1">
              {inApp && (
                <>
                  <div className={`flex p-2`}>
                    <div>
                      <Avatar
                        size={`sm`}
                        src={currentUser?.discordAvatar || ""}
                      />
                    </div>
                    <div
                      className={`font-Unica my-auto ml-4 text-lg font-semibold`}
                    >
                      {currentUser?.discordName}
                    </div>
                  </div>
                  {menuItems.map((item, index) => (
                    <Menu.Item key={index}>
                      {({ active }) => (
                        <button
                          onClick={() => router.push(item.href)}
                          className={`${
                            active ? "bg-zinc-700 text-white" : "text-gray-900"
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          {item.name}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </>
              )}
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => {
                      handleLogOut();
                      localStorage.removeItem("eden_access_token");
                    }}
                    className={`${
                      active ? "bg-zinc-700 text-white" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    ⛔ Log Out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};
