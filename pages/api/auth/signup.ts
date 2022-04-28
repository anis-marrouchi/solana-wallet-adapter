import { NextApiHandler } from "next";
import prisma from "../../../prisma/db";
import { getSession } from "next-auth/react";
import { Users } from "../../../prisma/models/Users";
const handler: NextApiHandler = async (req, res) => {
  // User superstruct for validation
  if (req.method === "POST") {
    const { body } = req;
    const users = new Users();
    const user = await users.signup({
      name: body.name,
      email: body.email,
      password: body.password,
    });
    res.status(200).json({ message: "Your account has been successfully created", user: user });
  } else {
    // Handle any other HTTP method
  }
  res.end();
};
export default handler;
