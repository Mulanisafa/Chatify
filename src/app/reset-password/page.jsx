"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import UseAxiosPublic from "../hooks/useAxiosPublic";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setotpSent] = useState(false);
  const [otpVeried, setOtpVerified] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // document.title = "Reset Password || Chatify";
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const axiosPublic = UseAxiosPublic();
  const handleOTPsend = async (e) => {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    e.preventDefault();
    // console.log("Email to send OTP:", email);
    // send email to backend and first checck is the email exists and then if exists then send OTP
    try {
      const response = await axiosPublic.post("/auth/reset-password", {
        email: email,
      });
      setSuccessMessage(response?.data?.message);
      setLoading(false);
      setotpSent(true);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message);
      setLoading(false);
      setotpSent(false);
    }
  };

  // verify the OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setLoading(true);
    try {
      const response = await axiosPublic.post("/reset-password/verify-otp", {
        email,
        otp,
      });
      setSuccessMessage(response?.data?.message);
      setOtpVerified(true);
      setLoading(false);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message);
      setLoading(false);
      setOtpVerified(false);
    }
  };
  const onSubmit = async (data) => {
    setSuccessMessage("");
    setErrorMessage("");
    setLoading(true);
    const password = data?.password;
    try {
      const response = await axiosPublic.post("/auth/password/reset", {
        email: email,
        password: password,
      });
      setSuccessMessage(response?.data?.message);
      setLoading(false);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message);
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col py-10 min-h-screen items-center bg-gray-100">
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-xl font-semibold">Reset Password</h3>
        <p className="text-gray-600 text-sm">
          Enter your email to receive a verification code
        </p>
      </div>

      <div className="bg-white my-5 shadow-2xl rounded-lg w-full max-w-sm p-10">
        {/* Send OTP */}
        {!otpSent && !otpVeried && (
          <form onSubmit={handleOTPsend} className="flex flex-col gap-4">
            <label className="text-gray-700 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="bg-[#6956DF] cursor-pointer  text-white p-2 rounded-lg transition"
            >
              {loading ? "Sending OTP..." : otpSent ? "Sent" : "Send OTP"}
            </button>
          </form>
        )}
        {/* Verify OTP */}
        {otpSent && !otpVeried && (
          <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4">
            <label className="text-gray-700 font-medium">Verify OTP</label>
            <input
              type="number"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="bg-[#6956DF] cursor-pointer text-white p-2 rounded-lg transition"
            >
              {loading ? "Veryfing OTP" : "Verify OTP"}
            </button>
          </form>
        )}
        {/* Update Password */}
        {otpSent && otpVeried && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <label className="text-gray-700 font-medium"> New Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
                  message:
                    "Password must contain at least 1 uppercase, 1 lowercase, and 1 number",
                },
              })}
              className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#7169EF]"
              placeholder="Enter your new password"
            />

            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}

            <button
              type="submit"
              className="bg-[#6956DF] cursor-pointer  text-white p-2 rounded-lg transition"
            >
              Set Password
            </button>
          </form>
        )}
        <div className="py-2">
          {successMessage && (
            <p className="text-green-500 text-center">{successMessage}</p>
          )}
          {errorMessage && (
            <p className="text-red-500 text-center">{errorMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}
