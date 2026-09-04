import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PATHS = ['/main_screen', '/tickets'];

const ROLE_RESTRICTED_PATHS: Record<string, string[]> = {
};

function decodeRole(token: string): string | null {
  try {
    const [, payloadSegment] = token.split('.');
    const json = atob(payloadSegment);
    const payload = JSON.parse(json);
    return payload.role ?? null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  if (!isProtected) {
    return NextResponse.next();
  }

  const token = request.cookies.get('ticheck_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const role = decodeRole(token);
  if (!role) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const restrictedEntry = Object.entries(ROLE_RESTRICTED_PATHS).find(([path]) =>
    pathname.startsWith(path)
  );
  if (restrictedEntry) {
    const [, allowedRoles] = restrictedEntry;
    if (!allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  const response = NextResponse.next();
  response.headers.set('x-user-role', role);
  return response;
}

export const config = {
  matcher: ['/main_screen/:path*', '/tickets/:path*'],
};