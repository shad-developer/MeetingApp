import React, { useState } from "react";
import { sidebarLinks } from "../constants/sidebarLinks";
import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { Menu, X } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="sm:hidden fixed top-2 left-2 z-50 p-2 rounded-lg bg-white/10 text-[#F9FAFB] backdrop-filter backdrop-blur-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <section
        className={clsx(
          "fixed top-14 left-0 h-screen p-6 z-40 transform transition-transform duration-300 sm:static sm:translate-x-0 sm:w-[264px] sm:flex sm:flex-col sm:justify-between",
          "bg-gradient-to-b from-[#063945] to-[#1a4a58] text-[#F9FAFB]",
          "backdrop-filter backdrop-blur-3xl bg-opacity-80",
          {
            "-translate-x-full": !isOpen, // hidden on mobile
            "translate-x-0 w-64": isOpen, // visible on mobile
          }
        )}
      >
        <div className="flex flex-1 flex-col gap-2">
          {/* image logo */}
          <Link to="/" className="flex items-center gap-2 min-md:hidden">
            <img
              src="/icons/logo.svg"
              width={50}
              height={50}
              alt="logo"
            />
            <p className="text-base font-extrabold text-[#F9FAFB]">
              FAIRFORSE MEETING
            </p>
          </Link>


          {sidebarLinks.map((link) => {
            const isActive =
              link.route === "/"
                ? pathname === "/"
                : pathname === link.route ||
                pathname.startsWith(`${link.route}/`);

            return (
              <Link
                to={link.route}
                key={link.label}
                onClick={() => setIsOpen(false)} // close on click (mobile UX)
                className={clsx(
                  "flex gap-4 items-center p-3 rounded-lg transition-colors border-amber-500 border-2",
                  {
                    "bg-amber-500 text-[#063945]": isActive, // Active link color and text
                    "hover:bg-[#1a4a58]": !isActive, // Hover for inactive links
                    "bg-white/10 backdrop-filter backdrop-blur-sm": !isActive,
                  }
                )}
              >
                {link.imgURL && (
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className="w-6 h-6 object-contain"
                  />
                )}
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default Sidebar;
