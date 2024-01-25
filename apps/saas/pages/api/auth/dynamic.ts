/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
// import { cookies } from "next/header";

const NEXT_PUBLIC_AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // const token = await getToken({
  //   req,
  //   secret: process.env.NEXT_PUBLIC_SECRET,
  // });

  let edenToken = null;
  let error = null;

  // if (!token || !token?.accessToken) {
  //   return res.status(200).send({
  //     edenToken,
  //     error,
  //   });
  //   // return res.status(404).end();
  // }
  // console.log(
  //   "From Fetch Token",
  //   JSON.stringify({ accessToken: token.accessToken })
  // );
  try {
    const res = await fetch(`${NEXT_PUBLIC_AUTH_URL}/auth-dynamic/token`, {
      method: "POST",
      body: JSON.stringify({ accessToken: req.body.accessToken }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (data.error) {
      throw new Error(data.error);
    }

    if (data.edenToken) {
      edenToken = data.edenToken;
    }
  } catch (err) {
    console.log(err);
    error = err;
  }

  if (error) {
    return res.status(400).json({ error: `Token validation error: ${error}` });
  }

  return res.status(200).send({
    edenToken,
    error,
  });
};
