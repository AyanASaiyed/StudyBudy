import authOptions from "@/lib/authOptions";
import supabase from "@/lib/supabase";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "User not Authorized!" });
  }

  const { subject_name } = req.body;
  const userEmail = session.user?.email;

  const { data: user, error: userError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", userEmail)
    .single();

  if (userError || !user) {
    console.log("No user Authorized.");
    return res.status(402).json({ error: "User Not Found." });
  }

  const { data: subjectData, error } = await supabase.from("subjects").insert({
    user_id: user.id,
    user_email: userEmail,
    subject_name,
  });

  if (error) {
    return res
      .status(400)
      .json({ error: "Failed to insert subject in database" });
  }

  return res.status(200).json({ data: subjectData });
};
