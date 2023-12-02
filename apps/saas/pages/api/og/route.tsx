import SeoImage from "@eden/package-ui/src/components/SeoImage";
import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

export default async function handler() {
  return new ImageResponse(<SeoImage title="Eden" company="Job" />);
}
