import { Button, TextArea } from "@eden/package-ui";
import { ChangeEvent, FormEvent, useState } from "react";

const LinkedInScraper = () => {
  const [webpageLink, setWebpageLink] = useState("");
  const [pastedText, setPastedText] = useState("");

  const [webPageText, setWebPageText] = useState("");
  const [scraping, setScraping] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleWebpageLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWebpageLink(e.target.value);
  };

  const handlePastedTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPastedText(e.target.value);
  };

  const handleLinkSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setScraping(true);

    const queryParams = new URLSearchParams({ url: webpageLink }).toString();

    try {
      const response = await fetch(
        `/api/webpage_scraper/webpage_scraper?${queryParams}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        let error;

        try {
          const { error: serverError } = await response.json();

          error = serverError;
        } catch (jsonError) {
          error = "An error occurred while decoding the response JSON";
        }
        setError(`HTTP error! status: ${response.status}, error: ${error}`);
        throw new Error(
          `HTTP error! status: ${response.status}, error: ${error}`
        );
      }

      console.log("API response:", response);

      const { textResponse } = await response.json();

      setWebPageText(textResponse);
    } catch (error) {
      setError(
        `An error occurred while fetching the LinkedIn profile: ${
          (error as Error).message
        }
        
        Please copy the text from the job post page manually and paste it in the textfield below`
      );
    } finally {
      setScraping(false);
    }
  };

  const handleTextSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("pastedText", pastedText);
    setPastedText("");
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <form
        className=" flex flex-col items-center  space-y-2"
        onSubmit={handleLinkSubmit}
      >
        <label>Extract Text From Page</label>
        <input
          className="w-96 border-2 border-black pl-1"
          onChange={handleWebpageLinkChange}
          placeholder="https://www.example.com"
        />
        <Button
          variant="primary"
          className="w-fit"
          type="submit"
          loading={scraping}
        >
          Submit Link
        </Button>
        {webPageText && <div>{webPageText}</div>}
        {error && <div className="text-red-500">{error}</div>}
      </form>
      <form
        className="flex w-3/12 flex-col items-center  space-y-2"
        onSubmit={handleTextSubmit}
      >
        <label>Paste the text from the Position Page Here</label>

        <TextArea
          value={pastedText}
          rows={15}
          onChange={handlePastedTextChange}
        />
        <Button variant="primary" type="submit">
          Submit Text
        </Button>
      </form>
    </div>
  );
};

export default LinkedInScraper;
