'use client';
import axios from 'axios';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import UseAxiosSecure from '../hooks/useAxiosSecure';

export default function DashboardLayout({ children }) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const [user, setUser] = useState(null);
  const axiosSecure = UseAxiosSecure();
  const router = useRouter();

  const desktopDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        desktopDropdownRef.current && !desktopDropdownRef.current.contains(event.target) &&
        mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  

  useEffect(() => {
    const fetchUser = async () => {
      if (userEmail) {
        try {
          const response = await axiosSecure.post('/auth/find/Profile/', {
            email: userEmail,
          });
          if (response?.data) {
            setUser(response?.data);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchUser();
  }, [userEmail]);

  const handleLogOut = async () => {
    if (user) {
      try {
        await axios.post('https://chatify-server-1-1a8e.onrender.com/api/auth/logOut', {
          email: userEmail,
        });
      } catch (error) {
        console.log(error?.message);
      }
    }
    await signOut({ redirect: true, callbackUrl: '/login' });
  };

  useEffect(() => {
    document.title = 'Dashboard || Chatify';
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="w-64 max-md:hidden overflow-y-auto p-10 space-y-6 fixed inset-y-0 left-0 bg-[#7F6EEA] border-r border-gray-200">
      <div className="h-3/4 flex flex-col py-10 justify-around text-center">
          <nav className="space-y-4 flex flex-col">
            <Link href={'/dashboard/chat'}><h2 className="text-3xl font-semibold text-white mb-6">Chatify</h2></Link>

            <div className="space-y-4">
              <Link href="/dashboard/chat" className="block text-lg text-white hover:text-gray-700 transition duration-300">Chats</Link>
              <Link href="/dashboard/contacts" className="block text-lg text-white hover:text-gray-700 transition duration-300">Contacts</Link>
              <Link href="/dashboard/profile" className="block text-lg text-white hover:text-gray-700 transition duration-300">Profile</Link>
              <Link href="/dashboard/settings" className="block text-lg text-white hover:text-gray-700 transition duration-300">Settings</Link>
            </div>

            {/* Desktop Profile Dropdown */}
            <div ref={desktopDropdownRef} className="mt-30 relative">
              <div
                className="w-16 h-16 mx-auto relative cursor-pointer"
                onClick={toggleDropdown}
                title={`${user?.name}`}
              >
                <img
                  src={
                    user?.profilePhotoVisibility === 'everyone'
                      ? user?.profilePicture
                      : 'https://res.cloudinary.com/dtkvrvpjq/image/upload/v1744179391/user_profiles/zjjes3amtrq0jmqol5ku.jpg' || 'https://res.cloudinary.com/dtkvrvpjq/image/upload/v1744179391/user_profiles/zjjes3amtrq0jmqol5ku.jpg'
                  }
                  alt={user?.name || 'User'}
                  className="rounded-full w-full h-full object-cover"
                />
                <div
                  className={`w-3 h-3 ${user?.isOnline && user?.OnlineStatus === 'true' ? 'bg-green-400' : 'bg-red-400'} rounded-full absolute bottom-0 right-0 ring-2 ring-white`}
                />
              </div>

              {dropdownOpen && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-4 text-white w-48 rounded shadow-lg z-10 p-4 bg-[#6F5EDA]">
                  <p className="text-center mb-3 text-sm font-semibold">{user?.name}</p>
                  <button
                    onClick={handleLogOut}
                    title="Logout"
                    className="w-full font-semibold px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md transition duration-300"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </aside>

      {/* Mobile Bottom Navbar */}
      <nav className="fixed bottom-0 left-0 w-full bg-[#7F6EEA] border-t border-gray-200 px-5 items-center py-2 md:hidden z-50">
      <div className=" flex flex-row  items-center  gap-1 justify-between text-center">
      <Link href={'/dashboard/chat'}><h2 className="text-3xl max-sm:text-xl font-semibold text-white ">Chatify</h2></Link>

            <div className="flex flex-row gap-2">
              <Link href="/dashboard/chat" className="block text-sm text-white hover:text-gray-700 transition duration-300">Chats</Link>
              <Link href="/dashboard/contacts" className="block text-sm text-white hover:text-gray-700 transition duration-300">Contacts</Link>
              <Link href="/dashboard/profile" className="block text-sm text-white hover:text-gray-700 transition duration-300">Profile</Link>
              <Link href="/dashboard/settings" className="block text-sm text-white hover:text-gray-700 transition duration-300">Settings</Link>
            </div>

            <div ref={mobileDropdownRef} className=" relative">
              <div
                className="w-12 h-12 mx-auto relative cursor-pointer"
                onClick={toggleDropdown}
                title={`${user?.name}`}
              >
                <img
                  src={
                    user?.profilePhotoVisibility === 'everyone'
                      ? user?.profilePicture
                      : 'https://res.cloudinary.com/dtkvrvpjq/image/upload/v1744179391/user_profiles/zjjes3amtrq0jmqol5ku.jpg'
                  }
                  alt={user?.name || 'User'}
                  className="rounded-full w-full h-full object-cover"
                />
                <div
                  className={`w-3 h-3 ${user?.isOnline && user?.OnlineStatus === 'true' ? 'bg-green-400' : 'bg-red-400'} rounded-full absolute bottom-0 right-0 ring-2 ring-white`}
                />
              </div>

              {dropdownOpen && (
                <div className="absolute -ml-30  -mt-40 text-white w-48 rounded shadow-lg z-10 p-4 bg-[#59537a]">
                  <p className="text-center mb-3 text-sm font-semibold">{user?.name}</p>
                  <button
                    onClick={handleLogOut}
                    title="Logout"
                    className="w-full font-semibold px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md transition duration-300"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-md:ml-0 ml-64 min-h-screen p-2 overflow-y-auto pb-16 md:pb-2">{children}</main>
    </div>
  );
}
