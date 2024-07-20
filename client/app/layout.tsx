"use client";

import "./globals.css";
import { Poppins } from "next/font/google";
import { Josefin_Sans } from "next/font/google";
import { ThemeProvider } from "../utils/ThemeProvider";
import Heading from "../utils/Heading";
import { Toaster } from "react-hot-toast";
import { Providers } from "./Provider";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Loader from "@/components/shared/Loader";
import { useEffect, useState } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
  display: "swap",
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Josefin",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${josefin.variable} !bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black duration-300 bg-no-repeat antialiased`}
      >
        <Providers>
          <Heading
            title="Unocode"
            description="A coding platform"
            keywords="programming, education, skills"
          />
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Custom>{children}</Custom>
            <Toaster position="top-center" />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}

const Custom = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useLoadUserQuery({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    // Render placeholder content or nothing to ensure matching HTML
    return <div suppressHydrationWarning><Loader /></div>;
  }

  return <>{isLoading ? <Loader /> : <>{children}</>}</>
};
