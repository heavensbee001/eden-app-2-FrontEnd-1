import {
  DynamicConnectButton,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { DynamicSessionContext } from "@eden/package-context";
import { AppUserLayout, EdenAiProcessingModal, SEO } from "@eden/package-ui";
import { getCookieFromContext } from "@eden/package-ui/utils";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactElement, useContext, useMemo, useState } from "react";

import { NextPageWithLayout } from "../_app";

const LoginPage: NextPageWithLayout = ({
  // eslint-disable-next-line no-unused-vars
  redirect,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { edenSession } = useContext(DynamicSessionContext);
  const [redirecting, setRedirecting] = useState<boolean>(false);

  useMemo(() => {
    if (edenSession) {
      setRedirecting(true);
      router.push(redirect);
    }
  }, [edenSession]);

  return (
    <>
      <SEO title={`Eden protocol`} />
      <Head>
        <title>Eden protocol</title>
      </Head>
      <div
        className={`flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden pb-16`}
      >
        <DynamicWidget innerButtonComponent="Log in" />
        {heroImage}
        <h1 className="text-bold text-edenGreen-600 mb-4 flex items-center justify-center text-center text-4xl">
          Hey 👋, so good to see you!
        </h1>
        <h2 className="text-bold text-edenGreen-600 mb-12 text-center">
          {"✨ Let's create some work-you-love-magic! ✨"}
        </h2>
        <DynamicConnectButton>
          <span>Log in</span>
        </DynamicConnectButton>
        <EdenAiProcessingModal title="Redirecting" open={redirecting} />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = getCookieFromContext(ctx);
  const { redirect } = ctx.query;

  // let redirectUrl = "/";

  // if (
  //   redirect &&
  //   typeof redirect === "string" &&
  //   redirect.startsWith("_next")
  // ) {
  //   redirectUrl = "/";
  // } else if (redirect && typeof redirect === "string") {
  //   redirectUrl = redirect;
  // }

  if (session) {
    return {
      redirect: {
        destination: redirect || "/developer-dao/jobs",
        permanent: false,
      },
      props: {},
    };
  }

  return {
    props: {
      redirect: redirect || "/developer-dao/jobs",
    },
  };
};

LoginPage.getLayout = (page: ReactElement) => (
  <AppUserLayout>{page}</AppUserLayout>
);

export default LoginPage;

const heroImage = (
  <svg
    width="94"
    height="70"
    viewBox="0 0 94 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mx-auto mb-4"
  >
    <path
      d="M25.65 57.7805C31.45 61.4805 37.95 62.2805 47.1 62.2805C56.35 62.2805 62.75 60.7805 68.6 57.3805C66.2 64.4805 58.4 69.1805 47.1 69.1805C35.75 69.1805 28 64.4805 25.65 57.7805Z"
      fill="#00462C"
    />
    <circle cx="18.5" cy="18.5" r="18.5" fill="#00462C" />
    <path
      d="M16.2251 3.69995C16.3785 5.1062 16.4554 6.43505 16.5575 8.19897C16.7109 10.8827 17.4011 12.7231 18.5004 15.4582C19.5994 12.7231 20.315 10.8827 20.4685 8.19897C20.5709 6.43491 20.6474 5.10606 20.7753 3.69995H16.2251Z"
      fill="#F9E1ED"
    />
    <path
      d="M6.42626 9.64343C7.52903 10.5293 8.52313 11.4146 9.84253 12.5897C11.8487 14.379 13.6381 15.1923 16.3495 16.349C15.1925 13.6379 14.3971 11.8303 12.6081 9.82436C11.4332 8.50468 10.5476 7.51086 9.64368 6.42602L6.42626 9.64343Z"
      fill="#F9E1ED"
    />
    <path
      d="M3.7002 20.775C5.10644 20.6216 6.43529 20.5448 8.19922 20.4426C10.8829 20.2892 12.7234 19.599 15.4585 18.4997C12.7234 17.4007 10.8829 16.6851 8.19922 16.5317C6.43529 16.4294 5.10644 16.3528 3.7002 16.2249V20.775Z"
      fill="#F9E1ED"
    />
    <path
      d="M9.64368 30.5739C10.5295 29.4711 11.4148 28.477 12.59 27.1576C14.3792 25.1515 15.1925 23.362 16.3492 20.6507C13.6381 21.8076 11.8306 22.603 9.8246 24.3921C8.50492 25.567 7.5111 26.4525 6.42626 27.3565L9.64368 30.5739Z"
      fill="#F9E1ED"
    />
    <path
      d="M20.7753 33.2999C20.6219 31.8937 20.545 30.5649 20.4429 28.8009C20.2895 26.1172 19.5993 24.2768 18.5 21.5417C17.401 24.2768 16.6853 26.1172 16.5319 28.8009C16.4295 30.565 16.353 31.8938 16.2251 33.2999H20.7753Z"
      fill="#F9E1ED"
    />
    <path
      d="M30.5741 27.3565C29.4714 26.4706 28.4773 25.5853 27.1579 24.4102C25.1517 22.6209 23.3622 21.8076 20.6509 20.6509C21.8079 23.362 22.6033 25.1696 24.3923 27.1755C25.5672 28.4952 26.4528 29.489 27.3567 30.5739L30.5741 27.3565Z"
      fill="#F9E1ED"
    />
    <path
      d="M33.3002 16.2249C31.8939 16.3783 30.5651 16.4551 28.8012 16.5573C26.1175 16.7107 24.277 17.4009 21.5419 18.5002C24.277 19.5992 26.1175 20.3148 28.8012 20.4682C30.5652 20.5706 31.8941 20.6472 33.3002 20.775V16.2249Z"
      fill="#F9E1ED"
    />
    <path
      d="M27.3567 6.42602C26.4709 7.52878 25.5856 8.52288 24.4104 9.84228C22.6212 11.8484 21.8079 13.6379 20.6512 16.3492C23.3622 15.1923 25.1698 14.3969 27.1758 12.6078C28.4955 11.4329 29.4893 10.5474 30.5741 9.64343L27.3567 6.42602Z"
      fill="#F9E1ED"
    />
    <path
      d="M18.5003 20.6728C19.7002 20.6728 20.673 19.7 20.673 18.5C20.673 17.3001 19.7002 16.3273 18.5003 16.3273C17.3003 16.3273 16.3275 17.3001 16.3275 18.5C16.3275 19.7 17.3003 20.6728 18.5003 20.6728Z"
      fill="#F9E1ED"
    />
    <circle cx="75.5" cy="18.5" r="18.5" fill="#00462C" />
    <path
      d="M75.5002 20.7457C76.7405 20.7457 77.7459 19.7402 77.7459 18.5C77.7459 17.2597 76.7405 16.2542 75.5002 16.2542C74.2599 16.2542 73.2545 17.2597 73.2545 18.5C73.2545 19.7402 74.2599 20.7457 75.5002 20.7457Z"
      fill="#F9E1ED"
    />
    <path
      d="M76.8593 3.69995C74.9187 3.69995 73.5293 4.27249 72.9298 4.55883L74.0802 9.52502C75.4215 6.6365 77.0276 5.20397 77.8897 5.20397C78.0333 5.20397 78.1771 5.25088 78.1771 5.53833C78.1771 6.56377 76.5956 8.33067 75.6381 9.47686C74.8951 10.3603 74.344 11.1956 74.344 12.1507C74.344 12.9859 74.7514 13.9656 75.5181 15.0638C75.5416 13.7743 76.8358 12.891 78.0581 11.9359C79.735 10.6231 81.1009 9.4534 81.1009 7.18558C81.1009 4.82158 79.5912 3.69995 76.8593 3.69995Z"
      fill="#F9E1ED"
    />
    <path
      d="M66.0003 7.05811C64.6328 8.42515 64.0587 9.80884 63.8388 10.4335L68.1618 13.1344C67.0641 10.1473 67.1826 8.00296 67.79 7.39578C67.8912 7.2946 68.0257 7.2266 68.229 7.42978C68.9542 8.15479 69.0894 10.5182 69.2255 12.003C69.3267 13.1511 69.5292 14.1299 70.2046 14.8051C70.7954 15.3958 71.7753 15.8013 73.0922 16.0378C72.1969 15.1096 72.484 13.5732 72.6698 12.037C72.9229 9.9275 73.0581 8.13828 71.4543 6.53475C69.7823 4.86322 67.9254 5.13372 66.0003 7.05811Z"
      fill="#F9E1ED"
    />
    <path
      d="M60.7002 17.1408C60.7002 19.0814 61.2727 20.471 61.5591 21.0703L66.5253 19.9199C63.6367 18.5786 62.2042 16.9725 62.2042 16.1105C62.2042 15.9668 62.2511 15.8231 62.5386 15.8231C63.564 15.8231 65.3309 17.4045 66.4771 18.362C67.3606 19.1051 68.1958 19.6562 69.1509 19.6562C69.9862 19.6562 70.9658 19.2487 72.064 18.4821C70.7746 18.4585 69.8913 17.1643 68.9362 15.942C67.6233 14.2652 66.4536 12.8992 64.1858 12.8992C61.8218 12.8992 60.7002 14.4088 60.7002 17.1408Z"
      fill="#F9E1ED"
    />
    <path
      d="M64.0584 27.9999C65.4254 29.3673 66.8091 29.9415 67.4338 30.1614L70.1347 25.8384C67.1476 26.9361 65.0032 26.8175 64.396 26.2101C64.2948 26.1089 64.2268 25.9744 64.43 25.7712C65.155 25.0459 67.5184 24.9107 69.0033 24.7747C70.1513 24.6735 71.1302 24.4709 71.8053 23.7956C72.396 23.2047 72.8015 22.2249 73.038 20.908C72.1098 21.8033 70.5735 21.5162 69.0373 21.3303C66.9277 21.0772 65.1385 20.942 63.535 22.5459C61.8635 24.2179 62.134 26.0748 64.0584 27.9999Z"
      fill="#F9E1ED"
    />
    <path
      d="M74.141 33.2999C76.0816 33.2999 77.4713 32.7274 78.0706 32.4411L76.9202 27.4749C75.5789 30.3634 73.9728 31.7959 73.1107 31.7959C72.9671 31.7959 72.8233 31.749 72.8233 31.4616C72.8233 30.4361 74.4048 28.6692 75.3622 27.523C76.1053 26.6396 76.6564 25.8043 76.6564 24.8492C76.6564 24.014 76.249 23.0343 75.4823 21.9361C75.4588 23.2256 74.1646 24.1089 72.9423 25.064C71.2654 26.3768 69.8995 27.5465 69.8995 29.8143C69.8995 32.1783 71.409 33.2999 74.141 33.2999Z"
      fill="#F9E1ED"
    />
    <path
      d="M85.0001 29.9418C86.3675 28.5748 86.9417 27.1911 87.1616 26.5664L82.8386 23.8655C83.9363 26.8526 83.8177 28.9969 83.2104 29.6041C83.1092 29.7053 82.9747 29.7733 82.7714 29.5701C82.0462 28.8451 81.911 26.4817 81.7749 24.9969C81.6737 23.8488 81.4712 22.87 80.7958 22.1948C80.205 21.6041 79.2251 21.1986 77.9082 20.9621C78.8035 21.8903 78.5164 23.4267 78.3305 24.9629C78.0775 27.0724 77.9422 28.8616 79.5461 30.4651C81.2181 32.1367 83.075 31.8662 85.0001 29.9418Z"
      fill="#F9E1ED"
    />
    <path
      d="M90.3002 19.8591C90.3002 17.9185 89.7277 16.5289 89.4413 15.9296L84.4751 17.08C87.3636 18.4213 88.7962 20.0274 88.7962 20.8894C88.7962 21.0331 88.7493 21.1768 88.4618 21.1768C87.4364 21.1768 85.6695 19.5954 84.5233 18.6379C83.6398 17.8948 82.8046 17.3437 81.8495 17.3437C81.0142 17.3437 80.0346 17.7512 78.9364 18.5178C80.2258 18.5414 81.1091 19.8356 82.0642 21.0579C83.3771 22.7347 84.5467 24.1007 86.8146 24.1007C89.1786 24.1007 90.3002 22.5911 90.3002 19.8591Z"
      fill="#F9E1ED"
    />
    <path
      d="M86.942 9.00003C85.575 7.6326 84.1913 7.05842 83.5666 6.83853L80.8657 11.1615C83.8528 10.0638 85.9972 10.1824 86.6044 10.7898C86.7055 10.891 86.7735 11.0255 86.5704 11.2287C85.8454 11.9539 83.482 12.0892 81.9971 12.2252C80.8491 12.3264 79.8702 12.529 79.195 13.2043C78.6044 13.7952 78.1988 14.775 77.9624 16.0919C78.8905 15.1966 80.4269 15.4837 81.9631 15.6696C84.0726 15.9227 85.8619 16.0579 87.4654 14.4541C89.1369 12.782 88.8664 10.9251 86.942 9.00003Z"
      fill="#F9E1ED"
    />
  </svg>
);
