import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/prismicio";

export async function proxy(request: NextRequest) {
  const client = createClient();
  const repository = await client.getRepository();

  const locales = repository.languages.map((lang) => lang.id);
  const defaultLocale = locales[0];

  const { pathname } = request.nextUrl;

  const pathnameIsMissingLocale = locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  if (pathnameIsMissingLocale && pathname !== "/") {
    const rewriteUrl = new URL(`/${defaultLocale}${pathname}`, request.url);
    rewriteUrl.search = request.nextUrl.search;
    return NextResponse.rewrite(rewriteUrl);
  }
}

export const config = {
  matcher: ["/((?!_next).*)"],
};
