import { parseCookie } from "./parseCookie";

export function getCookieFromContext(ctx: any) {
  if (!ctx.req.cookies.edenAuthToken) return null;

  return parseCookie(ctx.req.cookies.edenAuthToken);
}
