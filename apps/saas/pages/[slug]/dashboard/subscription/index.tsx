// import { UserContext } from "@eden/package-context";
import { AppUserLayout, Button } from "@eden/package-ui";
import { classNames } from "@eden/package-ui/utils";
import axios from "axios";
import { IncomingMessage, ServerResponse } from "http";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
// import { useContext } from "react";
import { BiCheck, BiInfinite } from "react-icons/bi";
import {
  HiOutlineBuildingOffice,
  HiOutlineBuildingOffice2,
  HiOutlineBuildingStorefront,
} from "react-icons/hi2";
import { MdClose } from "react-icons/md";

import { IS_PRODUCTION } from "../../../../constants";
import type { NextPageWithLayout } from "../../../_app";

type PRODUCTS_TYPE = {
  name: string;
  description: string;
  icon: any;
  monthlyPrice: number;
  priceID: string;
  featured: boolean;
  features: {
    [key: string]: {
      [key: string]: {
        value: string | number | boolean;
        text: string;
      };
    };
  };
}[];

const PRODUCTS: PRODUCTS_TYPE = [
  {
    name: "Startup",
    description:
      "For those looking to build the future with likeminded people.",
    monthlyPrice: 500,
    priceID: IS_PRODUCTION
      ? "price_1NreSZBxX85c6z0CXzCngNS2"
      : "price_1NnKzqBxX85c6z0CuUKA0uku",
    featured: false,
    icon: <HiOutlineBuildingStorefront />,
    features: {
      access: {
        magicJobPosts: { value: 2, text: "Magic job posts" },
        outreachCredits: { value: 5, text: "Outreach credits" },
        talentMatches: {
          value: 10,
          text: "AI-assisted high-precision talent matches",
        },
      },
      curation: {
        continuousLearning: {
          value: false,
          text: "Continuous learning from your talent preferences",
        },
        weeklyTalentPlaylists: {
          value: false,
          text: "Weekly talent discovery playlists curated for you by Eden & D_D talent stewards",
        },
        reputationGating: {
          value: false,
          text: "Reputation gating (coming soon) ",
        },
      },
      exposure: {
        jobBoard: {
          value: false,
          text: "A top-spot on our job board that gets 20.000 hits/month",
        },
        socials: {
          value: false,
          text: "Bi-weekly shoutouts on our socials w aggregated audience of 100.000 web3 enthusiasts & professionals",
        },
      },
    },
  },
  {
    name: "Scaleup",
    description:
      "For those looking to build the future with likeminded people.",
    monthlyPrice: 2000,
    priceID: IS_PRODUCTION
      ? "price_1Np77EBxX85c6z0C0DPou3hC"
      : "price_1NnKzqBxX85c6z0CuUKA0uku",
    featured: true,
    icon: <HiOutlineBuildingOffice />,
    features: {
      access: {
        magicJobPosts: { value: 5, text: "Magic job posts" },
        outreachCredits: { value: 25, text: "Outreach credits" },
        talentMatches: {
          value: 100,
          text: "AI-assisted high-precision talent matches",
        },
      },
      curation: {
        continuousLearning: {
          value: true,
          text: "Continuous learning from your talent preferences",
        },
        weeklyTalentPlaylists: {
          value: true,
          text: "Weekly talent discovery playlists curated for you by Eden & D_D talent stewards",
        },
        reputationGating: {
          value: true,
          text: "Reputation gating (coming soon) ",
        },
      },
      exposure: {
        jobBoard: {
          value: true,
          text: "A top-spot on our job board that gets 20.000 hits/month",
        },
        socials: {
          value: true,
          text: "Bi-weekly shoutouts on our socials w aggregated audience of 100.000 web3 enthusiasts & professionals",
        },
      },
    },
  },
  {
    name: "Head of platform @ VC",
    description:
      "For those looking to build the future with likeminded people.",
    monthlyPrice: 5000,
    priceID: IS_PRODUCTION
      ? "price_1Np7AsBxX85c6z0CsMSl5VnB"
      : "price_1NnKzqBxX85c6z0CuUKA0uku",
    featured: false,
    icon: <HiOutlineBuildingOffice2 />,
    features: {
      access: {
        magicJobPosts: { value: 9999, text: "Magic job posts" },
        outreachCredits: { value: 9999, text: "Outreach credits" },
        talentMatches: {
          value: 9999,
          text: "AI-assisted high-precision talent matches",
        },
      },
      curation: {
        continuousLearning: {
          value: true,
          text: "Continuous learning from your talent preferences",
        },
        weeklyTalentPlaylists: {
          value: true,
          text: "Weekly talent discovery playlists curated for you by Eden & D_D talent stewards",
        },
        reputationGating: {
          value: true,
          text: "Reputation gating (coming soon) ",
        },
      },
      exposure: {
        jobBoard: {
          value: true,
          text: "A top-spot on our job board that gets 20.000 hits/month",
        },
        socials: {
          value: true,
          text: "Bi-weekly shoutouts on our socials w aggregated audience of 100.000 web3 enthusiasts & professionals",
        },
      },
    },
  },
];

