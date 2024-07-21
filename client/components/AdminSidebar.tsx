"use client";

import { Box, IconButton, Typography } from "@mui/material";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, MenuItem, ProSidebar } from "react-pro-sidebar";
import { useSelector } from "react-redux";
import { ArrowBackIosIcon, ArrowForwardIosIcon, GroupsIcon, HomeOutlinedIcon, ReceiptOutlinedIcon } from "@/constants";
import Image from "next/image";

interface itemProps {
  title: string;
  to: string;
  icon: JSX.Element;
  selected: string;
  setSelected: any;
}

const Item: React.FC<itemProps> = ({
  title,
  to,
  icon,
  selected,
  setSelected,
}) => {
  return <MenuItem
    icon={icon}
    active={selected === title}
    onClick={() => setSelected(title)}
  >
    <Typography className="!text-[16px] !font-Poppins">{title}</Typography>
    <Link href={to} />
  </MenuItem>;
};

const AdminSidebar = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [logout, setLogout] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [mounted, setMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  const handleLogout = () => {
    setLogout(true);
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${
            theme === "dark" ? "#111C43 !important" : "#fff !important"
          }`,
        },
        "& .pro-icon-wrapper": {
          background: "transparent !important",
        },
        "& .pro-inner-item:hover": {
          color: "#6870fb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
          opacity: 1,
        },
        "& .pro-menu-item": {
          color: `${theme !== "dark" && "#000"}`,
        },
      }}
      className="!bg-white dark:bg-[#111C43]"
    >
      <ProSidebar
        collapsed={isCollapsed}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: isCollapsed ? "0" : "16%",
        }}
      >
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <ArrowForwardIosIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
            }}
          >
            {isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Link href="/">
                  <h3 className="text-[25px] font-Poppins uppercase dark:text-white text-black">
                    Unocode
                  </h3>
                </Link>
                <IconButton
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="inline-block"
                >
                  <ArrowBackIosIcon className="text-black dark:text-white" />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <Image
                  src={user?.avatar || "/images/avatar.jpg"}
                  alt="avatar"
                  width={120}
                  height={120}
                  className="w-[120px] h-[120px] cursor-pointer border-[3px] border-[#37a39a] rounded-full"
                  style={{
                    cursor: "pointer",
                    borderRadius: "50%",
                    border: "3px solid #5b6fea",
                  }}
                  priority
                />
              </Box>

              <Box textAlign="center">
                <Typography
                  variant="h4"
                  className="!text-[20px] text-black dark:text-[#ffffffc1]"
                  sx={{ m: "10px 0 0  0" }}
                >
                  {user?.name}
                </Typography>
                <Typography
                  variant="h6"
                  className="!text-[20px] text-black dark:text-[#ffffffc1] capitalize"
                  sx={{ m: "10px 0 0 0" }}
                >
                  - {user?.role}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/admin"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography variant="h5" className="!text-[18px] text-black dark:text-[#ffffffc1] capitalized !font-[400]">{!isCollapsed && "Data"}</Typography>

            <Item title="Users" to="admin/users" icon={<GroupsIcon />} selected={selected} setSelected={setSelected} />

            <Item title="Invoices" to="admin/invoices" icon={<ReceiptOutlinedIcon />} selected={selected} setSelected={setSelected} />

            <Typography variant="h5" className="!text-[18px] text-black dark:text-[#ffffff1c] capitalize !font-[400]">
              {!isCollapsed && "Content"}
            </Typography>
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default AdminSidebar;
