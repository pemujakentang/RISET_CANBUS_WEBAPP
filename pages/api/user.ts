import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, email } = req.body;
    const user = await prisma.user.create({
      data: { name, email },
    });
    res.json(user);
  } else if (req.method === "GET") {
    const users = await prisma.user.findMany();
    res.json(users);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
