"use client";

import Link from "next/link";
import React, { useState } from "react";
import NavItems from "./NavItems";
import ThemeSwitcher from "@/utils/ThemeSwitcher";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import { MdOutlineClose } from "react-icons/md";
import MobileNav from "./MobileNav";
import { useSelector } from "react-redux";
import Image from "next/image";

const Header = () => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const { user } = useSelector((state: any) => state.auth);

  if (typeof window != "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 85) {
        setActive(true);
      } else {
        setActive(false);
      }
    });
  }

  console.log(user);
  const handleClose = (e: any) => {
    if (e.target.id === "screen") {
      setOpenSidebar(false);
    }
  };

  return (
    <header className="w-full fixed">
      <div
        className={`${
          active
            ? "dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black shadow-xl transition duration-500"
            : "dark:shadow"
        } w-full h-[70px] z-[80] border-b border-[#ffffff1c]`}
      >
        <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full">
          <div className="w-full flex items-center justify-between p-3">
            {/* Logo */}
            <div>
              <Link
                href={"/"}
                className="text-[26px] font-Poppins font-[500] text-black dark:text-white"
              >
                Unocode
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <NavItems />

              <ThemeSwitcher />

              {user ? (
                <Link href="/profile">
                  <Image
                    src={user.avatar ? user.avatar : "/images/avatar.jpg"}
                    alt="user-avatar"
                    width={30}
                    height={30}
                    className="w-[30px] h-[30px] object-contain cursor-pointer"
                  />
                </Link>
              ) : (
                <Link href="/login">
                  <HiOutlineUserCircle
                    size={25}
                    className="cursor-pointer dark:text-white text-black"
                  />
                </Link>
              )}

              <div className="800px:hidden">
                <HiOutlineMenuAlt3
                  className="cursor-pointer dark:text-white text-black  "
                  onClick={() => setOpenSidebar(true)}
                  size={25}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile sidebar */}
        {openSidebar && (
          <div
            className="fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024]"
            id="screen"
            onClick={handleClose}
          >
            <div className="w-[70%] fixed z-[99999] h-screen bg-white dark:bg-slate-900 top-0 right-0 py-4">
              <div className="flex justify-end pr-5 gap-4">
                <ThemeSwitcher />

                {user ? (
                  <Link href="/profile">
                    {user ? (
                      <Image
                        src={user.avatar}
                        alt="user-avatar"
                        className="w-[30px] h-[30px] object-contain cursor-pointer rounded-full"
                      />
                    ) : (
                      <Image
                        src="../../public/images/avatar.jpg"
                        alt="user-avatar"
                        className="w-[30px] h-[30px] object-contain cursor-pointer"
                      />
                    )}
                  </Link>
                ) : (
                  <Link href="/login">
                    <HiOutlineUserCircle
                      size={25}
                      className="cursor-pointer dark:text-white text-black"
                    />
                  </Link>
                )}

                <MdOutlineClose
                  className="cursor-pointer dark:text-white text-black"
                  onClick={() => setOpenSidebar(false)}
                  size={25}
                />
              </div>

              <MobileNav handleClick={() => setOpenSidebar(false)} />
              <br />
              <br />
              <p className="text-[16px] px-2 pl-5 text-black dark:text-white">
                Copyright &copy; 2024 Unocode
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
