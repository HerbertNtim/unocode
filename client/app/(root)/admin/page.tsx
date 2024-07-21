import AdminSidebar from "@/components/AdminSidebar";
import AdminProtected from "@/hooks/adminProtected";
import React from "react";

const Admin = () => {
  return (
    <AdminProtected>
      <div className="flex h-[200vh] overflow-y-hidden">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>

        <div className="w-[85%]">

        </div>
      </div>
    </AdminProtected>
  );
};

export default Admin;
