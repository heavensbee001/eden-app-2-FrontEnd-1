/* eslint-disable no-unused-vars */
import {
  CompanyContext,
  DiscoverActionKind,
  UserContext,
} from "@eden/package-context";
import { Avatar, Button, LoginButton } from "@eden/package-ui";
import { classNames } from "@eden/package-ui/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { useContext, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { HiCodeBracket } from "react-icons/hi2";

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
  const { company } = useContext(CompanyContext);

  return (
    <nav
      className={classNames(
        "flex flex-col fixed left-0 top-0 h-screen bg-edenPink-400 ease-in-out transition-width",
        unwrapped ? "w-[14.5rem]" : "w-16"
      )}
    >
      {/* ---- Eden logo section ---- */}
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

      {/* ---- Talent Pools Section ---- */}
      <section className="relative px-4 py-8 mb-auto">
        <h3
          className={classNames(
            "mb-4 overflow-hidden whitespace-nowrap ease-in-out transition-height",
            unwrapped ? "h-6" : "h-0"
          )}
        >
          Your Talent Pools
        </h3>
        {company &&
          company.positions &&
          company.positions.map((position, index) => (
            <Link
              key={index}
              href={`/${company.slug}/dashboard/${position?._id}`}
            >
              <div
                className={classNames(
                  "relative flex justify-center items-center w-[calc(100%+2rem)] min-h-[3rem] -mx-4 px-4 py-2 hover:bg-edenPink-200",
                  unwrapped ? "border-b border-edenPink-500" : "",
                  router.query.positionID === position?._id
                    ? "bg-edenPink-200"
                    : ""
                )}
              >
                {router.query.positionID === position?._id && (
                  <div className="absolute left-0 top-0 h-full w-1 bg-edenGreen-500"></div>
                )}
                <div className="w-6 h-6 rounded-md bg-white bg-opacity-30 text-edenGreen-500 flex justify-center items-center">
                  <HiCodeBracket size={"1rem"} />
                </div>
                {unwrapped && (
                  <div className="ml-2 mr-auto">
                    <p className="text-sm font-bold whitespace-nowrap">
                      {position?.name}
                    </p>
                    <p className="text-xs text-edenGray-700 whitespace-nowrap">
                      {company?.name}
                    </p>
                  </div>
                )}
              </div>
            </Link>
          ))}
      </section>

      {/* ---- User Button Section ---- */}
      <section className="pt-4 h-20">
        <Button
          className={classNames(
            "mx-auto flex items-center whitespace-nowrap",
            unwrapped ? "" : "!px-2"
          )}
          onClick={() => {
            // handle add talent pool
          }}
        >
          <BiPlus size={"1.3rem"} className="" />
          {unwrapped && <span className="ml-1 font-Moret">Add Pool</span>}
        </Button>
      </section>

      {/* ---- User Button Section ---- */}
      <section className="">
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
