"use client"; // Important to mark this as a client component
import { SessionProvider } from "next-auth/react"; // Import SessionProvider

export default function SessionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
