import React, { useState,useEffect } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../utils/firebase.js";
// import Loader from "../utils/Loader.js";
import image from "../images/default.webp";
import { MdSpaceDashboard } from "react-icons/md";
import { HiUsers } from "react-icons/hi2";
import { SiGoogleanalytics } from "react-icons/si";
import { BiSolidMessageSquareDetail } from "react-icons/bi";
import { IoMdNotifications } from "react-icons/io";
import { MdMoreHoriz } from "react-icons/md";
import { RiAccountPinCircleFill } from "react-icons/ri";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdPages } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { RiPagesFill } from "react-icons/ri";
import { FaServicestack } from "react-icons/fa";
import { MdDesignServices } from "react-icons/md";

function Sidebar() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(null);
 
  const name = window.localStorage.getItem("name");
  
//console.log(id)
  const userRole= window.localStorage.getItem("role");

  
  
  const logOut = () => {
    window.localStorage.clear();
    navigate("/loginUser");
   
  };

  const OPTIONS = [
    {
      name: "Dashboard",
      icon: <MdSpaceDashboard />,
      path: "/dashboard",
      role: "admin",
    },
    { name: "Users", icon: <HiUsers />, path: "/allUsers", role: "admin" },
    {
      name: "Pages",
      icon: <SiGoogleanalytics />,
      path: "/pageList",
      role: "admin",
    },
    {
     name:"User Pages",
     icon:<RiPagesFill />,
     path:"/pagePermissions",
     role:"admin"
     
    },
    {
      name: "Services",
      icon: <MdDesignServices />,
      path: "/servicesPage",
      role: "admin",
    },
    {
      name:"User Services",
      icon:<FaServicestack />,
      path:'/servicesPermission',
      role:'admin'
    },
    // {
    //   name: "Notifications",
    //   icon: <IoMdNotifications />,
    //   path: "#",
    //   role: "admin",
    // },
    // {
    //   name: "More Details",
    //   icon: <MdMoreHoriz />,
    //   path: "#",
    //   role: "admin",
    // },
    {
      name: "My Account",
      path: "/userAccount",
      icon: <RiAccountPinCircleFill />,
      role: "user",
    },
    {
      name: "Pages",
      path: "/userPages",
      icon: <MdPages />,
      role: "user",
      
    },
    {
      name: "Services",
      icon: <MdDesignServices />,
      path: "/userServices",
      role: "user",
    },
    {
      name: "Forgot Password",
      path: "/forgotPassword",
      icon: <RiLockPasswordFill />,
      role: "user",
    },
  ];
  
// console.log(window.location.pathname )
  const filteredOptions = OPTIONS.filter((option) => option.role === userRole);
  useEffect(() => {
    // Set active state based on current path on initial render
    const currentPath = window.location.pathname;
    const activeIndex = filteredOptions.findIndex(option => option.path === currentPath);
    setIsActive(activeIndex);
  }, [filteredOptions]);
  return (
    <div className="bg-custom-gradient w-1/6 min-h-screen py-5 pl-4">
      <div className="pr-4">
      <div className="border-2 rounded-lg border-[#00215E] shadow-slate-600 shadow-md px-5 py-5">
        <div className="justify-center items-center flex mb-3">
          <img src={image} className="w-10 h-10 rounded-3xl" alt="img" />
        </div>
        <h1 className="text-xl font-semibold text-center text-[#00215E] ">
          {name}
        </h1>
      </div></div>
      <div className="mt-8">
        {filteredOptions.map((option, index) => (
        // window.location.pathname ===option.path? setIsActive(index):(null)
         (<div 
            key={index}
            onClick={() => {
              setIsActive(index);
             if (option.path) {
                navigate(option.path);
              }
            }}
            className={`flex my-3 p-2 rounded-lg hover:cursor-pointer gap-3 ${
              isActive === index ? "bg-white p-0 my-0 rounded-none" : ""
            }`}
          >
            <span className="text-lg flex items-center">{option.icon}</span>
            <h1 className="text-lg text-[#042a77] font-medium">
              {option.name}
            </h1>
          </div>)
        ))}
        <div className="flex my-3 p-2 mr-2 rounded-lg hover:cursor-pointer gap-3 hover:border-2 pr-4 hover:border-blue-200 hover:shadow-md " onClick={logOut}>
          <span className="text-lg flex items-center ">
            <IoLogOut />
          </span>
          <button
            
            className="text-lg text-[#042a77] font-medium  "
          >
            LogOut
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
