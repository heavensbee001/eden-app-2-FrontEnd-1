// eslint-disable-next-line camelcase
import jwt_decode from "jwt-decode";
import NextAuth from "next-auth";
// import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";

type decodedType = {
  exp: number;
  iat: number;
  _id: string;
  discordName: string;
  accessLevel: number;
};

type edenTokenType = {
  edenToken: string;
  error: string;
};

async function getEdenToken(accessToken: string) {
  const NEXT_PUBLIC_AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL;

  try {
    const res = await fetch(`${NEXT_PUBLIC_AUTH_URL}/auth/token`, {
      method: "POST",
      body: JSON.stringify({ accessToken }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    console.log("data from Auth", data);

    return data;
  } catch {
    // TODO: if the server is down, user still gets a session token but should be rejected

    return null;
  }
}

async function refreshGoogleToken(refreshToken: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Google client ID or client secret is not set");
  }
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      // eslint-disable-next-line camelcase
      client_id: clientId,
      // eslint-disable-next-line camelcase
      client_secret: clientSecret,
      // eslint-disable-next-line camelcase
      refresh_token: refreshToken,
      // eslint-disable-next-line camelcase
      grant_type: "refresh_token",
    }),
  });

  const data = await response.json();

  console.log(" from refreshGoogleToken ", data);

  console.log("refreshToken!!!!!", refreshToken);

  if (data.error) {
    throw new Error(`Failed to refresh token: ${data.error_description}`);
  }

  return { accessToken: data.access_token, expiresIn: data.expires_in };
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar.events",
          // eslint-disable-next-line camelcase
          access_type: "offline",
        },
      },

      // authorization: { params: { scope: "identify guilds" } },
    }),
  ],
  secret: process.env.NEXT_PUBLIC_SECRET,
  callbacks: {
    session: async ({ session, token }) => {
      console.log("session", session);
      console.log("token:", token);

      if (session?.user) {
        session.user.id = token.uid as string;
      }
      session.error = token.error as string;
      if (token.edenToken) {
        const edenToken = token.edenToken as edenTokenType;
        let decoded: decodedType;

        if (edenToken.error) {
          session.error = edenToken.error;
          session.accessLevel = null;
        }

        if (edenToken.edenToken) {
          decoded = jwt_decode<decodedType>(edenToken.edenToken);
          session.accessLevel = decoded.accessLevel;
        }
      }

      return session;
    },
    jwt: async ({ user, token, account }) => {
      console.log("account", account);

      if (account && user) {
        const _edenToken = await getEdenToken(account.id_token as string);
        //Every time a user logs in a newToken is created (to update newToken log out and log back in)
        const newToken = {
          uid: user.id,
          refreshToken: account.refresh_token,
          //googleAccessToken is used for Google Calendar API
          googleAccessToken: account.access_token,
          //This accessToken is actually id_token not access_token. To get the actual access token use googleAccessToken
          accessToken: account.id_token as string,
          accessTokenExpires:
            account.expires_at && ((account.expires_at * 1000) as number),
          edenToken: _edenToken,
        };

        console.log("newToken:  ====>>>", newToken);

        return newToken;
      }

      const accessTokenExpires = token.accessTokenExpires as number;

      // Discord and Eden tokens expire after 7 days, this will help force the user to re-authenticate within the getServerSideProps
      if (accessTokenExpires && Date.now() > accessTokenExpires - 60 * 1000) {
        try {
          const refreshed = await refreshGoogleToken(
            token.refreshToken as string
          );

          token.googleAccessToken = refreshed.accessToken;

          token.accessTokenExpires = Date.now() + refreshed.expiresIn * 1000;
          console.log("token.googleAccessToken", token.googleAccessToken);
        } catch (err) {
          console.error("Failed to refresh Google access token", err);
          return {
            ...token,
            error: "RefreshAccessTokenError",
          };
        }
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
});
