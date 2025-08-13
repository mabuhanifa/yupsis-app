import dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
dotenv.config();

const jwtOptions = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, payload.sub),
    });
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
