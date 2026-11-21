import type { NextFunction, Request, Response } from "express";
import { Admin } from "../modules/admin-auth/admin.model";
import { verifyAdminToken } from "../utils/token";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: {
        _id: unknown;
        name?: string | null;
        email: string;
        role?: string | null;
        status?: string | null;
      };
    }
  }
}

const unauthorized = (res: Response, message = "Unauthorized") =>
  res.status(401).json({ success: false, message });

/** Requires `Authorization: Bearer <jwt>` from an active admin. */
export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) return unauthorized(res);

    let payload;
    try {
      payload = verifyAdminToken(header.slice(7));
    } catch (err) {
      const expired = (err as Error).name === "TokenExpiredError";
      return unauthorized(res, expired ? "Session expired" : "Invalid token");
    }

    const admin = await Admin.findById(payload.sub);
    if (!admin || admin.status !== "active") return unauthorized(res);

    // reject tokens issued before the last email/password change
    if (
      admin.credentialsChangedAt &&
      (payload.iat ?? 0) <
        Math.floor(admin.credentialsChangedAt.getTime() / 1000)
    ) {
      return unauthorized(res, "Session expired");
    }

    req.admin = admin;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Secure-by-default guard for the whole API router.
 * Public: OPTIONS, GET/HEAD (website content), POST /enquiries (contact form), /admin-auth/signin.
 * Everything else (every write, plus admin-only reads) needs a valid admin token.
 * New routes are therefore protected automatically; only add to the lists below to make something public.
 */
const ADMIN_ONLY_READS = [/^\/enquiries(\/|$)/, /^\/leadership\/admin\/?$/];
const PUBLIC_WRITES = [{ method: "POST", path: /^\/enquiries\/?$/ }];

export const adminGuard = (req: Request, res: Response, next: NextFunction) => {
  const { method, path } = req;

  if (method === "OPTIONS") return next();
  if (path.startsWith("/admin-auth")) return next(); // has its own per-route protection

  if (method === "GET" || method === "HEAD") {
    if (!ADMIN_ONLY_READS.some((re) => re.test(path))) return next();
  } else if (
    PUBLIC_WRITES.some((r) => r.method === method && r.path.test(path))
  ) {
    return next();
  }

  return requireAdmin(req, res, next);
};
