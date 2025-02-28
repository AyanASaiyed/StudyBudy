import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const connectToSupabase = () => {
  const supabaseUrl = process.env.PROJECT_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);
  console.log("Connected to Supabase.")
  return supabase;
};

const getUsers = () => {
    
}

export default connectToSupabase;
