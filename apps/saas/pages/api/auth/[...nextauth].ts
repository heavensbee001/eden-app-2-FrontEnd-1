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

    // console.log("data from Auth", data);

    return data;
  } catch {
    // TODO: if the server is down, user still gets a session token but should be rejected

    return null;
  }
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar",
        },
      },

      // authorization: { params: { scope: "identify guilds" } },
    }),
  ],
  secret: process.env.NEXT_PUBLIC_SECRET,
  callbacks: {
    session: async ({ session, token }) => {
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
          //googleAccessToken is used for Google Calendar API
          googleAccessToken: account.access_token,
          //This accessToken is actually id_token not access_token. To get the actual access token use googleAccessToken
          accessToken: account.id_token as string,
          accessTokenExpires:
            account.expires_at && ((account.expires_at * 1000) as number),
          edenToken: _edenToken,
        };

        return newToken;
      }

      const accessTokenExpires = token.accessTokenExpires as number;

      // Discord and Eden tokens expire after 7 days, this will help force the user to re-authenticate within the getServerSideProps
      if (accessTokenExpires && Date.now() < accessTokenExpires) {
        return {
          ...token,
          error: null,
        };
      } else {
        return {
          ...token,
          error: "RefreshAccessTokenError",
        };
      }
    },
  },
  session: {
    strategy: "jwt",
  },
});