const SubscribePage: NextPageWithLayout = () => {
  // eslint-disable-next-line no-unused-vars
  const router = useRouter();
  const slug = router.query.slug;
  // const { currentUser } = useContext(UserContext);

  const handleSubscribeClick = async (priceID: string) => {
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "";

    const redirect = await axios.post(
      `${process.env.NEXT_PUBLIC_AUTH_URL}/stripe/create-checkout-session` as string,
      {
        // eslint-disable-next-line camelcase
        price_id: priceID,
        // eslint-disable-next-line camelcase
        success_url: `${origin}/${slug}/dashboard`,
        // eslint-disable-next-line camelcase
        cancel_url: `${origin}/${slug}/dashboard/subscription`,
        companySlug: slug,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": `*`,
        },
      }
    );

    if (origin && redirect.data) window.location.assign(redirect.data);
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="max-w-6xl grid grid-cols-3 gap-4">
        {PRODUCTS.map((product, index) => (
          <div
            key={index}
            className={classNames(
              "relative col-span-1 rounded-md p-4 hover:scale-[1.01] transition-all",
              product.featured ? "bg-edenPink-300" : "bg-edenPink-100"
            )}
          >
            <div
              className={classNames(
                "h-8 w-8 mx-auto mb-1 text-edenGreen-600 text-xl rounded-md flex items-center justify-center",
                product.featured ? "bg-edenPink-100" : "bg-edenPink-300"
              )}
            >
              {product.icon}
            </div>
            <h1 className="text-edenGreen-600 text-center">{product.name}</h1>
            <p className="mb-4 text-center text-sm">{product.description}</p>
            <div
              className={classNames(
                "w-[calc(100%+2rem)] -mx-4 py-1 mb-4",
                product.featured ? "bg-edenGreen-500" : "bg-edenPink-300"
              )}
            >
              <p className="text-xs text-center">
                <span
                  className={classNames(
                    "font-semibold font-Moret text-2xl inline",
                    product.featured ? "text-white" : "text-edenGreen-600"
                  )}
                >
                  ${product.monthlyPrice}
                </span>{" "}
                <span
                  className={classNames(
                    product.featured ? "text-white" : "text-edenGray-700"
                  )}
                >
                  /month
                </span>
              </p>
            </div>
            <section className="mb-4">
              <h3 className="mb-2 text-edenGreen-600">Access</h3>
              <ul>
                {Object.keys(product.features.access).map(
                  (featName: string, index) => (
                    <li
                      key={index}
                      className="relative pl-6 pr-10 text-xs mb-2"
                    >
                      <div className="absolute left-0 top-px bg-edenGreen-500 h-4 w-4 text-edenPink-300 flex items-center justify-center rounded-full pr-px">
                        <BiCheck className="" size={"1.4rem"} />
                      </div>
                      {product.features.access[featName].text}
                      <span className="absolute right-0 top-0">
                        {product.features.access[featName].value === 9999 ? (
                          <BiInfinite />
                        ) : (
                          product.features.access[featName].value
                        )}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </section>
            <section className="mb-4">
              <h3 className="mb-2 text-edenGreen-600">Curation</h3>
              <ul>
                {Object.keys(product.features.curation).map(
                  (featName: string, index) => (
                    <li
                      key={index}
                      className="relative pl-6 pr-10 text-xs mb-2"
                    >
                      {product.features.curation[featName].value ? (
                        <div className="absolute left-0 top-px bg-edenGreen-500 h-4 w-4 text-edenPink-300 flex items-center justify-center rounded-full pr-px">
                          <BiCheck className="" size={"1.4rem"} />
                        </div>
                      ) : (
                        <MdClose className="absolute left-0 top-1" />
                      )}
                      {product.features.curation[featName].text}
                    </li>
                  )
                )}
              </ul>
            </section>
            <section className="mb-4">
              <h3 className="mb-2 text-edenGreen-600">Exposure</h3>
              <ul>
                {Object.keys(product.features.exposure).map(
                  (featName: string, index) => (
                    <li
                      key={index}
                      className="relative pl-6 pr-10 text-xs mb-2"
                    >
                      {product.features.exposure[featName].value ? (
                        <div className="absolute left-0 top-px bg-edenGreen-500 h-4 w-4 text-edenPink-300 flex items-center justify-center rounded-full pr-px">
                          <BiCheck className="" size={"1.4rem"} />
                        </div>
                      ) : (
                        <MdClose className="absolute left-0 top-1" />
                      )}
                      {product.features.exposure[featName].text}
                    </li>
                  )
                )}
              </ul>
            </section>
            <div className="w-full pt-2">
              <Button
                className="block mx-auto"
                variant="secondary"
                onClick={() => handleSubscribeClick(product.priceID)}
              >
                Subscribe
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

SubscribePage.getLayout = (page) => <AppUserLayout>{page}</AppUserLayout>;

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
  query: { slug: string };
}) {
  const session = await getSession(ctx);

  const url = ctx.req.url;

  if (!session) {
    return {
      redirect: {
        destination: `/?redirect=${url}`,
        permanent: false,
      },
    };
  }

  if (session.accessLevel === 5) {
    return {
      props: { key: url },
    };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/company-auth`,
    {
      method: "POST",
      body: JSON.stringify({
        userID: session.user!.id,
        companySlug: ctx.query.slug,
      }),
      headers: { "Content-Type": "application/json" },
    }
  );

  if (res.status === 401) {
    return {
      redirect: {
        destination: `/request-access`,
        permanent: false,
      },
    };
  }

  if (res.status === 404) {
    return {
      redirect: {
        destination: `/create-company`,
        permanent: false,
      },
    };
  }

  return {
    props: { key: url },
  };
}

export default SubscribePage;
