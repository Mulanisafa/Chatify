"use client";
import UseAxiosSecure from "@/app/hooks/useAxiosSecure";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const userEmail = session?.user?.email;
  const [isEdit, setisEdit] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [save, setSave] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const axiosSecure = UseAxiosSecure();
  // useEffect(() => {
  //   document.title = "Profile || Chatify";
  // }, []);
  useEffect(() => {
    const fetchUser = async () => {
      if (userEmail) {
        try {
          setLoading(true);
          const response = await axiosSecure.post("/auth/find/Profile", {
            email: userEmail,
          });
          if (response?.data) {
            setUser(response?.data);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUser();
  }, [userEmail, refetch]);

  const handleEditButton = () => {
    setisEdit(!isEdit);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSave(true);
    const form = e.target;
    const name = form.name.value;
    const bio = form.bio.value;
    const image = form.image.files[0];

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);
      formData.append("email", user?.email);
      if (image) {
        formData.append("image", image);
      }

      const res = await fetch("https://chatify-server-1-1a8e.onrender.com/auth/update/profile", {
        method: "PATCH",
        body: formData,
      });

      const result = await res.json();
      if (result) {
        setSave(false);
        setisEdit(false);
        setRefetch(true); // Trigger refetch to update UI with the latest profile data
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <progress className="progress w-56"></progress>
      </div>
    );
  }

  return (
    <div className="flex flex-col py-10 min-h-screen items-center bg-white">
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-xl font-semibold">My Profile</h3>
      </div>

      <div className="bg-white my-5 shadow-2xl flex flex-col items-center rounded-lg max-sm:w-[90%] max-sm:mx-auto w-full max-w-lg p-8">
        <div className="w-[150px] h-[150px] border-2 rounded-full bg-gray-300 overflow-hidden">
          <img
            src={user?.profilePicture}
            alt="Profile"
            className="object-cover w-full h-full"
          />
        </div>

        <div className="py-10 w-full">
          <div className="flex items-center gap-5 text-xl  mb-5">
            <h2 className="text-xl">Personal Information</h2>
            {!isEdit && (
              <button onClick={handleEditButton}>
                <FiEdit title="Edit Personal Information" />
              </button>
            )}
          </div>

          {!isEdit ? (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-600">
                  Full Name
                </label>
                <p className="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none">
                  {user?.name}
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-600">
                  Email
                </label>
                <p className="mt-1 p-2 w-full rounded-md border bg-gray-200 border-gray-300 focus:outline-none">
                  {user?.email}
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-600">
                  Bio
                </label>
                <textarea
                  readOnly
                  rows="4"
                  className="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none"
                >
                  {user?.bio}
                </textarea>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProfileUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-600">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={user?.name}
                  className="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6464DD]"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email}
                  readOnly
                  disabled
                  className="mt-1 p-2 w-full bg-gray-200 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6464DD]"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-600">
                  Bio
                </label>
                <textarea
                  name="bio"
                  rows="4"
                  defaultValue={user?.bio}
                  className="mt-1 p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6464DD]"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-600">
                  Profile Image
                </label>
                <input
                  type="file"
                  name="image"
                  placeholder="Upload your profile Image"
                  className="mt-1 p-2 w-full rounded-md border focus:outline-none focus:ring-2 focus:ring-[#6464DD] border-dashed"
                />
              </div>

              <button
                type="submit"
                className="mt-6 w-full cursor-pointer py-2 text-lg bg-[#6464DD] text-white rounded-md hover:bg-[#6464DD] transition duration-300"
              >
                {save ? "Saving Changes" : "Save Changes"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
