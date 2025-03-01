import { redirect } from "next/navigation";

import { createClient } from "../../../utils/supabase/server";
import LoginButton from "@/components/LoginLogoutButton";

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Hello {data.user.user_metadata.full_name}</h1>
      <LoginButton />
    </div>
  );
}
