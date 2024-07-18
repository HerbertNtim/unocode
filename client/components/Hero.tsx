"use client";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {

  return (
    <section className="w-full h-[90%] py-10 sm:py-0">
      <div className="1100px:flex items-center justify-between gap-4 px-16 py-10">
        <div className="flex-1 w-full">
          <h1 className="font-Poppins text-wrap font-extrabold text-5xl mt-0 mb-1 py-3 leading-normal dark:text-white/90 text-black/80">
            Grow up your skills by online learning with{" "}
            <span className="text-[crimson] font-black px-4">Unocode</span>
          </h1>
          <p className="leading-normal py-1 font-Poppins font-medium text-gray-600 dark:text-white/60">
            Unocode is an online learning platform that helps you to learn the
            latest technologies and skills to grow your career.
          </p>

          <div className="w-full flex items-end justify-between my-4 sm:hidden">
            <p className="flex flex-col gap-0">
              <span className="text-3xl font-extrabold font-Josefin text-rose-500 dark:text-[#FCD980]">2,000+</span>
              <span className="dark:text-gray-300 font-Josefin text-black/65">courses available</span>
            </p>
            <p>
              <span className="text-3xl font-extrabold font-Josefin text-rose-500 dark:text-[#FCD980]">100+</span>
              <br />
              <span className="dark:text-gray-300 font-Josefin text-black/65">instructors</span>
            </p>
            <p>
              <span className="text-3xl font-extrabold font-Josefin text-rose-500 dark:text-[#FCD980]">150+</span>
              <br />
              <span className="dark:text-gray-300 font-Josefin text-black/65">enrolled in courses</span>
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 px-4 py-6 my-8 font-semibold">
            <Link
              href={"/courses"}
              className="px-4 py-2 font-semibold text-lg bg-yellow-500 text-black rounded-md shadow-sm hover:bg-[#FCD980] dark:bg-[#FCD980] dark:hover:bg-yellow-500"
            >
              View Courses
            </Link>
            <Link
              href={"/login"}
              className="px-4 py-2 font-semibold text-lg bg-rose-500 text-black rounded-md shadow-sm hover:bg-[crimson] dark:bg-[crimson] dark:hover:bg-rose-300"
            >
              Register Now
            </Link>
          </div>
        </div>

        <div className="w-full flex-1 py-12">
          <Image
            src={"/images/hero.svg"}
            alt="hero"
            width={200}
            height={200}
            className="w-[100%] px-8 py-10 hidden dark:hidden sm:dark:block"
            priority
          />

          <Image
            src={"/images/hero-light.png"}
            alt="hero"
            width={200}
            height={200}
            className="object-cover w-[100%] px-8 py-10 dark:hidden hidden sm:block"
          />

          <div className="w-full sm:flex items-end justify-between hidden">
            <p className="flex flex-col gap-0">
              <span className="text-3xl font-extrabold font-Josefin text-rose-500 dark:text-[#FCD980]">2,000+</span>
              <span className="text-black/65 dark:text-gray-300 font-Josefin">courses available</span>
            </p>
            <p>
              <span className="text-3xl font-extrabold font-Josefin text-rose-500 dark:text-[#FCD980]">100+</span>
              <br />
              <span className="dark:text-gray-300 font-Josefin text-black/65">instructors</span>
            </p>
            <p>
              <span className="text-3xl font-extrabold font-Josefin text-rose-500 dark:text-[#FCD980]">150+</span>
              <br />
              <span className="text-black/65 dark:text-gray-300 font-Josefin">enrolled in courses</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
