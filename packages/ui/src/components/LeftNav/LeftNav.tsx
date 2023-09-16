import { gql, useMutation } from "@apollo/client";
import { CompanyContext, UserContext } from "@eden/package-context";
import { Avatar, Button, EdenAiProcessingModal } from "@eden/package-ui";
import { classNames } from "@eden/package-ui/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { IconPickerItem } from "react-fa-icon-picker";
import { BiPlus } from "react-icons/bi";
import {} from "react-icons/bs";
import { v4 as uuidv4 } from "uuid";

const UPDATE_POSITION = gql`
  mutation ($fields: updatePositionInput!) {
    updatePosition(fields: $fields) {
      _id
    }
  }
`;

export interface LeftNavProps {
  logoLink?: string;
  onToggleNav?: () => void;
}

export const LeftNav = ({
  logoLink = "/",
}: // onToggleNav,
LeftNavProps) => {
  const router = useRouter();
  const { company, getCompanyFunc } = useContext(CompanyContext);

  const [updatePositionLoading, setUpdatePositionLoading] =
    useState<boolean>(false);

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
    router.pathname.includes("/jobs") ||
    router.pathname.includes("/subscribe") ||
    router.pathname.includes("/interview/") ||
    router.pathname.includes("/create-company") ||
    router.pathname.includes("/train-eden-ai");

  const hideTalentPools =
    router.pathname.includes("/jobs") ||
    router.pathname.includes("/subscribe") ||
    router.pathname.includes("/interview/") ||
    router.pathname.includes("/create-company") ||
    router.pathname.includes("/train-eden-ai");

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
      <section className="scrollbar-hide relative mb-auto max-h-[calc(100vh-15rem)] overflow-y-scroll px-4 py-8">
        {company && !hideTalentPools && (
          <>
            <h3 className="transition-height mb-4 h-0 overflow-hidden whitespace-nowrap ease-in-out">
              Your Talent Pools
            </h3>
            {company &&
              company.positions &&
              company.positions
                .filter(
                  (_position) =>
                    _position?.status !== "ARCHIVED" &&
                    _position?.status !== "DELETED"
                )
                .map((position, index) => (
                  <Link
                    key={index}
                    href={`/${company.slug}/dashboard/${position?._id}`}
                  >
                    <div
                      className={classNames(
                        "hover:bg-edenPink-200 relative -mx-4 min-h-[3rem] w-[calc(100%+2rem)] px-4 py-2",
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
                      </div>
                    </div>
                  </Link>
                ))}
          </>
        )}
      </section>

      {/* ---- Create Position Button Section ---- */}
      {!hideCreatePosition && (
        <section className="h-20 pt-4">
          <Button
            className="mx-auto flex items-center whitespace-nowrap !px-2"
            onClick={handleCreatePosition}
          >
            <BiPlus size={"1.3rem"} className="" />
          </Button>
          {creatingPositionModal}
        </section>
      )}

      {/* ---- User Button Section ---- */}
      <section className={classNames(!company ? "mt-auto" : "")}>
        <UserButton />
      </section>
    </nav>
  );
};

const UserButton = () => {
  const { currentUser } = useContext(UserContext);

  return currentUser ? (
    <div className="border-edenPink-500 flex h-[5.5rem] items-center  p-4">
      <div className={"mr-auto flex w-2/3 items-center"}>
        <div className="z-10">
          {currentUser.discordAvatar && (
            <Avatar size="xs" src={currentUser.discordAvatar} />
          )}
        </div>
      </div>
    </div>
  ) : null;
};
