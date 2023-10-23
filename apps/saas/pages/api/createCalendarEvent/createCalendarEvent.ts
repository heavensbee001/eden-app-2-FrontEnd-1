import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

const createCalendarEvent = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const token = await getToken({
    req,
    secret: process.env.NEXT_PUBLIC_SECRET,
  });

  const accessToken = token?.accessToken;

  console.log("accessToken", accessToken);
  console.log("token", token);
  // const { startDate } = req.body;
  // const parsedDate = new Date(startDate);
  // const event = {
  //   summary: "Interview with Eden",
  //   start: {
  //     dateTime: parsedDate.toISOString(),
  //     timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  //   },
  //   end: {
  //     dateTime: new Date(parsedDate.getTime() + 30 * 60 * 1000).toISOString(),
  //     timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  //   },
  // };

  // if (!token) {
  //   console.error("Failed to retrieve access token");
  //   res.status(500).json({ error: "Internal Server Error" });
  //   return;
  // }

  // await fetch(
  //   "https://www.googleapis.com/calendar/v3/calendars/primary/events",
  //   {
  //     method: "POST",
  //     headers: {
  //       // Authorization: `Bearer ${accessToken}`,
  //       Authorization:
  //         "Bearer ya29.a0AfB_byBMNwZpNC7j47DYkjccqa-dfr7BBjmUFY5zs7k0csTu22W1TTJjwUCfV6Pvuxpye-qz-j33agTKj_DOIc_cp-0soFG0fXcETx2qB1DGwb95YawyyFExq3XTPZArG6n5EOG3dONXEaLdSKVpAY-AlO6CSTziqEB9aCgYKAb0SARMSFQGOcNnC3d-OXb8E3hzs-o2be3vAgg0171",

  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(event),
  //   }
  // )
  //   .then((data) => {
  //     if (!data.ok) {
  //       return data.json().then((errorData) => {
  //         console.error("API Error:", errorData);
  //       });
  //     }
  //     return data.json();
  //   })
  //   .then((data) => {
  //     if (data.error) {
  //       res.status(400).json({ error: data.error.message });
  //     } else {
  //       res.status(200).json({ eventId: data.id });
  //     }
  //   })

  //   .catch((error) => {
  //     console.error("Error:", error);
  //   });
};

export default createCalendarEvent;
