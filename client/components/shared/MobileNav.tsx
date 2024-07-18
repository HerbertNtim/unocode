"use client";

import { navItemData } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

type MobileProps = {
  handleClick:  () => void
}

const MobileNav = ({handleClick}: MobileProps) => {
  const pathname = usePathname();
  return (
    <ul className="800px:hidden flex flex-col gap-8">
      {navItemData.map((item, index) => {
        const isActive = pathname === item.url;

        return (
          <li key={index}>
            <Link href={item.url} onClick={handleClick}>
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
  );
};

export default MobileNav;
