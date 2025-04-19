"use client";
import UseAxiosSecure from "@/app/hooks/useAxiosSecure";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";

export default function ContactsPage() {
  const { data: session, status } = useSession();
  const [Contacts, setContacts] = useState();
  const [user, setUser] = useState();
  const userEmail = session?.user?.email;
  const [search, SetSearch] = useState("");
  const router = useRouter();
  const axiosSecure = UseAxiosSecure();
  // useEffect(() => {
  //   document.title = "Contacts || Chatify";
  // }, []);
  useEffect(() => {
    const UserFecth = async () => {
      try {
        const response = await axiosSecure.post("/auth/find/Profile/", {
          email: userEmail,
        });
        if (response?.data) {
          setUser(response?.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    UserFecth();
  }, [userEmail]);
  useEffect(() => {
    const fetchrecent = async () => {
      try {
        const response = await axiosSecure.post(
          `/api/find/all/contacts?search=${search}`,
          { email: userEmail }
        );
        if (response.data) {
          setContacts(
            response?.data.sort((a, b) => {
              const aOnline = a.isOnline && a.OnlineStatus === "true";
              const bOnline = b.isOnline && b.OnlineStatus === "true";
              return bOnline === aOnline ? 0 : bOnline ? 1 : -1;
            })
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (user?._id) {
      fetchrecent();
    }
  }, [user?._id, search]);

  //handleChatPage
  const handleChatPage = (id) => {
    router.push(`/dashboard/chat/${id}`);
  };
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-[90%] mx-auto bg-white  text-black p-6 space-y-4">
        <h2 className="text-xl text-center font-bold mb-4">Contacts</h2>
        <div>
          <div className="relative w-full">
            <IoIosSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
            <input
              type="text"
              placeholder="Search Contacts"
              onChange={(e) => SetSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition duration-200"
            />
          </div>

          <div>
            {/* Contacts all */}
            <div
              className="overflow-y-auto my-2 h-[60vh] flex flex-col gap-1 "
              style={{ scrollbarWidth: "none" }}
            >
              {/*  */}
              {Contacts?.map((contact, index) => (
                <div
                  key={index}
                  onClick={() => handleChatPage(contact?.id)}
                  className="bg-white hover:bg-[#f1f5fb] transition duration-300 rounded-lg shadow-sm hover:shadow-lg flex items-center justify-between p-4 mb-2"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12">
                      <Image
                        src={
                          contact?.profilePhotoVisibility === "everyone"
                            ? contact?.profilePicture
                            : "https://res.cloudinary.com/dtkvrvpjq/image/upload/v1744179391/user_profiles/zjjes3amtrq0jmqol5ku.jpg"
                        }
                        alt={contact?.username || "User"}
                        width={48}
                        height={48}
                        className="rounded-full object-cover w-full h-full"
                      />
                      <div
                        className={`w-3 h-3 ${
                          contact?.isOnline && contact?.OnlineStatus === "true"
                            ? "bg-green-400"
                            : "bg-red-400"
                        }  rounded-full absolute bottom-0 right-0 ring-2 ring-white`}
                      />
                    </div>

                    <div className="flex flex-col">
                      <h2 className="text-sm font-semibold text-gray-800">
                        {contact?.name || "Unknown"}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {contact?.isOnline && contact?.OnlineStatus === "true"
                          ? "I am available right now"
                          : "Offline now, leave a message!"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
