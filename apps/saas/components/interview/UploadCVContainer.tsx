import { Position } from "@eden/package-graphql/generated";
import { CVUploadGPT } from "@eden/package-ui";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { AiOutlineEyeInvisible } from "react-icons/ai";

interface UploadCVContainerProps {
  setTitleRole: Dispatch<SetStateAction<string>>;
  setTopSkills: Dispatch<SetStateAction<any>>;
  setContent: Dispatch<SetStateAction<any>>;
  handleCvEnd: () => void;
  position: Position;
}

const UploadCVContainer = ({
  setTitleRole,
  setTopSkills,
  setContent,
  handleCvEnd,
  position,
}: UploadCVContainerProps) => {
  const router = useRouter();
  const { positionID } = router.query;

  const handleDataFromCVUploadGPT = (data: any) => {
    const role = data.saveCVtoUser.titleRole;
    const skills = data.saveCVtoUser.mainSkills;

    setTitleRole(role);
    setTopSkills(skills);
    setContent({
      matchPercentage: data.saveCVtoUser.matchPercentage,
      improvementPoints: data.saveCVtoUser.improvementPoints,
      strongFit: data.saveCVtoUser.strongFit,
      growthAreas: data.saveCVtoUser.growthAreas,
      experienceAreas: data.saveCVtoUser.experienceAreas,
    });
  };
  const [recaptcha, setRecaptcha] = useState<string | null>(null);

  return (
    <div className="pt-8">
      <section className="grid grid-cols-3 gap-6">
        <div className="bg-edenPink-100 col-span-1 h-full rounded-md py-4 px-8">
          <h3 className="text-edenGreen-600 mb-4 text-center text-2xl font-semibold">
            Min Requirements
          </h3>
          <ul className="text-edenGray-900 list-disc pl-4 text-sm">
            {position?.positionsRequirements?.roleDescription
              ?.slice(0, 10)
              .map((item, index) => (
                <li key={index} className="mb-2">
                  {item}
                </li>
              ))}
          </ul>
        </div>
        <div className="bg-edenPink-100 col-span-1 h-full rounded-md py-4 px-8">
          <h3 className="text-edenGreen-600 mb-4 text-center text-2xl font-semibold">
            Benefits & Perks
          </h3>
          <ul className="text-edenGray-900 list-disc pl-4 text-sm">
            {position?.positionsRequirements?.benefits
              ?.slice(0, 10)
              .map((item, index) => (
                <li key={index} className="mb-2">
                  {item}
                </li>
              ))}
          </ul>
        </div>
        <div className="bg-edenPink-300 col-span-1 h-full rounded-md py-4 px-8">
          <div className="h-8 w-8 rounded-md bg-edenPink-100 text-edenGray-900 flex items-center justify-center mx-auto">
            <AiOutlineEyeInvisible size={"1.4rem"} />
          </div>
          <h3 className="text-edenGreen-600 text-center text-2xl font-semibold mb-4">
            Upload Resume to
            <br /> get instant feedback
          </h3>
          <ul className="text-edenGray-900 list-disc pl-4 text-sm">
            <li className="mb-2">Probability of landing this opportunity</li>
            <li className="mb-2">What to not miss to maximize your chances</li>
            <li className="mb-2">Strong suit about your profile</li>
          </ul>
        </div>
      </section>
      <section className="mb-4 flex h-[25vh] w-full flex-col items-center justify-center rounded-md p-4">
        {!recaptcha && ReCAPTCHA ? (
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_CAPTCHA_KEY || ""}
            onChange={(val: any) => {
              if (val) {
                setRecaptcha(val);
              }
            }}
          />
        ) : (
          <CVUploadGPT
            onDataReceived={handleDataFromCVUploadGPT}
            handleEnd={handleCvEnd}
            positionID={positionID}
          />
        )}
      </section>
    </div>
  );
};

export default UploadCVContainer;
