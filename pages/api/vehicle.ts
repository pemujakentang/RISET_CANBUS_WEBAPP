import type { NextApiRequest, NextApiResponse } from "next";
import { getLatestData } from "../../lib/mqtt";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(getLatestData());
}
