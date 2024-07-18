"use client"

import { navItemData } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavItems = () => {
  const pathname = usePathname();

  return (
    <>
      <ul className="hidden 800px:flex">
        {navItemData.map((item, index) => {
          const isActive = pathname === item.url;

          return (
            <li key={index}>
              <Link  href={item.url}>
                <span
                  className={`${
                    isActive
                      ? "dark:text-[#37a39a] text-[crimson]"
                      : "dark:text-white text-black"
                  } text-[18px] px-6 font-Poppins font-[400]`}
                >
                  {item.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default NavItems;
