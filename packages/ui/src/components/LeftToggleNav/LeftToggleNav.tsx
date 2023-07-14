/* eslint-disable no-unused-vars */
import { UserContext } from "@eden/package-context";
import { Avatar, LoginButton } from "@eden/package-ui";
import { classNames } from "@eden/package-ui/utils";
import Image from "next/image";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { useContext, useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";

export interface LeftToggleNavProps {
  unwrapped: boolean;
  logoLink?: string;
  onToggleNav?: () => void;
}

export const LeftToggleNav = ({
  unwrapped = false,
  logoLink = "/",
  onToggleNav,
}: LeftToggleNavProps) => {
  const router = useRouter();

  return (
    <nav
      className={classNames(
        "flex flex-col absolute left-0 top-0 h-screen bg-edenPink-400 ease-in-out transition-width",
        unwrapped ? "w-56" : "w-16"
      )}
    >
      <section className="flex items-center relative p-4 border-b border-edenPink-500 h-[4.5rem]">
        {unwrapped ? (
          <span
            className="text-2xl text-edenGreen-600 font-Moret font-bold cursor-pointer"
            onClick={() => {
              router.push(logoLink);
            }}
          >
            Eden
          </span>
        ) : (
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
        )}
        <div
          className="w-6 -mb-px h-6 color-edenGreen-600 bg-edenPink-500 absolute -right-2 -bottom-3 z-10 flex h-12 w-5 cursor-pointer items-center justify-center rounded-md"
          onClick={onToggleNav}
        >
          {unwrapped ? (
            <BsChevronLeft className="w-3" />
          ) : (
            <BsChevronRight className="w-3" />
          )}
        </div>
      </section>
      <section></section>
      <section className="mt-auto">
        <UserButton unwrapped={unwrapped} />
      </section>
    </nav>
  );
};

export interface UserButtonProps {
  unwrapped: boolean;
}

const UserButton = ({ unwrapped }: UserButtonProps) => {
  const { currentUser } = useContext(UserContext);

  const handleLogout = () => {
    signOut();
    localStorage.removeItem("eden_access_token");
  };

  return currentUser ? (
    <div
      className={classNames(
        "flex p-4 items-center h-[5.5rem] border-t border-edenPink-500",
        unwrapped ? "" : "justify-center"
      )}
    >
      {unwrapped && (
        <div className={"w-2/3 flex items-center mr-auto"}>
          {currentUser.discordAvatar && (
            <Avatar size="xs" src={currentUser.discordAvatar} />
          )}
          <span className="ml-2 font-Moret text-edenGreen-600">
            {currentUser.discordName}
          </span>
        </div>
      )}
      <FiLogOut className="cursor-pointer" size={20} onClick={handleLogout} />
    </div>
  ) : null;
};
