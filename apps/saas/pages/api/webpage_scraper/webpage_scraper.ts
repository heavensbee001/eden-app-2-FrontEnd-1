import axios from "axios";

const { convert } = require("html-to-text");

const webpageScraper = async (req: any, res: any) => {
  const url = req.query.url;

  const response = await axios.get(url);

  const text = await convert(response.data);

  function cleanString(s: string) {
    // Remove URLs
    s = s.replace(/https?:\/\/[^\s]+/g, "");
    // Remove newline characters
    s = s.replace(/\n/g, "");
    // Remove non-alphanumeric characters, excluding +, - and $
    s = s.replace(/[^a-zA-Z0-9\s\+\-\$]/g, " ");
    return s;
  }

  const textResponse = await cleanString(text);

  res.status(200).json({ textResponse });

  console.log(text);
};

export default webpageScraper;
