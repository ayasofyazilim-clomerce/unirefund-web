import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";
import Negotiator from "negotiator";
import {match as matchLocale} from "@formatjs/intl-localematcher";
import type {NextAuthRequest} from "node_modules/next-auth/lib";
import {auth} from "@repo/utils/auth/next-auth";

const homeRoute = process.env.HOME_ROUTE || "/";
const protectedRoutes = process.env.PROTECTED_ROUTES?.split(",") || [];
const unauthorizedRoutes = process.env.UNAUTHORIZED_ROUTES?.split(",") || [];
const protectAllRoutes = process.env.PROTECT_ALL_ROUTES === "true";

export const i18n = {
  defaultLocale: process.env.DEFAULT_LOCALE || "en",
  locales: process.env.SUPPORTED_LOCALES?.split(",") || ["en", "tr"],
};

function getLocaleFromBrowser(request: NextRequest) {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  const locales = i18n.locales;
  const languages = new Negotiator({headers: negotiatorHeaders}).languages(locales);
  return matchLocale(languages, locales, i18n.defaultLocale);
}
function getLocaleFromCookies(request: NextRequest) {
  const cookieLocale = request.cookies.get("locale")?.value;
  if (cookieLocale && i18n.locales.includes(cookieLocale)) {
    return cookieLocale;
  }
}
function getLocaleFromRequest(request: NextRequest) {
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const locale = acceptLanguage.split(",")[0].split("-")[0];
    if (i18n.locales.includes(locale)) {
      return locale;
    }
  }
  return i18n.defaultLocale;
}
function getLocale(request: NextRequest) {
  return getLocaleFromCookies(request) || getLocaleFromBrowser(request) || getLocaleFromRequest(request);
}
function isUserAuthorized(request: NextAuthRequest) {
  return Boolean(request.auth?.user?.access_token && (request.auth.user.userName || request.auth.user.email));
}
function redirectToLocale(request: NextRequest, pathname: string) {
  const locale = getLocale(request);
  if (request.cookies.get("locale")?.value !== locale) {
    request.cookies.set("locale", locale);
  }
  const newUrl = request.nextUrl.clone();
  newUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(newUrl);
}
function redirectToLogin(request: NextRequest, pathname: string, locale: string) {
  const redirectTo = encodeURIComponent(pathname);

  const newUrl = request.nextUrl.clone();
  newUrl.pathname = `/${locale}/login`;
  newUrl.searchParams.set("redirectTo", redirectTo);
  return NextResponse.redirect(newUrl);
}
function redirectToHome(request: NextRequest, locale: string) {
  const newUrl = request.nextUrl.clone();
  newUrl.pathname = `/${locale}/${homeRoute}`;
  return NextResponse.redirect(newUrl);
}
export const middleware = auth((request: NextAuthRequest) => {
  const url = request.url;
  const pathname = new URL(url).pathname;

  const isAuthenticated = isUserAuthorized(request);
  const pathParts = pathname.split("/").filter(Boolean);

  // 1. Check if the locale is valid
  if (pathParts.length === 0 || (pathParts.length > 0 && !i18n.locales.includes(pathParts[0]))) {
    return redirectToLocale(request, pathname);
  }
  // 2. Check if the locale is the same as the one in the cookie
  if (request.cookies.get("locale")?.value !== pathParts[0]) {
    request.cookies.set("locale", pathParts[0]);
  }

  if (pathParts.length === 1 && homeRoute !== "/") {
    return redirectToHome(request, pathParts[0]);
  }

  // 3. Check if the user is trying to access a protected route without authorization
  if (
    !isAuthenticated &&
    ((!protectAllRoutes && protectedRoutes.some((route) => route === pathParts[1])) ||
      (protectAllRoutes && !unauthorizedRoutes.some((route) => route === pathParts[1])))
  ) {
    return redirectToLogin(request, pathname, pathParts[0]);
  }

  // 4. Check if the user is trying to access a unauthorized route with authorization
  if (isAuthenticated && unauthorizedRoutes.some((route) => route === pathParts[1])) {
    return redirectToHome(request, pathParts[0]);
  }

  // 5. So far so good
  const response = NextResponse.next();
  response.cookies.set("locale", pathParts[0]);
  return response;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
