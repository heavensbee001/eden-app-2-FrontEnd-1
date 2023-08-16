import { gql, useMutation } from "@apollo/client";
import { CompanyContext, UserContext } from "@eden/package-context";
import { Avatar, Button, EdenAiProcessingModal } from "@eden/package-ui";
import { classNames } from "@eden/package-ui/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { useContext, useState } from "react";
import { IconPickerItem } from "react-fa-icon-picker";
import { BiPlus } from "react-icons/bi";
import {
  BsChevronDown,
  BsChevronLeft,
  BsChevronRight,
  BsChevronUp,
} from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { v4 as uuidv4 } from "uuid";

const UPDATE_POSITION = gql`
  mutation ($fields: updatePositionInput!) {
    updatePosition(fields: $fields) {
      _id
    }
  }
`;

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
  const { company, getCompanyFunc } = useContext(CompanyContext);

  const [updatePositionLoading, setUpdatePositionLoading] =
    useState<boolean>(false);
  const [unwrappedPosition, setUnwrappedPosition] =
    useState<string | null>(null);

  const [updatePosition] = useMutation(UPDATE_POSITION, {
    onCompleted(updatePositionData) {
      getCompanyFunc();
      router
        .push(
          `/${company?.slug}/dashboard/${updatePositionData.updatePosition._id}/train-eden-ai`
        )
        .then(() => {
          setUpdatePositionLoading(false);
        });
    },
    onError() {
      setUpdatePositionLoading(false);
    },
  });

  const creatingPositionModal = (
    <EdenAiProcessingModal
      title="Creating position"
      open={updatePositionLoading}
    ></EdenAiProcessingModal>
  );

  const handleCreatePosition = () => {
    const randId = uuidv4();

    setUpdatePositionLoading(true);

    updatePosition({
      variables: {
        fields: {
          name: `New Opportunity ${randId}`,
          companyID: company?._id,
        },
      },
    });
  };

  const hideCreatePosition =
    router.pathname.includes("/interview/") ||
    router.pathname.includes("/train-eden-ai");

  return (
    <nav
      className={classNames(
        "bg-edenPink-400 transition-width fixed left-0 top-0 z-30 flex h-screen flex-col ease-in-out",
        unwrapped ? "w-[14.5rem]" : "w-16"
      )}
    >
      {/* ---- Eden logo section ---- */}
      <section className="border-edenPink-500 relative flex h-[4.5rem] items-center border-b p-4">
        {unwrapped ? (
          <span
            className="text-edenGreen-600 font-Moret cursor-pointer text-2xl font-bold"
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
          className="color-edenGreen-600 bg-edenPink-500 absolute -bottom-3 -right-2 z-10 -mb-px flex h-12 h-6 w-5 w-6 cursor-pointer items-center justify-center rounded-md"
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
      {company && (
        <section className="relative mb-auto max-h-[calc(100vh-15rem)] overflow-y-scroll scrollbar-hide px-4 py-8">
          <h3
            className={classNames(
              "transition-height mb-4 overflow-hidden whitespace-nowrap ease-in-out",
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
                    "hover:bg-edenPink-200 relative -mx-4 min-h-[3rem] w-[calc(100%+2rem)] px-4 py-2",
                    unwrapped ? "border-edenPink-500 border-b" : "",
                    router.query.positionID === position?._id
                      ? "bg-edenPink-200"
                      : ""
                  )}
                >
                  <div className="flex items-center justify-center">
                    {router.query.positionID === position?._id && (
                      <div className="bg-edenGreen-500 absolute left-0 top-0 h-full w-1"></div>
                    )}
                    <div className="text-edenGreen-500 flex h-6 w-6 items-center justify-center rounded-md bg-white bg-opacity-30">
                      <IconPickerItem
                        icon={position?.icon || "FaCode"}
                        size={"1rem"}
                        color="#00462C"
                      />
                    </div>
                    {unwrapped && (
                      <div className="ml-2 mr-auto w-full">
                        <div className="whitespace-nowrap text-sm font-bold">
                          {position?.name?.slice(0, 20)}
                          {position?.name?.length! > 20 ? "..." : ""}
                          {position?.talentList ? (
                            <div
                              onClick={(e) => {
                                e.preventDefault();
                                setUnwrappedPosition(
                                  unwrappedPosition === position?._id
                                    ? null
                                    : position._id!
                                );
                              }}
                              className="hover:bg-edenPink-500 flexitems-center absolute right-1 top-5 flex h-5 w-5 items-center justify-center justify-center rounded-full"
                            >
                              {unwrappedPosition === position?._id ? (
                                <BsChevronUp className="-mb-px w-3" />
                              ) : (
                                <BsChevronDown className="-mb-px w-3" />
                              )}
                            </div>
                          ) : null}
                        </div>
                        <p className="text-edenGray-700 whitespace-nowrap text-xs">
                          {company?.name}
                        </p>
                      </div>
                    )}
                  </div>
                  {unwrapped && unwrappedPosition === position?._id && (
                    <ul className="mb-2 mt-2 pl-6">
                      {[
                        { _id: "000", name: "All candidates" },
                        ...position?.talentList!,
                      ]?.map((_talentList, index) => (
                        <li key={index}>
                          <Link
                            href={`/${company.slug}/dashboard/${position?._id}${
                              _talentList?._id !== "000"
                                ? "?listID=" + _talentList?._id
                                : ""
                            }`}
                            className="text-xs hover:font-bold"
                          >
                            {_talentList?.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Link>
            ))}
        </section>
      )}

      {/* ---- Create Position Button Section ---- */}
      {!hideCreatePosition && (
        <section className="h-20 pt-4">
          <Button
            className={classNames(
              "mx-auto flex items-center whitespace-nowrap",
              unwrapped ? "" : "!px-2"
            )}
            onClick={handleCreatePosition}
          >
            <BiPlus size={"1.3rem"} className="" />
            {unwrapped && (
              <span className="font-Moret ml-1">Add Opportunity</span>
            )}
          </Button>
          {creatingPositionModal}
        </section>
      )}

      {/* ---- User Button Section ---- */}
      <section className={classNames(!company ? "mt-auto" : "")}>
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
        "border-edenPink-500 flex h-[5.5rem] items-center border-t p-4",
        unwrapped ? "" : "justify-center"
      )}
    >
      {unwrapped && (
        <div className={"mr-auto flex w-2/3 items-center"}>
          {currentUser.discordAvatar && (
            <Avatar size="xs" src={currentUser.discordAvatar} />
          )}
          <span className="font-Moret text-edenGreen-600 ml-2">
            {currentUser.discordName}
          </span>
        </div>
      )}
      <FiLogOut className="cursor-pointer" size={20} onClick={handleLogout} />
    </div>
  ) : null;
};
