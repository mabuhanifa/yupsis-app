import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import httpStatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { ApiError } from "../utils/ApiError.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key";
const SALT_ROUNDS = 10;

const register = async (email, password) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const [newUser] = await db
    .insert(users)
    .values({ email, password: hashedPassword })
    .returning({ id: users.id, email: users.email });
  return newUser;
};

const login = async (email, password) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });

  return { token };
};

const getProfile = async (userId) => {
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, userId));

  return user;
};

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(
      httpStatusCodes.UNAUTHORIZED,
      "Incorrect email or password"
    );
  }

  delete user.password;
  return user;
};

export const authService = {
  register,
  login,
  getProfile,
  loginUserWithEmailAndPassword,
};
