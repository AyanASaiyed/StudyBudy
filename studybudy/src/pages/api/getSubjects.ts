import authOptions from "@/lib/authOptions";
import supabase from "@/lib/supabase";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "User Not Authorized." });
  }

  const userEmail = session.user?.email;

  const { data: subjects, error } = await supabase
    .from("subjects")
    .select("subject_name")
    .eq("user_email", userEmail);

  if (error) {
    return res.status(403).json({ error: error.message });
  }

  return res.status(200).json({ data: subjects });
};
