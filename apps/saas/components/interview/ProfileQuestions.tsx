"use client";

import { UserContext } from "@eden/package-context";
import { Members } from "@eden/package-graphql/generated";
import { locations } from "@eden/package-ui/utils/locations";
import { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface IProfileQuestionsContainerProps {
  // eslint-disable-next-line no-unused-vars
  onChange: (val: any) => void;
}

const ProfileQuestionsContainer = ({
  onChange,
}: IProfileQuestionsContainerProps) => {
  const { currentUser } = useContext(UserContext);
  const [userState, setUserState] = useState<Members>();
  // const [valid, setValid] = useState<boolean>(false);
  // const router = useRouter();
  // eslint-disable-next-line no-unused-vars
  // const [submitting, setSubmitting] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const { register, watch, control, setValue, getValues } = useForm<Members>({
    defaultValues: { ...currentUser },
  });

  useEffect(() => {
    if (currentUser) {
      setUserState(currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    const subscription = watch((data: any) => {
      // console.log("WATCH ---- data", data);
      if (data) setUserState(data as Members);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  // useEffect(() => {
  //   if (
  //     userState?.budget?.perHour &&
  //     userState?.hoursPerWeek &&
  //     userState?.location &&
  //     userState?.timeZone &&
  //     (userState?.experienceLevel?.years ||
  //       userState?.experienceLevel?.years === 0) &&
  //     (userState?.experienceLevel?.total ||
  //       userState?.experienceLevel?.years === 0)
  //   ) {
  //     console.log("VALID");

  //     setValid(true);
  //   } else {
  //     console.log("NOT VALID");

  //     setValid(false);
  //   }
  // }, [userState]);

  useEffect(() => {
    onChange(userState);
  }, [userState]);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-8">
        <section className="mb-4 mr-12 inline-block">
          <p className="mb-2 text-xs">Your Desired Salary</p>
          <div className="border-EdenGray-100 flex w-48 items-center rounded-md border bg-white text-xs">
            <input
              min={0}
              defaultValue={currentUser?.budget?.perHour || ""}
              type="number"
              id="budget"
              className="font-Unica h-full w-full resize-none bg-transparent p-2 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              required
              {...register("budget.perHour")}
            />
            <div className="border-edenGray-100 ml-auto border-l px-3">
              <span>$/year</span>
            </div>
          </div>
        </section>
        <section className="mb-4 inline-block">
          <p className="mb-2 text-xs">Your Availability</p>
          <div className="border-EdenGray-100 flex w-48 items-center rounded-md border bg-white text-xs">
            <input
              type="number"
              defaultValue={currentUser?.hoursPerWeek || ""}
              min={0}
              max={40}
              id="hoursPerWeek"
              className="font-Unica h-full w-full resize-none bg-transparent p-2 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              required
              {...register("hoursPerWeek")}
            />
            <div className="border-edenGray-100 ml-auto border-l px-3">
              <span>hours/week</span>
            </div>
          </div>
        </section>
      </div>
      <div className="mb-8">
        <section className="mb-4 inline-block w-4/5 pr-12">
          <p className="mb-2 text-xs">Your Location</p>
          <div className="border-EdenGray-100 flex w-full items-center rounded-md border bg-white text-xs">
            <input
              type="text"
              defaultValue={currentUser?.location || ""}
              id="location"
              className="h-[34px] w-full bg-transparent p-2"
              required
              {...register("location")}
            />
          </div>
        </section>
        <section className="mb-4 inline-block w-1/5">
          <p className="font-Unica mb-2 h-full resize-none bg-transparent text-xs outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none">
            Your Timezone
          </p>
          <div className="border-EdenGray-100 flex w-full items-center rounded-md border bg-white text-xs">
            <Controller
              name={"timeZone"}
              control={control}
              render={() => (
                <select
                  defaultValue={
                    currentUser?.timeZone && currentUser?.location
                      ? `(${currentUser?.timeZone}) ${currentUser?.location}`
                      : ""
                  }
                  id="timeZone"
                  className="font-Unica h-full w-full resize-none bg-transparent p-2 outline-none"
                  required
                  onChange={(e) => {
                    const _gmt = e.target.value.split(" ")[0].slice(1, -1);

                    // const _location = e.target.value
                    //   .split(" ")
                    //   .splice(1)
                    //   .join(" ");

                    setValue("timeZone", _gmt);
                    // setValue("location", _location);
                  }}
                >
                  <option value={""} disabled hidden>
                    Select a location...
                  </option>
                  {locations.map((loc, index) => (
                    <option
                      value={`(${loc.gmt}) ${loc.location}`}
                      key={index}
                    >{`(${loc.gmt}) ${loc.location}`}</option>
                  ))}
                </select>
              )}
            />
          </div>
        </section>
      </div>
      <div className="mb-8">
        <section className="mb-4 mr-12 inline-block">
          <p className="mb-2 text-xs">Years of Experience</p>
          <div className="border-EdenGray-100 flex w-48 items-center rounded-md border bg-white text-xs">
            <input
              type="number"
              defaultValue={currentUser?.experienceLevel?.years || ""}
              min={0}
              id="hoursPerWeek"
              className="font-Unica h-full w-full resize-none bg-transparent p-2 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              required
              {...register("experienceLevel.years")}
            />
            <div className="border-edenGray-100 ml-auto border-l px-3">
              <span>years</span>
            </div>
          </div>
        </section>
        <section className="mb-4 mr-12 inline-block">
          <p className="mb-2 text-xs">Experience Level</p>
          <div className="border-EdenGray-100 flex w-48 items-center rounded-md border bg-white text-xs">
            <Controller
              name={"experienceLevel"}
              control={control}
              render={() => {
                let _defaultValue: number | string = "";

                if (currentUser?.experienceLevel?.total == 3) _defaultValue = 3;
                if (currentUser?.experienceLevel?.total == 6) _defaultValue = 6;
                if (currentUser?.experienceLevel?.total == 9) _defaultValue = 9;

                return (
                  <select
                    id="experienceLevel"
                    className="font-Unica h-full w-full resize-none bg-transparent p-2 outline-none"
                    required
                    onChange={(e) => {
                      const _val = {
                        ...getValues("experienceLevel"),
                        total: +e.target.value,
                      };

                      setValue("experienceLevel", _val);
                    }}
                    defaultValue={_defaultValue}
                  >
                    <option value={""} disabled hidden>
                      Select one...
                    </option>
                    <option value={3}>Junior</option>
                    <option value={6}>Mid-level</option>
                    <option value={9}>Senior</option>
                  </select>
                );
              }}
            />
          </div>
        </section>
      </div>
      {/* <div className="absolute bottom-4 mx-auto z-20 w-full max-w-2xl text-center">
          <Button
            className="mx-auto"
            variant="primary"
            onClick={handleSubmit}
            disabled={!valid}
          >
            Submit
          </Button>
        </div> */}

      {/* {submitting && (
          <EdenAiProcessingModal title="Submitting" open={submitting} />
        )} */}
    </div>
  );
};

export default ProfileQuestionsContainer;
