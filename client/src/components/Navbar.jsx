import React from 'react';
import { Link } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import useAuthStore from '../store/useAuthStore';

const Navbar = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  return (
    <>
      <nav className="flex justify-between items-center z-50 w-full bg-[#063945] px-6 py-2 lg:px-10 sticky top-0 shadow-md">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/icons/logo.svg"
            width={50}
            height={50}
            alt="logo"
            className="max-sm:hidden"
          />
          <p className="text-[26px] font-extrabold text-[#F9FAFB]  max-sm:hidden">
            FAIR FORSE MEETING
          </p>
        </Link>

        <div className='flex-shrink-0'>
          {isLoading ? (
            <div className="w-[170px] h-10"></div>
          ) : (
            !isAuthenticated ? (
              <>
                <Link to="/signin">
                  <button className="bg-[#FBBF24] text-[#063945] font-semibold px-4 py-2 rounded-lg transition-colors hover:bg-[#ffcf5d] mr-2">
                    Sign In
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="bg-[#FBBF24] text-[#063945] font-semibold px-4 py-2 rounded-lg transition-colors hover:bg-[#ffcf5d]">
                    Sign Up
                  </button>
                </Link>
              </>
            ) : (
              <ProfileDropdown user={user} />
            )
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
