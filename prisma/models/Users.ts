import { PrismaClient, User } from "@prisma/client";
import { assert, object, string, size, refine } from 'superstruct'
import isEmail from 'isemail'
import { createHash } from "crypto";
import prisma from "./../db";
const secret = process.env.SECRET;

type Signup = {
  name: string;
  email: string;
  password: string;
};

// Runtime validation
const Signup = object({
    // first name is between 2 and 50 characters long
    name: size(string(), 2, 50),
    // string and a valid email address
    email: refine(string(), 'email', (v) => isEmail.validate(v)),
    // password is between 7 and 30 characters long
    password: size(string(), 7, 30),
  })

export class Users {
  constructor() {}

  // Signup a new user
  async signup(data: Signup): Promise<User> {
    // @todo: validation...
    assert(data, Signup)
    
    // we hash the password
    data.password = this.hashPassword(data.password);
    return prisma.user.create({ data });
  }

  public hashPassword(password: string) {
    password = createHash("sha256")
      .update(`${password}${secret}`)
      .digest("hex");

    return password;
  }
}
