import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const connectToSupabase = () => {
  const supabaseUrl = process.env.PROJECT_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);
  if (supabase) {
    console.log("Connected to Supabase.");
  } else {
    console.log("Error connecting to Supabase.");
  }

  return supabase;
};

const getUsers = () => {};

export default connectToSupabase;
