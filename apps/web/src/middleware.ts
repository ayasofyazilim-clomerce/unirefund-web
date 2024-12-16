import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { NextAuthRequest } from "node_modules/next-auth/lib";
import { auth } from "auth";

export const i18n = {
  defaultLocale: "en",
  locales: [
    "de-de",
    "en",
    "es",
    "fi",
    "fr",
    "hi",
    "it",
    "sk",
    "sl",
    "tr",
    "ru",
    "ar",
    "zh-hans",
    "zh-hant",
  ],
};

const publicURLs = ["404", "500", "api", "public"];
const authPages = ["login", "register", "forgot-password", "reset-password"];
function getLocaleFromBrowser(request: NextRequest) {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  const locales = i18n.locales;
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales,
  );
  return matchLocale(languages, locales, i18n.defaultLocale);
}
function getLocaleFromCookies(request: NextRequest) {
  const cookieLocale = request.cookies.get("locale")?.value;
  if (cookieLocale && i18n.locales.includes(cookieLocale)) {
    return cookieLocale;
  }
}

function localeFromPathname(request: NextRequest) {
  const pathname = `${request.nextUrl.pathname}/`;
  let returnLocale = i18n.defaultLocale;
  const isLocaleProvided = i18n.locales.find((locale) => {
    if (pathname.startsWith(`/${locale}/`)) {
      returnLocale = locale;
      return locale;
    }
    return false;
  });
  if (isLocaleProvided) {
    return returnLocale;
  }
  return false;
}

function getLocale(request: NextRequest) {
  return (
    localeFromPathname(request) ||
    getLocaleFromCookies(request) ||
    getLocaleFromBrowser(request)
  );
}

export const middleware = auth((request: NextAuthRequest) => {
  const hostURL = `http://${request.headers.get("host")}`;

  function isUserAuthorized(req: NextAuthRequest) {
    return Boolean(
      req.auth?.access_token &&
        (req.auth.user?.userName || req.auth.user?.email),
    );
  }
  function isPathHasLocale(path: string) {
    return i18n.locales.includes(path.split("/")[1]);
  }
  function redirectToLogin(locale: string, req: NextRequest) {
    return NextResponse.redirect(
      new URL(`/${locale}/login?redirect=${req.nextUrl.pathname}`, hostURL),
    );
  }

  function redirectToRoot(locale: string) {
    return NextResponse.redirect(new URL(`/${locale}/home`, hostURL));
  }
  function allowURL(locale: string, req: NextRequest) {
    const response = NextResponse.next();
    if (req.cookies.get("locale")?.value !== locale) {
      response.cookies.set("locale", locale);
    }
    return response;
  }
  const isAuthorized = isUserAuthorized(request);
  const locale = getLocale(request);
  const pathName = request.nextUrl.pathname.split("/")[2];

  if (!pathName) {
    return redirectToRoot(locale);
  }

  // If the user is authorized
  if (isAuthorized) {
    // If the user is authorized and the path is unauthorized specific, redirect to profile
    if (authPages.includes(pathName)) {
      return redirectToRoot(locale);
    }

    if (isPathHasLocale(request.nextUrl.pathname)) {
      return allowURL(locale, request);
    }
    // console.error(
    //   `(No locale provided type 1) Wrong redirection to pathName:${pathName}`
    // );
    const { search } = request.nextUrl;
    return NextResponse.redirect(
      new URL(`/${locale}${request.nextUrl.pathname}${search}`, hostURL),
    );
  }

  // If the user is not authorized and the path is public, continue
  if (publicURLs.includes(pathName) || authPages.includes(pathName)) {
    if (isPathHasLocale(request.nextUrl.pathname)) {
      return allowURL(locale, request);
    }

    // console.error(
    //   `(No locale provided type 2) Wrong redirection to pathName:${pathName}`
    // );
    return NextResponse.redirect(
      new URL(`/${locale}${request.nextUrl.pathname}`, hostURL),
    );
  }

  // If the user is not authorized and the path is authorized specific, redirect to login
  return redirectToLogin(locale, request);
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
