import authOptions from "@/lib/authOptions";
import supabase from "@/lib/supabase";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "User not authorized." });
  }

  const { subjectId } = req.body;
  const userEmail = session.user?.email;

  const { data: user, error: userError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", userEmail)
    .single();

  if (userError || !user) {
    return res.status(405).json({ error: "User not found in database" });
  }

  const { data: subjectMessages, error } = await supabase
    .from("messages")
    .select("message, senderid")
    .eq("subjectid", subjectId);

  if (error) {
    console.error("Error fetching messages:", error);
    return res.status(405).json({ error: error.message });
  }

  console.log("Fetched messages:", subjectMessages);
  return res.status(200).json({ data: subjectMessages });
};
