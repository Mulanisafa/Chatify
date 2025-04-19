"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import UseAxiosPublic from "../hooks/useAxiosPublic";
import { useSession } from "next-auth/react";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user;
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const axiosPublic = UseAxiosPublic();
  // document.title = "Register || Chatify";
  const onSubmit = async (data) => {
    try {
      // Send the registration data to the backend
      const response = await axiosPublic.post("/api/auth/register/user", {
        name: data?.name,
        email: data?.email,
        password: data?.password,
      });

      console.log(response.data.message);
      setSuccessMessage(response.data.message);
      setErrorMessage("");
      reset();
      router.push("/login");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      setSuccessMessage("");

      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  if (user) {
    router.push("/dashboard/chat");
  }

  return (
    <div className="flex flex-col justify-center min-h-screen items-center bg-gray-100">
      <h2 className="text-center  bg-gradient-to-r from-[#7971E3]  to-[#b7b4db] bg-clip-text text-transparent text-4xl py-5 font-bold">
        Chatify
      </h2>

      <div className="flex flex-col items-center gap-2">
        <h3 className="text-2xl font-semibold">Register</h3>
        <p className="text-gray-600">Register to continue Chatify</p>
      </div>

      {/* Success & Error Messages */}
      {errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-green-500 text-sm mt-2">{successMessage}</p>
      )}

      <div className="bg-white my-5 shadow-2xl rounded-lg w-full max-w-sm p-10">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Name Field */}
          <label className="text-gray-700 font-medium">Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#7169EF]"
            placeholder="Enter your Name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}

          {/* Email Field */}
          <label className="text-gray-700 font-medium">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#7169EF]"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          {/* Password Field */}
          <label className="text-gray-700 font-medium">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                message:
                  "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number",
              },
            })}
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#7169EF]"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}

          <button
            type="submit"
            className="btn bg-[#7169EF] text-white rounded-lg p-2 hover:bg-[#5b53e0] transition"
          >
            Register
          </button>
        </form>
        <div>
          <p className="text-center py-2">
            Already have an account?
            <Link className="font-bold" href="/login">
              {" "}
              Log In Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
