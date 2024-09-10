import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextRequest, NextResponse } from "next/server";

const defaultLocale = "en";
const locales = ["en", "nl", "fr"];

const getLocale = (request: NextRequest) => {
  // @ts-expect-error Next headers type doesnt match with Negotiator but it works
  const languages = new Negotiator({ headers: request.headers }).languages();
  try {
    return match(languages, locales, defaultLocale);
  } catch (error) {
    return defaultLocale;
  }
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(pathname);
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // if users try to enter an invalid locale, we redirect to the home page

  if (pathnameHasLocale) return;
  // Redirect if there is no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;

  // e.g. incoming request is /products
  // The new URL is now /en/products
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next/static|_next/image|favicon.ico|monitoring|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3)$).*)",
    // Optional: only run on root (/) URL
    // '/'
  ],
};
