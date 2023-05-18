import axios from "axios";

const { convert } = require("html-to-text");

const webpageScraper = async (req: any, res: any) => {
  const url = req.query.url;

  const response = await axios.get(url);
  const text = await convert(response.data).replace(/\n/g, "");

  res.status(200).json({ text });

  console.log(text);
};

export default webpageScraper;
