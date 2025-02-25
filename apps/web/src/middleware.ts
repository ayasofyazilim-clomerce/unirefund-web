import {middleware as defaultMiddleware} from "@repo/utils/auth/middleware";

export const middleware = defaultMiddleware;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
