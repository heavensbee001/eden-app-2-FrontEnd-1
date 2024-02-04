/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("REDIRECT API", req);
  const redirectUrl = (req.query.redirect as string) || "";

  if (!redirectUrl) {
    return res.status(400).json({ error: "No valid redirect URL provided" });
  }

  res.redirect(302, redirectUrl);
};
