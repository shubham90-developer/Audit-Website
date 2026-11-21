import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Admin, toPublicAdmin } from "./admin.model";
import { signinSchema, changeCredentialsSchema } from "./admin.validation";
import { signAdminToken } from "../../utils/token";

const BCRYPT_ROUNDS = 12;
// Compared against when the email doesn't exist, so response time doesn't reveal valid emails.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", BCRYPT_ROUNDS);

const zodMessage = (issues: { path: PropertyKey[]; message: string }[]) =>
  issues.map((i) => i.message).join("; ");

export const signin = async (req: Request, res: Response) => {
  const parsed = signinSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ success: false, message: zodMessage(parsed.error.issues) });
    return;
  }

  const { email, password } = parsed.data;
  const admin = await Admin.findOne({ email }).select("+password");

  const ok = await bcrypt.compare(password, admin?.password ?? DUMMY_HASH);
  if (!admin || !ok || admin.status !== "active") {
    // one generic message for wrong email / wrong password / disabled account
    res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
    return;
  }

  const token = signAdminToken({ sub: String(admin._id), role: admin.role });
  res.json({
    success: true,
    statusCode: 200,
    message: "Login successful",
    token,
    data: toPublicAdmin(admin),
  });
};

export const me = async (req: Request, res: Response) => {
  // req.admin is attached by requireAdmin
  res.json({ success: true, data: toPublicAdmin(req.admin!) });
};

export const changeCredentials = async (req: Request, res: Response) => {
  const parsed = changeCredentialsSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ success: false, message: zodMessage(parsed.error.issues) });
    return;
  }

  const { currentPassword, newEmail, newPassword } = parsed.data;
  const admin = await Admin.findById(req.admin!._id).select("+password");
  if (!admin) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  if (!(await bcrypt.compare(currentPassword, admin.password))) {
    res
      .status(400)
      .json({ success: false, message: "Current password is incorrect" });
    return;
  }

  if (newEmail && newEmail !== admin.email) {
    const taken = await Admin.exists({
      email: newEmail,
      _id: { $ne: admin._id },
    });
    if (taken) {
      res
        .status(409)
        .json({ success: false, message: "That email is already in use" });
      return;
    }
    admin.email = newEmail;
  }
  if (newPassword) {
    admin.password = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
  }
  // invalidate every token issued before this change; the response carries a fresh one
  admin.credentialsChangedAt = new Date();
  await admin.save();

  const token = signAdminToken({ sub: String(admin._id), role: admin.role });
  res.json({
    success: true,
    statusCode: 200,
    message: "Credentials updated successfully",
    token,
    data: toPublicAdmin(admin),
  });
};
