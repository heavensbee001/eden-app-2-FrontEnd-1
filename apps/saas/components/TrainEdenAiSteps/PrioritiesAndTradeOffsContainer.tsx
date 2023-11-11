"use-client";

import { gql, useQuery } from "@apollo/client";
import {
  Position,
  PrioritiesType,
  TradeOffsType,
} from "@eden/package-graphql/generated";
import {
  EdenAiProcessingModal,
  EdenIconExclamation,
  EdenTooltip,
} from "@eden/package-ui";
import { classNames } from "@eden/package-ui/utils";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

export const FIND_PRIORITIES_TRAIN_EDEN_AI = gql`
  query findPrioritiesTrainEdenAI($fields: findPrioritiesTrainEdenAIInput) {
    findPrioritiesTrainEdenAI(fields: $fields) {
      success
      priorities {
        priority
        reason
      }
      tradeOffs {
        tradeOff1
        tradeOff2
        reason
        selected
      }
    }
  }
`;

interface IPrioritiesAndTradeOffsContainerProps {
  position: Position;
  // eslint-disable-next-line no-unused-vars
  onChange: (val: any) => void;
}

export const PrioritiesAndTradeOffsContainer = ({
  position,
  onChange,
}: IPrioritiesAndTradeOffsContainerProps) => {
  const router = useRouter();
  const { positionID } = router.query;

  const [priorities, setPriorities] = useState<PrioritiesType[]>([]);

  const [tradeOffs, setTradeOffs] = useState<TradeOffsType[]>([]);

  const { loading: loadingPriorities } = useQuery(
    FIND_PRIORITIES_TRAIN_EDEN_AI,
    {
      variables: {
        fields: {
          positionID: positionID,
        },
      },
      skip:
        !!position.positionsRequirements?.tradeOffs &&
        !!position.positionsRequirements?.tradeOffs.length &&
        !!position.positionsRequirements?.priorities &&
        !!position.positionsRequirements?.priorities.length,
      onCompleted({ findPrioritiesTrainEdenAI }) {
        setPriorities(findPrioritiesTrainEdenAI.priorities);
        setTradeOffs(
          (findPrioritiesTrainEdenAI?.tradeOffs! as TradeOffsType[]).map(
            (tradeOff: TradeOffsType) => {
              const _selected =
                tradeOff.selected == tradeOff.tradeOff1
                  ? tradeOff.tradeOff1!
                  : tradeOff.tradeOff2!;

              return { ...tradeOff, selected: _selected };
            }
          )! as TradeOffsType[]
        );
      },
    }
  );

  useMemo(() => {
    if (
      position.positionsRequirements?.priorities &&
      position.positionsRequirements?.tradeOffs &&
      position.positionsRequirements?.priorities.length > 0 &&
      position.positionsRequirements?.tradeOffs.length > 0
    ) {
      setPriorities(
        position.positionsRequirements?.priorities! as PrioritiesType[]
      );
      setTradeOffs(
        (position.positionsRequirements?.tradeOffs! as TradeOffsType[]).map(
          (tradeOff: TradeOffsType) => {
            const _selected =
              tradeOff.selected == tradeOff.tradeOff1
                ? tradeOff.tradeOff1!
                : tradeOff.tradeOff2!;

            return { ...tradeOff, selected: _selected };
          }
        )! as TradeOffsType[]
      );
    }
  }, []);

  const handleSelect = (index: number, option: string) => {
    const newTradeoffs = [...tradeOffs];

    newTradeoffs[index] = { ...newTradeoffs[index], selected: option };
    setTradeOffs(newTradeoffs);
  };

  const permutePriorities = (index1: number, index2: number) => {
    if (
      index1 < 0 ||
      index1 >= priorities.length ||
      index2 < 0 ||
      index2 >= priorities.length
    ) {
      throw new Error("Invalid index");
    }

    const newArray = [...priorities];

    [newArray[index1], newArray[index2]] = [newArray[index2], newArray[index1]];

    setPriorities(newArray);
  };

  useEffect(() => {
    if (
      priorities &&
      tradeOffs &&
      priorities.length > 0 &&
      tradeOffs.length > 0
    ) {
      onChange({ priorities: priorities, tradeOffs: tradeOffs });
    }
  }, [priorities, tradeOffs]);

  return (
    <div className="grid w-full grid-cols-12 gap-4">
      {loadingPriorities && (
        <EdenAiProcessingModal
          open={loadingPriorities}
          title="Understanding your Priorities & Tradeoffs"
        >
          <div className="text-center">
            <p>{`As any great recruiter would tell you, I understand the perfect match doesn't exist. It's all about your priorities & tradeoffs - so in a couple of seconds please work with me so we can be super aligned on this!`}</p>
          </div>
        </EdenAiProcessingModal>
      )}
      <section className="bg-edenPink-100 col-span-6 rounded-md px-12 py-4">
        <h2 className="text-edenGreen-600 mb-2 text-center">Key Priorities</h2>
        <p className="mb-6 text-center text-sm">
          {"Here's your priorities. Feel free to re-arrange"}
        </p>
        <ul className="">
          {priorities &&
            priorities.length > 0 &&
            priorities.map((priority, index) => (
              <li
                key={index}
                className="relative mb-2 rounded-md bg-white px-4 py-4"
              >
                <div className="relative flex w-full items-center">
                  <div className="mr-2">
                    <EdenTooltip
                      id={priority.reason!.split(" ").join("")}
                      innerTsx={
                        <div className="w-60">
                          <p>{priority.reason}</p>
                        </div>
                      }
                      place="right"
                      effect="solid"
                      backgroundColor="white"
                      border
                      borderColor="#e5e7eb"
                      padding="0.5rem"
                    >
                      <div className="bg-edenPink-200 h-6 w-6 rounded-full p-1 shadow-md">
                        <EdenIconExclamation className="h-full w-full" />
                      </div>
                    </EdenTooltip>
                  </div>
                  <div className="-my-2 mr-4">
                    <div
                      className={classNames(
                        "text-edenGreen-500 hover:text-edenGreen-300 cursor-pointer",
                        index === 0 ? "hidden" : "",
                        index === priorities.length - 1 ? "" : "-mb-2"
                      )}
                    >
                      <BiChevronUp
                        size={"1.5rem"}
                        onClick={() => {
                          permutePriorities(index, index - 1);
                        }}
                      />
                    </div>
                    <div
                      className={classNames(
                        "text-edenGreen-500 hover:text-edenGreen-300 cursor-pointer",
                        index === priorities.length - 1 ? "hidden" : "",
                        index === 0 ? "" : "-mt-2"
                      )}
                    >
                      <BiChevronDown
                        size={"1.5rem"}
                        onClick={() => {
                          permutePriorities(index, index + 1);
                        }}
                      />
                    </div>
                  </div>
                  <div className="">
                    {index + 1}. {priority.priority}
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </section>
      <section className="bg-edenPink-100 col-span-6 rounded-md px-12 py-4">
        <h2 className="text-edenGreen-600 mb-2 text-center">Tradeoffs</h2>
        <p className="mb-6 text-center text-sm">
          {"These are your tradeoff preferences. Adjust as you see fit"}
        </p>

        <div className="flex flex-col items-center justify-center">
          {tradeOffs &&
            tradeOffs.length > 0 &&
            tradeOffs.map((tradeOff, index) => (
              <div key={index} className="relative flex w-full items-center">
                <div className="mr-2">
                  <EdenTooltip
                    id={`tradeoff-${index}`}
                    innerTsx={
                      <div className="w-60">
                        <p>{tradeOff.reason}</p>
                      </div>
                    }
                    place="right"
                    effect="solid"
                    backgroundColor="white"
                    border
                    borderColor="#e5e7eb"
                    padding="0.5rem"
                    containerClassName="w-full"
                  >
                    <div className="bg-edenPink-200 h-6 w-6 rounded-full p-1 shadow">
                      <EdenIconExclamation className="h-full w-full" />
                    </div>
                  </EdenTooltip>
                </div>
                <div className="relative grid w-[calc(100%-2rem)] grid-cols-2">
                  <label
                    className={classNames(
                      "col-span-1 mb-2 flex w-full cursor-pointer items-center justify-center px-4 py-2 text-center transition-all ease-in-out",
                      tradeOffs[index].selected === tradeOff.tradeOff1
                        ? "text-edenGreen-500 border-edenGreen-300 scale-[1.05] rounded-md border bg-white"
                        : "bg-edenGreen-100 border-edenGreen-100 text-edenGray-500 rounded-bl-md rounded-tl-md border"
                    )}
                    htmlFor={`tradeoff-${index}-1`}
                  >
                    <div className="flex items-center justify-end">
                      <span className="">{tradeOff.tradeOff1}</span>
                      <input
                        type="radio"
                        className="ml-2 hidden"
                        id={`tradeoff-${index}-1`}
                        name={`tradeoff-${index}-1`}
                        value={tradeOff.tradeOff1!}
                        checked={
                          tradeOffs[index].selected === tradeOff.tradeOff1
                        }
                        onChange={() =>
                          handleSelect(index, tradeOff.tradeOff1!)
                        }
                      />
                    </div>
                  </label>
                  <label
                    className={classNames(
                      "col-span-1 mb-2 flex w-full cursor-pointer items-center justify-center px-4 py-2 text-center transition-all ease-in-out",
                      tradeOffs[index].selected === tradeOff.tradeOff2
                        ? "text-edenGreen-500 border-edenGreen-300 scale-[1.05] rounded-md border bg-white"
                        : "bg-edenGreen-100 border-edenGreen-100 text-edenGray-500 rounded-br-md rounded-tr-md border"
                    )}
                    htmlFor={`tradeoff-${index}-2`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        className="mr-2 hidden"
                        id={`tradeoff-${index}-2`}
                        name={`tradeoff-${index}-2`}
                        value={tradeOff.tradeOff2!}
                        checked={
                          tradeOffs[index].selected === tradeOff.tradeOff2
                        }
                        onChange={() =>
                          handleSelect(index, tradeOff.tradeOff2!)
                        }
                      />
                      <span className="">{tradeOff.tradeOff2}</span>
                    </div>
                  </label>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};
