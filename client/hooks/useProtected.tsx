"use client"

import { redirect } from "next/navigation";
import { useSelector } from "react-redux";

const Protected = ({children}: {children: React.ReactNode}) => {
  const isAuthenticated = UserAuth();

  return isAuthenticated ? children : redirect('/')
};

export default Protected;

const UserAuth = () => {
  const { user } = useSelector((state: any) => state.auth);

  if (user) {
    return true;
  } else {
    return false;
  }
};
