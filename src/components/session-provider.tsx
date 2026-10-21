"use client";

import { createContext, ReactNode, useContext } from "react";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "student" | "parent";
  avatarColor: string;
  gradeLevel: string | null;
  subject: string | null;
};

const SessionContext = createContext<SessionUser | null>(null);

export function SessionProvider({
  user,
  children,
}: {
  user: SessionUser;
  children: ReactNode;
}) {
  return <SessionContext.Provider value={user}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
