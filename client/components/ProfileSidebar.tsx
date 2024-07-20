'use client'

import { useLogoutMutation } from "@/redux/features/auth/authApi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AiOutlineLogout } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { SiCoursera } from "react-icons/si";
import { useSelector } from "react-redux";

type ProfileSidebarProps = {
  active: number;
  avatar: string | null;
  setActive: (active: number) => void;
};

const ProfileSidebar = ({
  active,
  avatar,
  setActive,
}: ProfileSidebarProps) => {
  const { user } = useSelector((state: any) => state.auth)
  const [logout] = useLogoutMutation()
  const router = useRouter()

  const logOutHandler = async () => {
    await logout().unwrap()  
    router.push('/')
  }

  
  return (
    <div className="w-full flex flex-col py-4">
      <div
        className={`w-full flex items-center px-5 py-4 cursor-pointer ${
          active === 1 ? "bg-slate-800" : "bg-transparent"
        }`}
        onClick={() => setActive(1)}
      >
        <Image
          src={
            user.avatar || avatar ? user.avatar || avatar : "/images/avatar.jpg"
          }
          alt="user avatar"
          width={30}
          height={30}
          className="w-[20px] h-[20px] 800px:w-[30px] 800px:h-[30px] rounded-full cursor-pointer"
        />

        <h5 className="pl-2 800px:block hidden font-Poppins">My Account</h5>
      </div>

      <div
        className={`w-full flex items-center px-5 py-4 cursor-pointer ${
          active === 2 ? "bg-slate-800" : "bg-transparent"
        }`}
        onClick={() => setActive(2)}
      >
        <RiLockPasswordLine size={20} fill="#fff" />

        <h5 className="pl-2 800px:block hidden font-Poppins">
          Change Password
        </h5>
      </div>

      <div
        className={`w-full flex items-center px-5 py-4 cursor-pointer ${
          active === 3 ? "bg-slate-800" : "bg-transparent"
        }`}
        onClick={() => setActive(3)}
      >
        <SiCoursera size={20} fill="#fff" />

        <h5 className="pl-2 800px:block hidden font-Poppins">
          Enrolled Courses
        </h5>
      </div>

      <div
        className={`w-full flex items-center px-5 py-4 cursor-pointer ${
          active === 3 ? "bg-slate-800" : "bg-transparent"
        }`}
        onClick={logOutHandler}
      >
        <AiOutlineLogout size={20} fill="#fff" />

        <h5 className="pl-2 800px:block hidden font-Poppins"
        >
          Log Out
        </h5>
      </div>
    </div>
  );
};

export default ProfileSidebar;
