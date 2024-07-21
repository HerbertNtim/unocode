"use client";

import { redirect } from "next/navigation";
import { useSelector } from "react-redux";

const AdminProtected = ({ children }: { children: React.ReactNode }) => {
  const { user } = useSelector((state: any) => state.auth);
  if (user) {
    const isAdmin = user?.role === "admin";
    return isAdmin ? children : redirect("/");
  }
};

export default AdminProtected;
