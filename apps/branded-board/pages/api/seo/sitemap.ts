// pages/api/sitemap.xml.js

import { NextApiRequest, NextApiResponse } from "next";
import { SitemapStream, streamToPromise } from "sitemap";

const getSubdomainUrls = async (subdomain: string) => {
  // Fetch subdomain URLs from the database
  return ["/jobs"];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const subdomain =
      process.env.NEXT_PUBLIC_FORCE_SLUG_LOCALHOST || req.query.subdomain;

    // Get subdomain URLs
    const subdomainUrls = await getSubdomainUrls(subdomain);

    // Create sitemap stream
    const stream = new SitemapStream({
      hostname: `https://${subdomain}.joineden.ai`,
    });

    // Add URLs to the sitemap stream
    subdomainUrls.forEach((url) => {
      stream.write({ url, changefreq: "daily", priority: 0.7 });
    });

    // End sitemap stream
    stream.end();

    // Generate XML
    const xml = await streamToPromise(stream).then((data) => data.toString());

    // Set headers
    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Content-Length", Buffer.byteLength(xml));

    // Send sitemap XML
    res.status(200).send(xml);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).end();
  }
}
