import { SignJWT, jwtVerify } from "jose";
import { parse as parseCookieHeader } from "cookie";
import type { Request } from "express";
import { ENV } from "./env";

export const ADMIN_COOKIE_NAME = "shds_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export type AdminUser = {
  email: string;
  role: "admin";
};

function getSecretKey() {
  const secret = ENV.cookieSecret || "dev-insecure-secret-change-me";
  return new TextEncoder().encode(secret);
}

export async function signAdminSession(email: string): Promise<string> {
  const expirationSeconds = Math.floor((Date.now() + SESSION_TTL_MS) / 1000);
  return new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(expirationSeconds)
    .sign(getSecretKey());
}

export async function verifyAdminSession(
  token: string | undefined | null
): Promise<AdminUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
    });
    if (payload.role !== "admin" || typeof payload.email !== "string") {
      return null;
    }
    return { email: payload.email, role: "admin" };
  } catch {
    return null;
  }
}

export function getAdminUserFromRequest(req: Request): Promise<AdminUser | null> {
  const cookies = parseCookieHeader(req.headers.cookie ?? "");
  return verifyAdminSession(cookies[ADMIN_COOKIE_NAME]);
}
