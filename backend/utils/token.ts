import jwt, { type SignOptions } from "jsonwebtoken";

export interface AdminJwtPayload {
  sub: string; // admin _id
  role: string;
}

const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be set and at least 32 characters long");
  }
  return secret;
};

export const signAdminToken = (payload: AdminJwtPayload): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? "1d") as SignOptions["expiresIn"],
    algorithm: "HS256",
  };
  return jwt.sign(payload, getSecret(), options);
};

export const verifyAdminToken = (token: string) =>
  jwt.verify(token, getSecret(), { algorithms: ["HS256"] }) as jwt.JwtPayload &
    AdminJwtPayload;
