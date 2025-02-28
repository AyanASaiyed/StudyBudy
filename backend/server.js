import express from "express";
import cors from "cors";
import connectToSupabase from "./supabase/connectAuth.js";

const PORT = 5000;
const app = express();

app.use(cors());

app.listen(PORT, () => {
  connectToSupabase();
  console.log(`Server Running on PORT: ${PORT}`);
});
