import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

const createCalendarEvent = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  //this token comes from [...nextauth].ts in pages/saas/api/auth folder
  const token = await getToken({
    req,
    secret: process.env.NEXT_PUBLIC_SECRET,
  });

  const googleAccessToken = token?.googleAccessToken;

  // console.log("accessToken", test);
  // console.log("token from calendar", token);
  const { startDate } = req.body;
  const parsedDate = new Date(startDate);
  const event = {
    summary: "Interview with Eden",
    start: {
      dateTime: parsedDate.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: new Date(parsedDate.getTime() + 30 * 60 * 1000).toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  };

  if (!token) {
    console.error("Failed to retrieve access token");
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }

  await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${googleAccessToken}`,

        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    }
  )
    .then((data) => {
      if (!data.ok) {
        return data.json().then((errorData) => {
          console.error("API Error:", errorData);
        });
      }
      return data.json();
    })
    .then((data) => {
      if (data.error) {
        res.status(400).json({ error: data.error.message });
      } else {
        res.status(200).json({ eventId: data.id });
      }
    })

    .catch((error) => {
      console.error("Error:", error);
    });
};

export default createCalendarEvent;
