import authOptions from "@/lib/authOptions";
import supabase from "@/lib/supabase";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ error: "User not authorized." });
    }

    const { message, subjectId } = req.body;
    const userEmail = session.user?.email;

    // Get user and subject info in parallel
    const [userId, subjectName] = await Promise.all([
      supabase.from("profiles").select("id").eq("email", userEmail).single(),
      supabase
        .from("subjects")
        .select("subject_name")
        .eq("id", subjectId)
        .single(),
    ]);

    if (userId.error || !userId.data) {
      return res.status(402).json({ error: "User not found in Database." });
    }

    if (subjectName.error || !subjectName.data) {
      return res.status(406).json({ error: "Subject not found." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    console.log("subject name ---", subjectName.data!.subject_name);

    console.log("user id --- ", userId.data.id);

    const prompt = `You are a tutor and the subject you are an expert of is ${
      subjectName.data!.subject_name
    }
    and the message that your student has asked you is: ${message} please aid the student in better understanding the topic.
     Keep your message brief but informative. Do not add markup language syntax, keep it simple english and format in answers in paragraphs rather than
     creating lists and such.`;

    console.time("AI Generation");
    const result = await model.generateContent(prompt);
    console.timeEnd("AI Generation"); // Check how long it takes

    const aiResponse = await result.response.text();

    console.log("AI RESPONSE: ", aiResponse);

    // Save user message
    const { error: msgError } = await supabase.from("messages").insert({
      senderid: userId.data.id,
      subjectid: subjectId,
      message: message,
    });

    if (msgError) {
      return res.status(400).json({ error: msgError.message });
    }

    const AI_UUID = "00000000-0000-0000-0000-000000000000";

    const { error: aiError } = await supabase.from("messages").insert({
      senderid: AI_UUID,
      subjectid: subjectId,
      message: aiResponse,
    });

    if (aiError) {
      console.error("AI Message Insert Error:", aiError);
      return res.status(408).json({ aiError });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
