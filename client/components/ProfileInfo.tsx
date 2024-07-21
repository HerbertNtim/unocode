"use client";

import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useUpdateAvatarMutation } from "@/redux/features/user/userApi";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import { useSelector } from "react-redux";

const ProfileInfo = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [updateAvatar, {isSuccess, error}] = useUpdateAvatarMutation();
  const [name, setName] = useState(user && user.name);
  const [loadUser, setLoadUser] = useState(false);
  const {} = useLoadUserQuery(undefined, {skip: loadUser ? false : true});

  const imageHandler = async (e: any) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if(fileReader.readyState === 2) {
        const avatar = fileReader.result;
        updateAvatar(
          avatar
        );
      }
    }
    fileReader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    if(isSuccess){
      setLoadUser(true);
    } if(error){
      console.log(error);
    }
  }, [isSuccess, error])

  return (
    <>
      <div className="flex justify-center w-full">
        <div className="relative mb-4 pb-6">
          <Image
            src={user?.avatar || "/images/avatar.jpg"}
            alt="avatar"
            width={120}
            height={120}
            className="w-[120px] h-[120px] cursor-pointer border-[3px] border-[#37a39a] rounded-full"
            priority
          />
          <input
            type="file"
            name=""
            id="avatar"
            className="hidden"
            onChange={imageHandler}
            accept="image/*"
          />
          <label htmlFor="avatar">
            <div className="w-[30px] h-[30px] bg-slate-900 rounded-full absolute bottom-4 right-2 flex items-center justify-center cursor-pointer">
              <AiOutlineCamera size={20} className="z-1" />
            </div>
          </label>
        </div>
      </div>

      <div className="w-full pl-6 800px:pl-10">
        <form>
          <div className="800px:w-[90%] m-auto block pb-4">
            <div className="w-full">
              <label className="block pb-3 text-xl">Full Name</label>
              <input
                type="text"
                className="!w-[95%] mb-4 800px:mb-0 py-2 px-4 rounded-sm border border-gray-300"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="pt-5 w-full">
              <label className="block pb-3 text-xl">Email Address</label>
              <input
                type="text"
                readOnly
                className="!w-[100%] mb-4 800px:mb-0 py-2 px-4 rounded-sm border border-gray-300"
                required
                value={user?.email}
              />
            </div>

            <input type="submit" className="submit mt-8 " required value="Update" />
          </div>
        </form>
      </div>
    </>
  );
};

export default ProfileInfo;
