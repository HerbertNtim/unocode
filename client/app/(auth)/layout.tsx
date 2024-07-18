import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <section className="w-full h-screen dark:bg-custom-dark-bg bg-cover bg-custom-light-bg bg-center px-8 py-12">
        {children}
      </section>
    </>
  );
};

export default AuthLayout;
