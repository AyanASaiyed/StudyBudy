import LoginButton from "@/components/LoginLogoutButton";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-extrabold text-teal-400 py-10">StudyBudy</h1>
      <h2 className="font-mono text-xl text-white">A personal AI Studdy Buddy.</h2>
      <LoginButton/>
      <Button size="lg" className="mt-5 text-black font-extrabold">Login</Button>
    </div>
  );
}
