import authOptions from "@/lib/authOptions";
import supabase from "@/lib/supabase";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "User not authorized." });
  }

  const { message, subjectId } = req.body;

  const userEmail = session.user?.email;

  const { data: user, error: userError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", userEmail)
    .single();

  if (userError || !user) {
    return res.status(402).json({ error: "User not found in Database." });
  }

  const { data: msgData, error } = await supabase.from("messages").insert({
    senderid: user.id,
    subjectid: subjectId,
    message: message,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({ data: msgData });
};
