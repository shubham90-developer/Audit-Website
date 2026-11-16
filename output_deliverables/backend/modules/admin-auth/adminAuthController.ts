import { Request, Response } from "express";
import crypto from "crypto";
import { AdminUser } from "./adminAuth.model";
import { loginSchema, changeCredentialsSchema } from "./adminAuth.validation";

const hashPassword = (pwd: string): string => {
  return crypto.createHash("sha256").update(pwd).digest("hex");
};

const ensureDefaultAdmin = async (): Promise<void> => {
  const exists = await AdminUser.exists({});
  if (exists) return;

  await AdminUser.create({
    name: "Super Admin",
    email: "admin@gmail.com",
    password: hashPassword("admin123"),
    role: "admin",
    status: "active",
  });
};

const generateToken = (userId: string): string => {
  const payload = Buffer.from(JSON.stringify({ userId, time: Date.now() })).toString("base64");
  return "token_" + payload;
};

export const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    await ensureDefaultAdmin();

    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, statusCode: 400, message: "Invalid credentials" });
      return;
    }

    const { email, password } = parsed.data;
    const admin = await AdminUser.findOne({ email: email.toLowerCase(), status: "active" });
    if (!admin) {
      res.status(401).json({ success: false, statusCode: 401, message: "Admin not found or inactive" });
      return;
    }

    const hashed = hashPassword(password);
    if (admin.password !== hashed && admin.password !== password) {
      res.status(401).json({ success: false, statusCode: 401, message: "Incorrect password" });
      return;
    }

    const token = generateToken(admin._id.toString());
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Login successful",
      token,
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, statusCode: 500, message: error.message });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    await ensureDefaultAdmin();
    const admin = await AdminUser.findOne({ status: "active" });
    if (!admin) {
      res.status(404).json({ success: false, statusCode: 404, message: "Admin not found" });
      return;
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, statusCode: 500, message: error.message });
  }
};

export const changeCredentials = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = changeCredentialsSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, statusCode: 400, message: "Invalid inputs" });
      return;
    }

    const { currentPassword, newEmail, newPassword } = parsed.data;
    const admin = await AdminUser.findOne({ status: "active" });
    if (!admin) {
      res.status(404).json({ success: false, statusCode: 404, message: "Admin not found" });
      return;
    }

    const hashedCurrent = hashPassword(currentPassword);
    if (admin.password !== hashedCurrent && admin.password !== currentPassword) {
      res.status(401).json({ success: false, statusCode: 401, message: "Current password is wrong" });
      return;
    }

    if (newEmail) admin.email = newEmail.toLowerCase();
    if (newPassword) admin.password = hashPassword(newPassword);
    await admin.save();

    const token = generateToken(admin._id.toString());
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Credentials updated successfully",
      token,
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, statusCode: 500, message: error.message });
  }
};
